
from datetime import datetime, timedelta
import re
from dotenv import load_dotenv
from dateutil import parser
from fastapi import HTTPException
from google.oauth2 import service_account
from services.auth_service import AuthService
from services.utils import extract_datetime, remove_filler_phrases, remove_time_keywords, supabase_client
from googleapiclient.discovery import build
from google.oauth2 import credentials
import pytz
import json
import os
import dateparser

load_dotenv()

class GoogleService:
    """
    Service for managing Google Calendar events.
    """

    def __init__(self, auth_id: str):
        self.auth_id = auth_id
        self.access_token = self.get_access_token()
        self.refresh_token = self.get_refresh_token()
        self.client_id = self.get_client_id()
        self.client_secret = self.get_client_secret()
        self.token_uri = self.get_token_uri()
        self.calendar_id = "primary"
        self.calendar_service = self.get_calendar_service()
        self.tasks_service = self.get_tasks_service()

    def get_tasks(self):
        """
        Gets all tasks from the user's Google Tasks.
        """

        eastern = pytz.timezone("America/New_York")
        now = datetime.now(eastern)
        next_week = now + timedelta(days=7)

        # List task lists and pick the primary one (or use a specific task list ID)
        tasklists_result = self.tasks_service.tasklists().list().execute()
        tasklists = tasklists_result.get("items", [])
        
        if not tasklists:
            return []

        primary_tasklist_id = tasklists[0]["id"]

        # Fetch tasks from the task list
        tasks_result = self.tasks_service.tasks().list(
            tasklist=primary_tasklist_id,
            dueMax=next_week.isoformat(),
            showCompleted=False,
            showDeleted=False,
        ).execute()

        sorted_tasks = sorted(
            tasks_result.get("items", []),
            key=lambda task: task.get("due", "")
        )

        tasks_list = []

        for task in sorted_tasks:
            title = task.get("title", "No Title")
            tasks_list.append(title)

        return tasks_list

    def get_calendar_events(self):
        """
        Gets all events from the user's Google Calendar.
        """

        # Set timezone (adjust to your user's time zone if needed)
        eastern = pytz.timezone("America/New_York")
        now = datetime.now(eastern)
        limit = now + timedelta(days=3)

        # Fetch events from now to 7 days from now
        events_result = self.calendar_service.events().list(
            calendarId=self.calendar_id,
            timeMin=now.isoformat(),
            timeMax=limit.isoformat(),
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        events = events_result.get("items", [])
        events_list = []
        
        for event in events:
            name = event.get("summary", "No Title")
            start = event.get("start", {}).get("dateTime")

            events_list.append(f"{start}#{name}")

        return events_list

    def create_google_event(self, text):
        """
        Creates a Google Calendar event based on the provided text.
        """
        start_time = extract_datetime(text)

        text = text.lstrip().removeprefix("/e").strip()

        # Remove known time phrases and filler phrases
        summary = remove_time_keywords(text)
        summary = remove_filler_phrases(summary)

        if not start_time:
            return {"error": "Could not extract date and time"}

        eastern = pytz.timezone('America/New_York')
        start_datetime = datetime.fromisoformat(start_time)

        if start_datetime.tzinfo is None:
            start_datetime = eastern.localize(start_datetime)
        else:
            start_datetime = start_datetime.astimezone(eastern)

        end_datetime = start_datetime + timedelta(hours=1)

        event = {
            "summary": summary,
            "start": {"dateTime": start_datetime.isoformat(), "timeZone": "America/New_York"},
            "end": {"dateTime": end_datetime.isoformat(), "timeZone": "America/New_York"},
            "reminders": {
                "useDefault": False,
                "overrides": [{"method": "popup", "minutes": 30}],
            },
        }

        created_event = self.calendar_service.events().insert(calendarId=self.calendar_id, body=event).execute()
        return json.dumps(created_event)
    
    def create_google_task(self, text):
        """
        Creates a Google Task based on the provided text.
        """
        due_time = extract_datetime(text)

        text = text.lstrip().removeprefix("/t").strip()

        # Remove known time phrases and filler phrases
        title = remove_time_keywords(text)
        title = remove_filler_phrases(title)

        if not due_time:
            due_time = datetime.now().isoformat()

        eastern = pytz.timezone('America/New_York')
        due_datetime = datetime.fromisoformat(due_time)

        if due_datetime.tzinfo is None:
            due_datetime = eastern.localize(due_datetime)
        else:
            due_datetime = due_datetime.astimezone(eastern)

        # Google Tasks expects UTC time without timezone offset
        due_datetime_utc = due_datetime.astimezone(pytz.utc)
        due_formatted = due_datetime_utc.strftime('%Y-%m-%dT%H:%M:%S.000Z')

        task = {
            "title": title,
            "due": due_formatted,
        }

        created_task = self.tasks_service.tasks().insert(tasklist='@default', body=task).execute()
        return json.dumps(created_task)
    
    def get_calendar_service(self):
        creds = credentials.Credentials(
            token=self.access_token,
            refresh_token=self.refresh_token,
            client_id=self.client_id,
            client_secret=self.client_secret,
            token_uri=self.token_uri
        )
        
        return build("calendar", "v3", credentials=creds)
    
    def get_tasks_service(self):
        creds = credentials.Credentials(
            token=self.access_token,
            refresh_token=self.refresh_token,
            client_id=self.client_id,
            client_secret=self.client_secret,
            token_uri=self.token_uri
        )
        
        return build("tasks", "v1", credentials=creds)

    def get_access_token(self):
        try:
            # Fetch user ID from your app's users table
            user_res = supabase_client.table("users").select("id").eq("auth_id", self.auth_id).single().execute()
            if not user_res.data:
                raise HTTPException(status_code=404, detail="User not found")

            user_id = user_res.data["id"]

            # Fetch Google access token
            token_res = supabase_client.table("google_tokens").select("access_token").eq("user_id", user_id).single().execute()
            if not token_res.data:
                raise HTTPException(status_code=403, detail="Google Calendar not connected")

            access_token = token_res.data["access_token"]

            return access_token
        except Exception as e:
            print(e)
            return None
        
    def get_refresh_token(self):
        try:
            # Fetch user ID from your app's users table
            user_res = supabase_client.table("users").select("id").eq("auth_id", self.auth_id).single().execute()
            if not user_res.data:
                raise HTTPException(status_code=404, detail="User not found")   
            
            user_id = user_res.data["id"]

            token_res = supabase_client.table("google_tokens").select("refresh_token").eq("user_id", user_id).single().execute()
            if not token_res.data:
                raise HTTPException(status_code=403, detail="Google Calendar not connected")

            return token_res.data["refresh_token"]
        except Exception as e:
            print(e)
            return None
        
    def get_client_id(self):
        try:
            # Fetch user ID from your app's users table
            user_res = supabase_client.table("users").select("id").eq("auth_id", self.auth_id).single().execute()
            if not user_res.data:
                raise HTTPException(status_code=404, detail="User not found")       
            
            user_id = user_res.data["id"]

            token_res = supabase_client.table("google_tokens").select("client_id").eq("user_id", user_id).single().execute()
            if not token_res.data:
                raise HTTPException(status_code=403, detail="Google Calendar not connected")

            return token_res.data["client_id"]
        except Exception as e:
            print(e)
            return None
        
    def get_client_secret(self):
        try:
            # Fetch user ID from your app's users table
            user_res = supabase_client.table("users").select("id").eq("auth_id", self.auth_id).single().execute()
            if not user_res.data:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_id = user_res.data["id"]                   

            token_res = supabase_client.table("google_tokens").select("client_secret").eq("user_id", user_id).single().execute()
            if not token_res.data:
                raise HTTPException(status_code=403, detail="Google Calendar not connected")

            return token_res.data["client_secret"]
        except Exception as e:
            print(e)
            return None
        
    def get_token_uri(self):
        try:
            # Fetch user ID from your app's users table
            user_res = supabase_client.table("users").select("id").eq("auth_id", self.auth_id).single().execute()
            if not user_res.data:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_id = user_res.data["id"]
            
            token_res = supabase_client.table("google_tokens").select("token_uri").eq("user_id", user_id).single().execute()
            if not token_res.data:
                raise HTTPException(status_code=403, detail="Google Calendar not connected")

            return token_res.data["token_uri"]
        except Exception as e:
            print(e)
            return None

    def connect_calendar(self, code: str):
        """
        Connects to the user's Google Calendar.
        """
        auth_service = AuthService()

        try:
            # Get your internal user ID based on auth_id
            user_res = supabase_client.table("users").select("id").eq("auth_id", self.auth_id).single().execute()
            if not user_res.data:
                raise HTTPException(status_code=404, detail="User not found")

            user_id = user_res.data["id"]

            # Exchange authorization code for Google tokens
            tokens = auth_service.exchange_code_for_tokens(code)
            if not tokens.get("access_token"):
                raise HTTPException(status_code=400, detail="Invalid token exchange response")
            
            existing = supabase_client.table("google_tokens").select("user_id").eq("user_id", user_id).execute()

            # Save or update tokens in Supabase
            if existing.data:
                # Update instead of insert
                supabase_client.table("google_tokens").update({
                    "access_token": tokens["access_token"],
                    "refresh_token": tokens.get("refresh_token"),
                    "expiry": tokens.get("expiry"),
                    "client_id": tokens.get("client_id"),
                    "client_secret": tokens.get("client_secret"),
                    "token_uri": tokens.get("token_uri")
                }).eq("user_id", user_id).execute()
            else:
                # Insert new record
                supabase_client.table("google_tokens").insert({
                    "user_id": user_id,
                    "access_token": tokens["access_token"],
                    "refresh_token": tokens.get("refresh_token"),
                    "expiry": tokens.get("expiry"),
                    "client_id": tokens.get("client_id"),
                    "client_secret": tokens.get("client_secret"),
                    "token_uri": tokens.get("token_uri")
                }).execute()

            supabase_client.table("users").update({
                "google_connected": True
            }).eq("id", user_id).execute()

            return {"message": "Google Calendar connected successfully"}
        except Exception as e:
            print("Google OAuth callback error:", e)
            raise HTTPException(status_code=500, detail="Failed to link Google Calendar")
