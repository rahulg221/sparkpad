
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.auth_service import AuthService
from services.calendar_service import CalendarService
from services.clustering_service import ClusteringService
from services.summarize_service import SummarizeService
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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cluster request body that takes in a list of strings
class Notes(BaseModel):
    notes_content: list[str]
    notes: list[dict]

class Event(BaseModel):
    note: str
    
@app.get("/")
def main(user = Depends(AuthService().get_current_user)):
    return {"/label": "Clustering and labeling text.", "/event": "Creating a Google Calendar event.", "/summarize": "Producing a daily report."}

@app.post("/event")
async def create_new_event(request_body: Event, user=Depends(AuthService().get_current_user)):
    note_text = request_body.note
    auth_id = user["sub"]

    try:
        # Create the calendar event
        calendar_service = CalendarService(auth_id)
        event = calendar_service.create_google_event(note_text)
        calendar_events = calendar_service.get_calendar_events()

        return {"event": event}
    except Exception as e:
        print("Failed to create calendar event:", e)
        raise HTTPException(status_code=500, detail="Unexpected error while creating event")
    
@app.post("/task")
async def create_new_task(request_body: Event, user=Depends(AuthService().get_current_user)):
    note_text = request_body.note
    auth_id = user["sub"]

    try:
        # Create the calendar task  
        calendar_service = CalendarService(auth_id)
        task = calendar_service.create_google_task(note_text)

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
async def create_snapshot(request_body: Notes, user=Depends(AuthService().get_current_user)):
    try:
        # Summarize the notes
        summarize_service = SummarizeService(request_body.notes_content, request_body.notes)
        summary = summarize_service.summarize_notes()

        return {"summary": summary}
    except Exception as e:
        print("Error summarizing notes:", e)
        raise HTTPException(status_code=500, detail="Failed to summarize notes")

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
        calendar_service = CalendarService(auth_id)
        calendar_service.connect_calendar(code)

        return {"success": "Google Calendar connected successfully"}
    except Exception as e:
        print("Error connecting to Google Calendar:", e)
        raise HTTPException(status_code=500, detail="Failed to connect to Google Calendar")
