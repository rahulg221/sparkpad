from collections import defaultdict
import string
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.metrics import silhouette_score
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
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

MAX_CHAR_LIMIT = 500

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
    note = note.lower()  # Convert to lowercase
    note = note.translate(str.maketrans("", "", string.punctuation))  # Remove punctuation
    note = " ".join(note.split())  # Remove extra spaces
    
    stop_words = set(stopwords.words("english"))
    words = [word for word in note.split() if word not in stop_words]  # Remove stopwords
    
    lemmatizer = WordNetLemmatizer()
    note = " ".join([lemmatizer.lemmatize(word) for word in words])  # Lemmatization

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
    df = pd.DataFrame({"Note": original_notes, "Cluster": labels})

    # Map the cluster numbers to their respective generated categories
    df["Category"] = df["Cluster"].map(generated_categories)

    df_sorted = df.sort_values(by="Cluster")

    # Convert DataFrame to JSON format
    json_result = df_sorted.to_dict(orient="records")

    return {"optimal_k": optimal_k, "clusters": json_result}

