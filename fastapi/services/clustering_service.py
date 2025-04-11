from typing import List
from models import Note
from services.utils import parse_embedding, preprocess_text, supabase_client
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_distances
from collections import defaultdict
from sklearn.metrics import silhouette_score
from dotenv import load_dotenv
import umap
import hdbscan
import numpy as np
import pandas as pd
import nltk
import openai
import os

load_dotenv()

MAX_CHAR_LIMIT = 5000

class ClusteringService:
    """
    Service for clustering and categorizing notes.
    """

    def __init__(self, user: dict):
        # OpenAI client for category generation
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
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
        generated_categories = {cluster: "Unsorted" if cluster == -1 else self.generate_category(text) 
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
        """
        # Scale the embeddings
        scaled_embeddings = StandardScaler().fit_transform(embeddings)

        # Reduce dimensionality with UMAP
        umap_reducer = umap.UMAP(n_components=5, metric="cosine", random_state=42)
        reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

        # Dynamically select min_cluster_size and min_samples
        min_cluster_size, min_samples = self.adaptive_hdbscan_params(len(embeddings))

        # Run HDBSCAN
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size,
            min_samples=min_samples,
            metric='euclidean',
            prediction_data=True
        )
        labels = clusterer.fit_predict(reduced_embeddings)

        # Evaluate clustering (excluding outliers)
        clustered_indices = labels != -1
        clustered_points = reduced_embeddings[clustered_indices]
        clustered_labels = labels[clustered_indices]

        # Only calculate silhouette if we have enough data
        if len(clustered_points) > 1:
            silhouette = silhouette_score(clustered_points, clustered_labels)
            print(f"HDBSCAN Silhouette Score (excluding outliers): {silhouette:.4f}")
        else:
            print("Warning: Too few clustered points to compute silhouette score.")

        # Identify outliers
        outlier_indices = np.where(labels == -1)[0]

        print(f"Clusters found: {len(set(labels)) - (1 if -1 in labels else 0)}")
        print(f"Outliers detected: {len(outlier_indices)}")

        return labels

    def adaptive_hdbscan_params(self, n):
        """
        Dynamically select min_cluster_size and min_samples based on number of embeddings.
        """
        factor = 0 # Must be >0

        if n <= 20:
            return 1+factor, 1
        elif n <= 50:
            return 2+factor, 1+factor
        elif n <= 100:
            return 4+factor, 2+factor
        elif n <= 300:
            return 7+factor, 4+factor  
        else:
            return 9+factor, 6+factor  

    def generate_category(self, notes: List[str]):
        """
        Generates a category name based on the provided notes.
        """
        input_string = "".join(notes)
        prompt = f"""Create a category name for the following text: {input_string}
          1. The category name should be a single word or phrase that captures the main idea of the notes.
          2. Avoid non-alphabetical characters other than spaces. 
        """

        # Generate response
        res = self.client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=[{"role": "user", "content": prompt}],  
            max_tokens=10,
            temperature=0.2,
        )

        return res.choices[0].message.content.strip()
