from imports import *

# Download resources
nltk.download("stopwords")
nltk.download("wordnet")

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

def kmeans_clustering(embeddings):
    # Scale embeddings (improves clustering performance)
    scaled_embeddings = StandardScaler().fit_transform(embeddings)

    # Reduce dimensions using UMAP (5D for better clustering)
    umap_reducer = umap.UMAP(n_components=5, metric="cosine")
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