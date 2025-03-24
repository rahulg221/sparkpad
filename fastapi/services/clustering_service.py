import math
from services.utils import preprocess_text
from imports import *

load_dotenv()

MAX_CHAR_LIMIT = 5000

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

    # Cluster the notes using K-Means           
    labels = hdbscan_clustering(embeddings)

    # Create a dictionary to store a list of all notes in each cluster
    clustered_notes = defaultdict(list)
    for note, label in zip(notes, labels):
        clustered_notes[label].append(note)
    
    # Concatenate all notes in each cluster into a single string and store, MAX_CHAR_LIMIT limits input tokens
    concatenated_clusters = {cluster: " ".join(notes)[:MAX_CHAR_LIMIT] for cluster, notes in clustered_notes.items()}

    # Generate a category name for each cluster
    generated_categories = {cluster: "Unsorted" if cluster == -1 else generate_category(text) for cluster, text in concatenated_clusters.items()}

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
    
    # Reduce dimensionality using UMAP
    umap_reducer = umap.UMAP(n_components=5, metric="cosine")
    reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

    # Compute silhouette scores and weighted scores
    silhouette_scores = []
    weighted_scores = []
    K_range = range(2, 12)

    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")
        labels = kmeans.fit_predict(reduced_embeddings)
        score = silhouette_score(reduced_embeddings, labels)

        weighted = score * math.log(k) # Penalize more for smaller k

        silhouette_scores.append(score)
        weighted_scores.append(weighted)

        print(f"k={k}, Silhouette={score:.4f}, Weighted={weighted:.4f}")

    # Pick the best k based on the weighted score
    optimal_k = K_range[np.argmax(silhouette_scores)]

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

def hdbscan_clustering(embeddings):
    """
    Perform HDBSCAN clustering on the given embeddings.
    This function scales the embeddings, reduces their dimensions using UMAP,
    and then applies HDBSCAN to detect clusters and outliers.

    Parameters:
        embeddings (array-like): The input data to be clustered.

    Returns:
        labels (np.ndarray): Cluster labels for each point (-1 = outlier).
    """

    # Scale the embeddings
    scaled_embeddings = StandardScaler().fit_transform(embeddings)

    # Reduce dimensionality with UMAP
    umap_reducer = umap.UMAP(n_components=5, metric="cosine", random_state=42)
    reduced_embeddings = umap_reducer.fit_transform(scaled_embeddings)

    # Dynamically select min_cluster_size and min_samples
    min_cluster_size, min_samples = adaptive_hdbscan_params(embeddings.shape[0])

    # Run HDBSCAN
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=min_cluster_size,
        min_samples=min_samples or min_cluster_size,
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

def adaptive_hdbscan_params(n):
    """
    Dynamically select min_cluster_size and min_samples based on number of embeddings.
    """
    if n <= 20:
        return 2, 1  # allow even tiny clusters
    elif n <= 50:
        return 3, 2  # still flexible
    elif n <= 100:
        return 5, 3  # small-medium clusters
    elif n <= 300:
        return 8, 5  # balanced but still somewhat specific
    else:
        return 10, 7  # for large datasets, allow specific but stable clusters

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
