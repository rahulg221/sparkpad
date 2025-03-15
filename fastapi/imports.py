from collections import defaultdict
import string
from fastapi import FastAPI
import uvicorn
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
import json
import dateparser
import re
from datetime import datetime, timedelta
import parsedatetime as pdt
import calendar
from googleapiclient.discovery import build
from google.oauth2 import service_account
import pytz