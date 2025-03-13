from collections import defaultdict
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.metrics import silhouette_score
import uvicorn
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import os
import openai

load_dotenv()

MAX_CHAR_LIMIT = 500

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Request body that takes in a list of strings
class RequestBody(BaseModel):
    notes: list[str]

def generate_category(notes):
    input_string = "".join(notes)
    prompt = f"Create a 1-2 word category name for the following text: {input_string}"

    # Generate response
    res = client.chat.completions.create(
        model="gpt-4o-mini",  
        messages=[{"role": "user", "content": prompt}],  
        max_tokens=10,
        temperature=0.4,
    )

    return res.choices[0].message.content.strip()
    
@app.get("/label")
async def cluster_notes(request_body: RequestBody):
    notes = request_body.notes

    if not notes:
        return {"error": "No notes provided"}
    
    # Encode the notes
    embeddings = model.encode(notes)

    # Compute silhouette scores
    silhouette_scores = []
    K_range = range(2, 10) 

    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")
        labels = kmeans.fit_predict(embeddings)
        score = silhouette_score(embeddings, labels)
        silhouette_scores.append(score)

    # Find the optimal number of clusters
    optimal_k = K_range[np.argmax(silhouette_scores)]

    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init="auto")
    labels = kmeans.fit_predict(embeddings)

    # Create a dictionary to store a list of all notes in each cluster
    clustered_notes = defaultdict(list)
    for note, label in zip(notes, labels):
        clustered_notes[label].append(note)

    # Concatenate all notes in each cluster into a single string and store, MAX_CHAR_LIMIT limits input tokens
    concatenated_clusters = {cluster: " ".join(notes)[:MAX_CHAR_LIMIT] for cluster, notes in clustered_notes.items()}

    # Generate a category name for each cluster
    generated_categories = {cluster: generate_category(text) for cluster, text in concatenated_clusters.items()}

    # Convert the keys to integers
    generated_categories = {int(k): v for k, v in generated_categories.items()}

    # Compile results in a dataframe
    df = pd.DataFrame({"Note": notes, "Cluster": labels})

    # Map the cluster numbers to their respective generated categories
    df["Category"] = df["Cluster"].map(generated_categories)

    df_sorted = df.sort_values(by="Cluster")

    # Convert DataFrame to JSON format
    json_result = df_sorted.to_dict(orient="records")

    return {"optimal_k": optimal_k, "clusters": json_result}

