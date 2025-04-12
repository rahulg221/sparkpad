# Use a lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements file first to enable caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Download NLTK data separately so it’s cached unless it changes
RUN python -m nltk.downloader stopwords wordnet

# Now copy the rest of the application
COPY . .

# Optional: expose FastAPI port
EXPOSE 8080

# Launch app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
