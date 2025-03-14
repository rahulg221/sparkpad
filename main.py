from services.clustering_service import kmeans_clustering, preprocess_note
from imports import *
from services.llm_service import generate_category

MAX_CHAR_LIMIT = 1000

app = FastAPI()

# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Cluster request body that takes in a list of strings
class Notes(BaseModel):
    notes: list[str]

class Event(BaseModel):
    event: str
    
@app.get("/")
def main():
    return {"message": "Microservice for clustering and labeling text."}

@app.post("/event")
async def create_google_event(request_body: Event):
    text = request_body.event
    return create_google_event(text)

@app.get("/label")
async def cluster_notes(request_body: Notes):
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

