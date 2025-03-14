from services.clustering_service import group_and_label_notes
from services.calendar_service import create_google_event

from imports import *

app = FastAPI()

# Cluster request body that takes in a list of strings
class Notes(BaseModel):
    notes: list[str]

class Event(BaseModel):
    note: str
    
@app.get("/")
def main():
    return {"/label": "Clustering and labeling text.", "/event": "Creating a Google Calendar event."}

@app.post("/event")
async def create_new_event(request_body: Event):
    note = request_body.note
    return create_google_event(note)

@app.get("/label")
async def cluster_notes(request_body: Notes):
    notes = request_body.notes
    return group_and_label_notes(notes)