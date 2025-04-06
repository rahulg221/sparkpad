from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from services.utils import get_user_key
from services.auth_service import AuthService
from services.google_service import GoogleService
from services.clustering_service import ClusteringService
from services.openai_service import OpenAIService
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
limiter = Limiter(key_func=get_user_key)

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow requests from http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bulletspace.vercel.app", "http://localhost:3000", "https://clusterms.fly.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SlowAPIMiddleware)

@app.middleware("http")
async def attach_user_to_request(request: Request, call_next):
    try:
        user = AuthService.get_current_user(request)
        request.state.user = user
        print("Authenticated:", user["sub"])
    except Exception as e:
        request.state.user = None
        print(f"Falling back to IP: {request.client.host} — Error: {e}")

    return await call_next(request)

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
def main(user = Depends(AuthService.get_current_user)):
    return {"/label": "Clustering and labeling text.", "/event": "Creating a Google Calendar event.", "/summarize": "Producing a daily report."}

@app.options("/{full_path:path}")
async def preflight_handler(full_path: str):
    return Response(status_code=200)

@app.post("/event")
@limiter.limit("100/day")
async def create_new_event(request: Request, request_body: Event, user=Depends(AuthService.get_current_user)):
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
@limiter.limit("100/day")
async def create_new_task(request: Request, request_body: Task, user=Depends(AuthService.get_current_user)):
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
@limiter.limit("10/day")
async def cluster_notes(request: Request, request_body: Notes, user=Depends(AuthService.get_current_user)):
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
@limiter.limit("15/day")
async def create_summary(request: Request, request_body: Notes, user=Depends(AuthService.get_current_user)):
    try:
        # Summarize the notes
        openai_service = OpenAIService()
        summary = openai_service.summarize_notes(request_body.notes_content)

        return {"summary": summary}
    except Exception as e:
        print("Error summarizing notes:", e)
        raise HTTPException(status_code=500, detail="Failed to summarize notes")
    
@app.post("/embed")
@limiter.limit("100/day")
async def embed_note(request: Request, request_body: Note, user=Depends(AuthService.get_current_user)):
    try:
        openai_service = OpenAIService()
        embedding = openai_service.generate_embeddings(request_body.note_content)

        return {"embedding": embedding}
    except Exception as e:
        print("Error embedding note:", e)
        raise HTTPException(status_code=500, detail="Failed to embed note")
    
@app.post("/semantic_search")
@limiter.limit("50/day")
async def semantic_search(request: Request, request_body: Note, user = Depends(AuthService.get_current_user)):
    auth_id = user["sub"]

    # Get embedding for the query
    openai_service = OpenAIService()
    print("request_body", request_body)
    query_embedding = openai_service.generate_embeddings(request_body.note_content)

    # Query the users table to get the internal user ID
    response = supabase.table("users").select("id").eq("auth_id", auth_id).single().execute()

    if response.data is None:
        raise Exception("User not found in database.")
    
    # Call Supabase RPC function 
    results = supabase.rpc("match_notes", {
        "query_embedding": query_embedding,
        "match_threshold": 0.2,
        "match_count": 10,
        "input_user_id": response.data["id"]
    }).execute()

    print("results", results)
    print("results", results.data)
    return results.data

@app.get("/gettasks")
@limiter.limit("10/minute")
async def get_tasks(request: Request, user=Depends(AuthService.get_current_user)):
    auth_id = user["sub"]

    try:
        google_service = GoogleService(auth_id)
        tasks = google_service.get_tasks()        

        return {"tasks": tasks}
    except Exception as e:
        print("Error getting tasks:", e)
        raise HTTPException(status_code=500, detail="Failed to get tasks")
    
@app.get("/getevents")
@limiter.limit("10/minute")
async def get_events(request: Request, user=Depends(AuthService.get_current_user)):
    auth_id = user["sub"]

    try:
        google_service = GoogleService(auth_id)
        events = google_service.get_calendar_events() 

        return {"events": events}
    except Exception as e:
        print("Error getting calendar events:", e)
        raise HTTPException(status_code=500, detail="Failed to get calendar events")

@app.get("/auth/google/url")
@limiter.limit("5/day")
async def get_google_auth_url(request: Request, user=Depends(AuthService.get_current_user)):
    try:
        # Get the Google auth URL
        auth_service = AuthService()
        url = auth_service.get_google_auth_url()

        return {"url": url}
    except Exception as e:
        print("Error generating Google OAuth URL:", e)
        raise HTTPException(status_code=500, detail="Failed to get Google auth URL")
    
@app.get("/auth/google/callback")
@limiter.limit("5/day")
async def google_callback(request: Request, code: str, user=Depends(AuthService.get_current_user)):
    auth_id = user["sub"]   

    try:
        google_service = GoogleService(auth_id)
        google_service.connect_calendar(code)

        return {"success": "Google Calendar connected successfully"}
    except Exception as e:
        print("Error connecting to Google Calendar:", e)
        raise HTTPException(status_code=500, detail="Failed to connect to Google Calendar")
