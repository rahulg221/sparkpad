
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.auth_service import AuthService
from services.google_service import GoogleService
from services.clustering_service import ClusteringService
from services.openai_service import OpenAIService
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI()

# Allow requests from http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://clusterms.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cluster request body that takes in a list of strings
class Notes(BaseModel):
    notes_content: list[str]
    notes: list[dict]

class Note(BaseModel):
    note_content: str

class Event(BaseModel):
    note_content: str

class Task(BaseModel):
    note_content: str
    
@app.get("/")
def main(user = Depends(AuthService().get_current_user)):
    return {"/label": "Clustering and labeling text.", "/event": "Creating a Google Calendar event.", "/summarize": "Producing a daily report."}

@app.post("/event")
async def create_new_event(request_body: Event, user=Depends(AuthService().get_current_user)):
    note_content = request_body.note_content
    auth_id = user["sub"]

    try:
        # Create the calendar event
        google_service = GoogleService(auth_id)
        event = google_service.create_google_event(note_content)

        return {"event": event}
    except Exception as e:
        print("Failed to create calendar event:", e)
        raise HTTPException(status_code=500, detail="Unexpected error while creating event")
    
@app.post("/task")
async def create_new_task(request_body: Task, user=Depends(AuthService().get_current_user)):
    note_content = request_body.note_content
    auth_id = user["sub"]

    try:
        # Create the calendar task  
        google_service = GoogleService(auth_id)
        task = google_service.create_google_task(note_content)

        return {"task": task}
    except Exception as e:  
        print("Failed to create calendar task:", e)
        raise HTTPException(status_code=500, detail="Unexpected error while creating task")

@app.post("/label")
async def cluster_notes(request_body: Notes, user=Depends(AuthService().get_current_user)):
    try:
        # Cluster the notes
        clustering_service = ClusteringService(request_body.notes_content, request_body.notes)
        clusterData = clustering_service.group_and_label_notes()
        clustering_service.update_database(clusterData["clusters"])

        return {"success": "Notes successfully clustered and labeled"}
    except Exception as e:
        print("Error clustering notes:", e)
        raise HTTPException(status_code=500, detail="Failed to cluster notes")

@app.post("/summarize")
async def create_summary(request_body: Notes, user=Depends(AuthService().get_current_user)):
    try:
        # Summarize the notes
        openai_service = OpenAIService()
        summary = openai_service.summarize_notes(request_body.notes_content)

        return {"summary": summary}
    except Exception as e:
        print("Error summarizing notes:", e)
        raise HTTPException(status_code=500, detail="Failed to summarize notes")
    
@app.post("/embed")
async def embed_note(request_body: Note, user=Depends(AuthService().get_current_user)):
    try:
        openai_service = OpenAIService()
        embedding = openai_service.generate_embeddings(request_body.note_content)

        return {"embedding": embedding}
    except Exception as e:
        print("Error embedding note:", e)
        raise HTTPException(status_code=500, detail="Failed to embed note")
    
@app.post("/semantic_search")
async def semantic_search(request_body: Note, user = Depends(AuthService().get_current_user)):
    # Get embedding for the query
    openai_service = OpenAIService()
    print("request_body", request_body)
    query_embedding = openai_service.generate_embeddings(request_body.note_content)

    # Call Supabase RPC function 
    results = supabase.rpc("match_notes", {
        "query_embedding": query_embedding,
        "match_threshold": 0.2,
        "match_count": 10
    }).execute()

    print("results", results)
    print("results", results.data)
    return results.data

@app.get("/gettasks")
async def get_tasks(user=Depends(AuthService().get_current_user)):
    auth_id = user["sub"]

    try:
        google_service = GoogleService(auth_id)
        tasks = google_service.get_tasks()        

        return {"tasks": tasks}
    except Exception as e:
        print("Error getting tasks:", e)
        raise HTTPException(status_code=500, detail="Failed to get tasks")
    
@app.get("/getevents")
async def get_events(user=Depends(AuthService().get_current_user)):
    auth_id = user["sub"]

    try:
        google_service = GoogleService(auth_id)
        events = google_service.get_calendar_events() 

        return {"events": events}
    except Exception as e:
        print("Error getting calendar events:", e)
        raise HTTPException(status_code=500, detail="Failed to get calendar events")

@app.get("/auth/google/url")
async def get_google_auth_url(user=Depends(AuthService().get_current_user)):
    try:
        # Get the Google auth URL
        auth_service = AuthService()
        url = auth_service.get_google_auth_url()

        return {"url": url}
    except Exception as e:
        print("Error generating Google OAuth URL:", e)
        raise HTTPException(status_code=500, detail="Failed to get Google auth URL")
    
@app.get("/auth/google/callback")
async def google_callback(code: str, user=Depends(AuthService().get_current_user)):
    auth_id = user["sub"]   

    try:
        google_service = GoogleService(auth_id)
        google_service.connect_calendar(code)

        return {"success": "Google Calendar connected successfully"}
    except Exception as e:
        print("Error connecting to Google Calendar:", e)
        raise HTTPException(status_code=500, detail="Failed to connect to Google Calendar")
