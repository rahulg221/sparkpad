from services.auth import get_current_user
from services.clustering_service import group_and_label_notes
from services.calendar_service import create_google_event
from services.summarize_service import summarize_text
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from imports import *

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
def main(user = Depends(get_current_user)):
    return {"/label": "Clustering and labeling text.", "/event": "Creating a Google Calendar event.", "/summarize": "Producing a daily report."}

@app.post("/event")
async def create_new_event(request_body: Event, user = Depends(get_current_user)):
    note = request_body.note
    return create_google_event(note)

@app.post("/label")
async def cluster_notes(request_body: Notes, user = Depends(get_current_user)):
    notes = request_body.notes
    return group_and_label_notes(notes)

@app.post("/summarize")
async def create_weekly_report(request_body: Notes, user = Depends(get_current_user)):
    notes = request_body.notes
    return summarize_text(notes)
