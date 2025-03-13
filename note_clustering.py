from collections import defaultdict
import string
from fastapi import FastAPI
import hdbscan
import umap.umap_ as umap
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN, KMeans
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import os
import openai
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

MAX_CHAR_LIMIT = 1000

load_dotenv()

# Download resources
nltk.download("stopwords")
nltk.download("wordnet")

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Request body that takes in a list of strings
class RequestBody(BaseModel):
    notes: list[str]

def preprocess_note(note):
    # Convert to lower case
    note = note.lower()  

    # Remove punctuation, extra spaces, and stopwords
    note = note.translate(str.maketrans("", "", string.punctuation))  
    note = " ".join(note.split())  # Remove extra spaces
    
    stop_words = set(stopwords.words("english"))
    words = [word for word in note.split() if word not in stop_words]
    
    # Convert words to their base form
    lemmatizer = WordNetLemmatizer()
    note = " ".join([lemmatizer.lemmatize(word) for word in words])  

    return note

def generate_category(notes):
    input_string = "".join(notes)
    prompt = f"Create a 1-3 word category name for the following text: {input_string}"

    # Generate response
    res = client.chat.completions.create(
        model="gpt-4o-mini",  
        messages=[{"role": "user", "content": prompt}],  
        max_tokens=10,
        temperature=0.4,
    )

    return res.choices[0].message.content.strip()

def kmeans_clustering(embeddings):
    # Scale embeddings (improves clustering performance)
    scaled_embeddings = StandardScaler().fit_transform(embeddings)

    # Reduce dimensions using UMAP (5D for better clustering)
    umap_reducer = umap.UMAP(n_components=5, metric="cosine", random_state=42)
    reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

    # Compute silhouette scores for different k values
    silhouette_scores = []
    K_range = range(2, 10)  # Testing k from 2 to 9

    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")
        labels = kmeans.fit_predict(reduced_embeddings)
        score = silhouette_score(reduced_embeddings, labels)
        silhouette_scores.append(score)
        print(f"Silhouette Score for k={k}: {score:.4f}")

    # Find the best k based on silhouette score
    optimal_k = K_range[np.argmax(silhouette_scores)]

    # Handle low silhouette scores (poor clustering)
    if max(silhouette_scores) < 0.2:
        print("\nWarning: Silhouette scores are low. Data may not have clear clusters.")

    # Run K-Means with optimal k
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init="auto")
    labels = kmeans.fit_predict(reduced_embeddings)

    # Calculate final silhouette score for chosen k
    final_silhouette = silhouette_score(reduced_embeddings, labels)
    print(f"\n✅ Selected k={optimal_k} with Silhouette Score: {final_silhouette:.4f}")

    return labels

def graph_clusters(embeddings, labels):
    # Reduce dimensions using UMAP
    reducer = umap.UMAP(n_components=2, metric="cosine")
    reduced_embeddings = reducer.fit_transform(embeddings)

    # Create figure
    plt.figure(figsize=(10, 7))

    # Plot clusters
    scatter = plt.scatter(
        reduced_embeddings[:, 0], reduced_embeddings[:, 1], 
        c=labels, cmap='viridis', alpha=0.7, edgecolors='k'
    )

    # Add color bar and labels
    plt.colorbar(scatter, label="Cluster Label")
    plt.title("K-Means Clustered Visualization")
    plt.xlabel("UMAP Component 1")
    plt.ylabel("UMAP Component 2")
    plt.grid(True)

    # Show the plot
    plt.show()
    
@app.get("/label")
async def cluster_notes(request_body: RequestBody):
    notes = request_body.notes

    if not notes:
        return {"error": "No notes provided"}
    
    # Preprocess the notes
    original_notes = notes
    notes = [preprocess_note(note) for note in notes]

    # Encode the notes
    embeddings = model.encode(notes)

    labels = kmeans_clustering(embeddings)

    # Create a dictionary to store a list of all notes in each cluster
    clustered_notes = defaultdict(list)
    for note, label in zip(notes, labels):
        clustered_notes[label].append(note)
    
    # Concatenate all notes in each cluster into a single string and store, MAX_CHAR_LIMIT limits input tokens
    concatenated_clusters = {cluster: " ".join(notes)[:MAX_CHAR_LIMIT] for cluster, notes in clustered_notes.items()}

    # Generate a category name for each cluster
    generated_categories = {cluster: "Unlabeled" if cluster == -1 else generate_category(text) for cluster, text in concatenated_clusters.items()}

    # Convert the keys to integers
    generated_categories = {int(k): v for k, v in generated_categories.items()}

    # Compile results in a dataframe
    df = pd.DataFrame({"Note": original_notes, "Cluster": labels})

    # Map the cluster numbers to their respective generated categories
    df["Category"] = df["Cluster"].map(generated_categories)

    df_sorted = df.sort_values(by="Cluster")

    # Convert DataFrame to JSON format
    json_result = df_sorted.to_dict(orient="records")

    return {"clusters": json_result}

