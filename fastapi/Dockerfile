# Builder Stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies needed to build packages
RUN apt-get update && apt-get install -y build-essential gcc libffi-dev libssl-dev \
  && rm -rf /var/lib/apt/lists/*

# Install Python dependencies to a separate location
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Download required NLTK data
ENV PYTHONPATH=/install/lib/python3.11/site-packages

# Final runtime image
FROM python:3.11-slim

WORKDIR /app

# Copy installed Python packages only (no build tools)
COPY --from=builder /install /usr/local

# Copy your actual app code
COPY . .

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
