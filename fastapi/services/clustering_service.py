from typing import List
from services.openai_service import OpenAIService
from models import Note
from services.utils import parse_embedding, preprocess_text, supabase_client
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
from sklearn.metrics import silhouette_score
from dotenv import load_dotenv
import umap
import hdbscan
import numpy as np
import pandas as pd
import json
import openai
import os

load_dotenv()

MAX_CHAR_LIMIT = 2000

class ClusteringService:
    """
    Service for clustering and categorizing notes.
    """

    def __init__(self, user: dict):
        self.user = user

    def update_database(self, clusterData: List[dict], notes: List[Note]):
        """
        Updates the database with the new clusters and categories.
        """

        # Query the users table to get the internal user ID
        user_response = supabase_client.table("users").select("id, locked_categories").eq("auth_id", self.user["sub"]).single().execute()

        if user_response.data is None:
            raise Exception("User not found in database.")

        user = user_response.data

        id_lookup = {note.content: note.id for note in notes}
        
        for note in clusterData:
            note_id = id_lookup.get(note["Note"])
            category = note["Category"]
            cluster = note["Cluster"]

            response = supabase_client.table("notes").update({
                "category": category,
                "cluster": cluster
            }).eq("id", note_id).execute()

            if response.data is None:
                raise Exception("Note not found in database.")
            
        return {"success": "Database updated successfully"}

    def group_and_label_notes(self):
        """
        Groups notes into clusters and labels each cluster with a category.
        """

         # Query the users table to get the internal user ID
        user_response = supabase_client.table("users").select("id, locked_categories").eq("auth_id", self.user["sub"]).single().execute()

        if user_response.data is None:
            raise Exception("User not found in database.")

        user = user_response.data

        locked_categories = user.get("locked_categories", [])\
        
        locked_notes_response = supabase_client.table("notes").select("*").eq("user_id", user["id"]).in_("category", locked_categories).execute()

        if locked_notes_response.data is None:
            raise Exception("Locked notes not found in database.")

        locked_notes_data = locked_notes_response.data

        locked_notes = [Note(**parse_embedding(n)) for n in locked_notes_data if n.get("embedding")]

        # Group embeddings by locked category
        locked_category_embeddings = defaultdict(list)

        for note in locked_notes:
            if note.embedding and note.category:
                locked_category_embeddings[note.category].append(np.array(note.embedding))

        # Now average them
        locked_category_centroids = {}

        for category, embeddings in locked_category_embeddings.items():
            centroid = np.mean(embeddings, axis=0)
            locked_category_centroids[category] = centroid

        unlocked_notes_response = supabase_client.table("notes").select("*").eq("user_id", user["id"]).not_.in_("category", locked_categories).execute()

        if unlocked_notes_response.data is None:
            raise Exception("Notes not found in database.")

        unlocked_notes_data = unlocked_notes_response.data

        notes_to_cluster = [Note(**parse_embedding(n)) for n in unlocked_notes_data if n.get("embedding")]

        notes_to_remove = []

        sorting_updates = []

        clustered_updates = []

        for note in notes_to_cluster:
            best_category = None
            best_score = 0  # Reset per note

            for category, centroid in locked_category_centroids.items():
                score = cosine_similarity([note.embedding], [centroid])[0][0]
                if score > best_score:
                    best_score = score
                    best_category = category

            if best_score > 0.4:
                note.category = best_category

                print(f"Updating note {note.id} to category {best_category}")
                response = supabase_client.table("notes").update({
                    "category": best_category
                }).eq("id", note.id).execute()

                if response.data is None:
                    raise Exception(f"Note {note.id} not found in database.")
                
                note_preview = ' '.join(note.content.split()[:10])
                sorting_updates.append(f"Spark moved to existing sparkpad: {best_category} ({note_preview})\n")

                # Mark note for removal after loop
                notes_to_remove.append(note)

        # After looping, remove notes that matched
        for note in notes_to_remove:
            notes_to_cluster.remove(note)

        if len(notes_to_cluster) <= 3:
            return sorting_updates, clustered_updates

        # Get embeddings for the notes
        embeddings = [note.embedding for note in notes_to_cluster]

        notes_content = [note.content for note in notes_to_cluster]

        preprocessed_notes_content = [preprocess_text(note.content) for note in notes_to_cluster]

        # Cluster the notes using HDBSCAN           
        labels = self.hdbscan_clustering(embeddings)

        # Create a dictionary to store a list of all notes in each cluster
        clustered_notes = defaultdict(list)
        for note_content, label in zip(preprocessed_notes_content, labels):
            clustered_notes[label].append(note_content)
        
        # Concatenate all notes in each cluster into a single string and store
        concatenated_clusters = {cluster: " ".join(preprocessed_notes_content)[:MAX_CHAR_LIMIT] for cluster, preprocessed_notes_content in clustered_notes.items()}

        # Generate a category name for each cluster
        generated_categories = {cluster: "Unsorted" if cluster == -1 else OpenAIService().generate_category(text) 
                               for cluster, text in concatenated_clusters.items()}

        # Convert the keys to integers
        generated_categories = {int(k): v for k, v in generated_categories.items()}

        # Compile results in a dataframe
        df = pd.DataFrame({"Note": notes_content, "Cluster": labels})

        # Map the cluster numbers to their respective generated categories
        df["Category"] = df["Cluster"].map(generated_categories)

        # Convert DataFrame to JSON format
        json_result = df.to_dict(orient="records")

        # Find the number of unique categories in the dataframe
        new_categories_count = df["Category"].nunique()

        clustered_updates.append(f"Created {new_categories_count} new sparkpads\n")
        # Count how many notes are in each category
        # category_counts = df["Category"].value_counts().to_dict()
        # for category, count in category_counts.items():
        #     print(f"Category '{category}': {count} notes")

        for note in json_result:
            note_preview = ' '.join(note["Note"].split()[:10])
            clustered_updates.append(f"Spark moved to new sparkpad: {note['Category']} ({note_preview})\n")

        self.update_database(json_result, notes_to_cluster)

        return sorting_updates, clustered_updates

    def hdbscan_clustering(self, embeddings):
        """
        Perform HDBSCAN clustering on the given embeddings.
        Returns the final labels after filtering by confidence.
        """
        # Step 1: Scale embeddings
        scaled_embeddings = StandardScaler().fit_transform(embeddings)

        min_cluster_size, min_samples, n_neighbors, n_components = self.adaptive_hdbscan_params(len(embeddings))

        # Step 2: Dimensionality reduction using UMAP (with fixed seed for reproducibility)
        umap_reducer = umap.UMAP(
            n_components=n_components,  # explicit for control
            n_neighbors=n_neighbors,
            min_dist=0.0,
            metric="cosine",
            random_state=42
        )
        reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

        # Step 4: Cluster using HDBSCAN
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size,
            min_samples=min_samples,
            metric='euclidean',  # use euclidean since UMAP was already cosine
            prediction_data=True
        )
        labels = clusterer.fit_predict(reduced_embeddings)

        if len(set(labels)) > 1:
            silhouette = silhouette_score(reduced_embeddings, labels)
            print(f"HDBSCAN Silhouette Score (excluding noise): {silhouette:.4f}")

            if silhouette < 0.25:
                labels[:] = -1
                print("Silhouette too low — treating all notes as unclustered.")
        else:
            print("Warning: Not enough distinct clusters for silhouette score.")

        # Step 7: Outlier summary
        outliers_count = np.sum(labels == -1)
        clusters_count = len(set(labels)) - (1 if -1 in labels else 0)

        print(f"Clusters found: {clusters_count}")
        print(f"Outliers detected: {outliers_count}")

        return labels

    def adaptive_hdbscan_params(self, n: int) -> tuple[int, int, int, int]:
        """
        Scale parameters proportionally with n.
        HDBSCAN params: min_cluster_size and min_samples.
        UMAP params: n_neighbors and n_components.
        """
        # HDBSCAN parameters
        min_cluster_size = max(3, int(n ** 0.45))
        min_samples = max(2, int(min_cluster_size * 0.8))  # More conservative (tight clusters)

        # UMAP parameters
        if n <= 15:
            n_neighbors = 3
            n_components = 2
        elif n <= 50:
            n_neighbors = 5
            n_components = 2
        else:  # 51–100
            n_neighbors = 10
            n_components = 3

        return min_cluster_size, min_samples, n_neighbors, n_components
