import json
import dateparser
import re
from datetime import datetime, timedelta
import parsedatetime as pdt
import calendar
from googleapiclient.discovery import build
from google.oauth2 import service_account
import pytz
import os
from dotenv import load_dotenv

load_dotenv()

# Load the calendar ID from the environment variables
calender_id = os.getenv("CALENDAR_ID")

# Load the service account file
SERVICE_ACCOUNT_FILE = "calendar_data.json" 
SCOPES = ["https://www.googleapis.com/auth/calendar"]

def create_google_event(text):
    """
    Creates a Google Calendar event based on the provided text.
    This function extracts the date and time from the given text, creates a Google Calendar event,
    and returns a dictionary containing a success message and a link to the created event.
    Args:
        text (str): The text containing the event details, including date and time.
    Returns:
        dict: A dictionary containing either an error message if the date and time could not be extracted,
              or a success message and a link to the created event.
    """

    start_time = extract_datetime(text)

    if not start_time:
        return {"error": "Could not extract date and time"}

    # Define Eastern timezone 
    eastern = pytz.timezone('America/New_York')  

    # Modify the start time parsing to use Eastern time
    start_datetime = datetime.fromisoformat(start_time)

    # If start_time doesn't have timezone info, localize it to Eastern
    if start_datetime.tzinfo is None:
        start_datetime = eastern.localize(start_datetime)
    # If it has timezone info but not Eastern, convert it to Eastern
    else:
        start_datetime = start_datetime.astimezone(eastern)

    # Calculate end time 
    end_datetime = start_datetime + timedelta(hours=1)

    service = get_calendar_service()

    event = {
        "summary": text,
        "start": {"dateTime": start_datetime.isoformat(), "timeZone": "America/New_York"},
        "end": {"dateTime": end_datetime.isoformat(), "timeZone": "America/New_York"},
        "reminders": {
        "useDefault": False,
        "overrides": [
            {"method": "popup", "minutes": 30}
            ]
        },
    }

    created_event = service.events().insert(calendarId=calender_id, body=event).execute()

    json_result = json.dumps(created_event)

    return json_result

def get_calendar_service():
    """Authenticate and return Google Calendar API service."""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return build("calendar", "v3", credentials=creds)

def extract_datetime(text, base_datetime=None):
    """
    Extract date and time information from natural language text using custom patterns.
    
    Args:
        text (str): Input text containing date/time information
        base_datetime (datetime, optional): Reference datetime (defaults to current time)
        
    Returns:
        datetime: The extracted datetime object, or None if no datetime found
    """

    if base_datetime is None:
        base_datetime = datetime.now()
    
    # Normalize text
    text = text.lower()
    
    result_date = base_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
    time_found = False
    date_found = False
    
    # Handle relative dates
    if "tomorrow" in text:
        result_date += timedelta(days=1)
        date_found = True
    elif "today" in text:
        date_found = True
    elif "yesterday" in text:
        result_date -= timedelta(days=1)
        date_found = True
    
    # Handle weekday references
    weekday_pattern = r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b'
    weekday_match = re.search(weekday_pattern, text)
    if weekday_match and not date_found:
        target_weekday = ["monday", "tuesday", "wednesday", "thursday", 
                          "friday", "saturday", "sunday"].index(weekday_match.group(1))
        current_weekday = result_date.weekday()
        days_ahead = (target_weekday - current_weekday) % 7
        
        # If days_ahead is 0, it means today - but if "next" is present, it means next week
        if days_ahead == 0 and "next" not in text:
            days_ahead = 7
        
        # If "next" is present, it means next week
        if "next" in text and text.find("next") < text.find(weekday_match.group(1)):
            days_ahead += 7
            
        result_date += timedelta(days=days_ahead)
        date_found = True
    
    # Handle month and day (e.g., "May 1st")
    month_day_pattern = r'\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b'
    month_day_match = re.search(month_day_pattern, text)
    if month_day_match:
        month_name = month_day_match.group(1)
        month_num = ["january", "february", "march", "april", "may", "june", 
                     "july", "august", "september", "october", "november", "december"].index(month_name) + 1
        day = int(month_day_match.group(2))
        
        # Validate day number for the month
        max_days = calendar.monthrange(result_date.year, month_num)[1]
        if 1 <= day <= max_days:
            # If the date has already passed this year, consider it for next year
            candidate_date = result_date.replace(month=month_num, day=day)
            if candidate_date < base_datetime:
                candidate_date = candidate_date.replace(year=candidate_date.year + 1)
            result_date = candidate_date
            date_found = True
    
    # Extract time
    time_patterns = [
        (r'(\d{1,2})(?::(\d{2}))?\s*(am|pm)', 
         lambda h, m, ampm: (int(h) % 12 + (12 if ampm.lower() == 'pm' else 0), int(m) if m else 0)),
        (r'(\d{1,2})(?::(\d{2}))?(?!\s*(?:am|pm))', 
         lambda h, m, _: (int(h), int(m) if m else 0)),
        (r'\b(noon)\b', lambda _, __, ___: (12, 0)),
        (r'\b(midnight)\b', lambda _, __, ___: (0, 0))
    ]
    
    for pattern, time_func in time_patterns:
        time_match = re.search(pattern, text)
        if time_match:
            if pattern.startswith(r'\b'):  # Special cases like noon/midnight
                hour, minute = time_func(None, None, None)
            else:
                hour, minute = time_func(time_match.group(1), time_match.group(2), 
                                        time_match.group(3) if len(time_match.groups()) > 2 else None)
            result_date = result_date.replace(hour=hour, minute=minute)
            time_found = True
            break
    
    # Convert to a timezone-aware datetime
    timezone = pytz.timezone("America/New_York")  
    result_date = timezone.localize(result_date)
    
    google_calendar_format = result_date.isoformat()

    if date_found or time_found:
        return google_calendar_format
    
    return None