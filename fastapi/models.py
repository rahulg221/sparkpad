from pydantic import BaseModel

class Notes(BaseModel):
    notes_content: list[str]
    notes: list[dict]

class Note(BaseModel):
    id: str
    content: str
    embedding: list[float]
    category: str
    cluster: int

class Event(BaseModel):
    note_content: str

class Task(BaseModel):
    note_content: str