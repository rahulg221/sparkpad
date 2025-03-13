from collections import defaultdict
import string
from fastapi import FastAPI
import hdbscan
import uvicorn
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
