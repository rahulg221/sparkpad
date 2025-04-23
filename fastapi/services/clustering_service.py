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
    
    def generate_type_centroids(self, examples: dict[str, list[str]]) -> dict[str, np.ndarray]:
        """
        Generates the centroids for the note types.
        """

        centroids = {}

        for note_type, examples in examples.items():
            # Get the embeddings for the examples
            embeddings = [OpenAIService().generate_embeddings(example) for example in examples]

            # Calculate the centroid of the embeddings
            centroid = np.mean(embeddings, axis=0)
            centroids[note_type] = centroid

        return centroids

    def generate_note_type(self, note_content: str, centroids: dict[str, np.ndarray]) -> str:
        """
        Generates a type for a note.
        """

        # Get the embeddings for the note
        embedding = OpenAIService().generate_embeddings(note_content)

        labels = list(centroids.keys())
        centroid_matrix = np.array([centroids[label] for label in labels])

        # Calculate the cosine similarity between the embedding and the centroids
        similarities = cosine_similarity([embedding], centroid_matrix)[0]

        # Get the label of the centroid with the highest similarity
        note_type = labels[np.argmax(similarities)]

        return note_type
        
    def group_and_label_notes(self):
        """
        Groups notes into clusters and labels each cluster with a category.
        """

         # Query the users table to get the internal user ID
        response = supabase_client.table("users").select("id").eq("auth_id", self.user["sub"]).single().execute()

        if response.data is None:
            raise Exception("User not found in database.")

        user = response.data

        response = supabase_client.table("notes").select("*").eq("user_id", user["id"]).execute()

        if response.data is None:
            raise Exception("Notes not found in database.")

        notes_data = response.data

        notes = [Note(**parse_embedding(n)) for n in notes_data if n.get("embedding")]

        # Get embeddings for the notes
        embeddings = [note.embedding for note in notes]

        notes_content = [note.content for note in notes]

        preprocessed_notes_content = [preprocess_text(note.content) for note in notes]

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

        self.update_database(json_result, notes)

        return {"clusters": json_result}

    def hdbscan_clustering(self, embeddings):
        """
        Perform HDBSCAN clustering on the given embeddings.
        Returns the final labels after filtering by confidence.
        """
        # Step 1: Scale embeddings
        scaled_embeddings = StandardScaler().fit_transform(embeddings)

        # Step 2: Dimensionality reduction using UMAP (with fixed seed for reproducibility)
        umap_reducer = umap.UMAP(
            n_components=15,  # explicit for control
            min_dist=0.0,
            metric="cosine",
            random_state=42
        )
        reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

        # Step 3: Get dynamic HDBSCAN hyperparameters
        min_cluster_size, min_samples = self.adaptive_hdbscan_params(len(embeddings))

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

    def adaptive_hdbscan_params(self, n):
        """
        Dynamically select min_cluster_size and min_samples based on number of embeddings.
        Stricter at higher volumes to ensure meaningful clusters.
        """
        if n <= 20:
            return 3, 1  # Very permissive for low volume
        elif n <= 50:
            return 5, 3
        elif n <= 100:
            return 8, 5
        elif n <= 300:
            return 12, 8
        elif n <= 600:
            return 16, 10
        else:
            return 20, 12  # Very strict — expect high-quality, large clusters only
