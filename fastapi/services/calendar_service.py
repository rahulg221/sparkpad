
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from services.utils import extract_datetime
from googleapiclient.discovery import build

import pytz
import json
import os

load_dotenv()

class CalendarService:
    """
    Service for managing Google Calendar events.
    """
    def __init__(self):
        self.service_account_file = "assets/calendar_data.json"
        self.scopes = ["https://www.googleapis.com/auth/calendar"]
        self.calendar_id = os.getenv("CALENDAR_ID")
        self.service = self.get_calendar_service()

    def get_calendar_service(self):
        creds = service_account.Credentials.from_service_account_file(
            self.service_account_file, scopes=self.scopes
        )
        return build("calendar", "v3", credentials=creds)

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
