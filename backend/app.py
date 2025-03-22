from fastapi import FastAPI, Depends
from .auth import get_current_user

app = FastAPI()

# Protected endpoint example
@app.get("/api/notes")
async def get_notes(user = Depends(get_current_user)):
    # user is now verified
    return {"message": "Access granted", "user_id": user.id}

# Another protected endpoint
@app.post("/api/notes")
async def create_note(note_data: dict, user = Depends(get_current_user)):
    # Only authenticated users can create notes
    return {"message": "Note created", "user_id": user.id}

# Public endpoint (no authentication required)
@app.get("/health")
async def health_check():
    return {"status": "healthy"} 