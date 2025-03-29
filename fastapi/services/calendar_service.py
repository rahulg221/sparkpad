
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import HTTPException
from google.oauth2 import service_account
from services.auth_service import AuthService
from services.utils import extract_datetime, supabase_client
from googleapiclient.discovery import build
from google.oauth2 import credentials
import pytz
import json
import os

load_dotenv()

class CalendarService:
    """
    Service for managing Google Calendar events.
    """

    def __init__(self, auth_id: str):
        self.auth_id = auth_id
        self.access_token = self.get_access_token()
        self.calendar_id = "primary"
        self.service = self.get_calendar_service()

    def create_google_event(self, text):
        """
        Creates a Google Calendar event based on the provided text.
        """
        start_time = extract_datetime(text)

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
            "summary": text,
            "start": {"dateTime": start_datetime.isoformat(), "timeZone": "America/New_York"},
            "end": {"dateTime": end_datetime.isoformat(), "timeZone": "America/New_York"},
            "reminders": {
                "useDefault": False,
                "overrides": [{"method": "popup", "minutes": 30}],
            },
        }

        created_event = self.service.events().insert(calendarId=self.calendar_id, body=event).execute()
        return json.dumps(created_event)
    
    def get_calendar_service(self):
        creds = credentials.Credentials(self.access_token)
        return build("calendar", "v3", credentials=creds)
    
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
                }).eq("user_id", user_id).execute()
            else:
                # Insert new record
                supabase_client.table("google_tokens").insert({
                    "user_id": user_id,
                    "access_token": tokens["access_token"],
                    "refresh_token": tokens.get("refresh_token"),
                    "expiry": tokens.get("expiry"),
                }).execute()

            return {"message": "Google Calendar connected successfully"}
        except Exception as e:
            print("Google OAuth callback error:", e)
            raise HTTPException(status_code=500, detail="Failed to link Google Calendar")
