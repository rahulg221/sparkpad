
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
    notes: list[str]

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
        # Fetch user ID from your app's users table
        user_res = supabase.table("users").select("id").eq("auth_id", auth_id).single().execute()
        if not user_res.data:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = user_res.data["id"]

        # Fetch Google access token
        token_res = supabase.table("google_tokens").select("access_token").eq("user_id", user_id).single().execute()
        if not token_res.data:
            raise HTTPException(status_code=403, detail="Google Calendar not connected")

        access_token = token_res.data["access_token"]

        # Create the calendar event
        calendar_service = CalendarService(access_token)
        event = calendar_service.create_google_event(note_text)

        return {"event": event}

    except HTTPException:
        raise  # re-raise FastAPI validation errors

    except Exception as e:
        print("Failed to create calendar event:", e)
        raise HTTPException(status_code=500, detail="Unexpected error while creating event")

@app.post("/label")
async def cluster_notes(request_body: Notes, user=Depends(AuthService().get_current_user)):
    try:
        clusters = ClusteringService().group_and_label_notes(request_body.notes)
        return {"clusters": clusters}
    except Exception as e:
        print("Error clustering notes:", e)
        raise HTTPException(status_code=500, detail="Failed to cluster notes")

@app.post("/summarize")
async def create_snapshot(request_body: Notes, user=Depends(AuthService().get_current_user)):
    try:
        summary = SummarizeService().summarize_notes(request_body.notes)
        return {"summary": summary}
    except Exception as e:
        print("Error summarizing notes:", e)
        raise HTTPException(status_code=500, detail="Failed to summarize notes")

@app.get("/auth/google/url")
async def get_google_auth_url(user=Depends(AuthService().get_current_user)):
    try:
        url = AuthService().get_google_auth_url()
        return {"url": url}
    except Exception as e:
        print("Error generating Google OAuth URL:", e)
        raise HTTPException(status_code=500, detail="Failed to get Google auth URL")
    
@app.get("/auth/google/callback")
async def google_callback(code: str, user=Depends(AuthService().get_current_user)):
    auth_id = user["sub"]

    try:
        # Get your internal user ID based on auth_id
        user_res = supabase.table("users").select("id").eq("auth_id", auth_id).single().execute()
        if not user_res.data:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = user_res.data["id"]

        # Exchange authorization code for Google tokens
        tokens = AuthService().exchange_code_for_tokens(code)
        if not tokens.get("access_token"):
            raise HTTPException(status_code=400, detail="Invalid token exchange response")
        
        existing = supabase.table("google_tokens").select("user_id").eq("user_id", user_id).execute()
        
        # Save or update tokens in Supabase
        if existing.data:
            # update instead of insert
            supabase.table("google_tokens").update({
                "access_token": tokens["access_token"],
                "refresh_token": tokens.get("refresh_token"),
                "expiry": tokens.get("expiry"),
            }).eq("user_id", user_id).execute()
        else:
            # insert new record
            supabase.table("google_tokens").insert({
                "user_id": user_id,
                "access_token": tokens["access_token"],
                "refresh_token": tokens.get("refresh_token"),
                "expiry": tokens.get("expiry"),
            }).execute()

        return {"message": "Google Calendar connected successfully"}

    except HTTPException:
        raise

    except Exception as e:
        print("Google OAuth callback error:", e)
        raise HTTPException(status_code=500, detail="Failed to link Google Calendar")