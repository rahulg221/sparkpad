from typing import List, Optional
from pydantic import BaseModel

class Notes(BaseModel):
    notes_content: list[str]
    notes: list[dict]

class Note(BaseModel):
    id: str
    content: str
    embedding: Optional[List[float]] = None
    category: str
    cluster: int

class SimpleNote(BaseModel):
    content: str

class Event(BaseModel):
    note_content: str

class Task(BaseModel):
    note_content: str