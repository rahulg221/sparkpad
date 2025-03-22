import math
from services.utils import preprocess_text
from imports import *

load_dotenv()

MAX_CHAR_LIMIT = 2500

# Initialize the OpenAI API client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Download resources
nltk.download("stopwords")
nltk.download("wordnet")

def group_and_label_notes(notes):
    if not notes:
        return {"error": "No notes provided"}
    
    # Preprocess the notes
    original_notes = notes
    notes = [preprocess_text(note) for note in notes]

    # Encode the notes
    embeddings = model.encode(notes)

    labels = kmeans_clustering(embeddings)

    if len(labels) == 0:
        return {"error": "No clusters found"}

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

    # Convert DataFrame to JSON format
    json_result = df.to_dict(orient="records")

    return {"clusters": json_result}

def kmeans_clustering(embeddings):
    """
    Perform K-Means clustering on the given embeddings.
    This function scales the embeddings, reduces their dimensions using UMAP, 
    and then applies K-Means clustering to find the optimal number of clusters 
    based on silhouette scores.

    Parameters:
        embeddings (array-like): The input data to be clustered.
    Returns:
        labels (array-like): The cluster labels for each data point.
    """
    
    # Scale embeddings (improves clustering performance)
    scaled_embeddings = StandardScaler().fit_transform(embeddings)

    # Skip UMAP if dataset is too small (e.g., less than 5 data points)
    if len(embeddings) < 5:
        print("Dataset is too small, skipping UMAP dimensionality reduction.")
        return []
    
    umap_reducer = umap.UMAP(n_components=5, metric="cosine")
    reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

    # Compute silhouette scores and weighted scores
    silhouette_scores = []
    weighted_scores = []
    K_range = range(2, 8)

    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")
        labels = kmeans.fit_predict(reduced_embeddings)
        score = silhouette_score(reduced_embeddings, labels)
        weighted = score * math.log(k)

        silhouette_scores.append(score)
        weighted_scores.append(weighted)

        print(f"k={k}, Silhouette={score:.4f}, Weighted={weighted:.4f}")

    # Pick the best k based on the weighted score
    optimal_k = K_range[np.argmax(weighted_scores)]

    # Handle low silhouette scores (poor clustering)
    if max(silhouette_scores) < 0.2:
        print("\nWarning: Silhouette scores are low. Data may not have clear clusters.")

    # Run K-Means with optimal k
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init="auto")
    labels = kmeans.fit_predict(reduced_embeddings)

    # Calculate final silhouette score for chosen k
    final_silhouette = silhouette_score(reduced_embeddings, labels)
    print(f"\nSelected k={optimal_k} with Silhouette Score: {final_silhouette:.4f}")

    return labels

def generate_category(notes):
    """
    Generates a category name based on the provided notes.
    This function takes a list of notes, concatenates them into a single string,
    and uses a language model to generate a 1-3 word category name for the text.

    Args:
        notes (list of str): A list of strings representing the notes.
        
    Returns:
        str: A generated category name based on the input notes.
    """

    input_string = "".join(notes)
    prompt = f"Create a 1-3 word category name for the following text: {input_string}"

    # Generate response
    res = client.chat.completions.create(
        model="gpt-4o-mini",  
        messages=[{"role": "user", "content": prompt}],  
        max_tokens=10,
        temperature=0.2,
    )

    return res.choices[0].message.content.strip()

def graph_clusters(embeddings, labels):
    """
    Visualizes clusters using UMAP for dimensionality reduction and a scatter plot.

    Parameters:
        embeddings (array-like): High-dimensional data points to be clustered.
        labels (array-like): Cluster labels for each data point.
    Returns:
        None
    """

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