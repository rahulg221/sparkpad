# Sparkpad
Low-friction, intelligent note-taking system for students, entrepreneurs, and busy professionals.

Key features:
Auto-Organize: Sort and group notes automatically [Cosine similarity sorting -> Fall-back LLM classifier -> HDBscan clustering -> LLM labeling]
Calendar Integration: Create events and tasks from natural language [NLP Date-time extraction -> Google APIs]
Summarize: Summarize groups of notes and resurface past ideas [RAG-system] 
Search: Search for notes by meaning [Similarity search in Supabase] 

Built using React, FastAPI, and Supabase.
Hosted on Fly.io and Vercel.
Containerized using Docker.
