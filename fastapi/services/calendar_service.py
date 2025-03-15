from imports import *
from services.utils import extract_datetime

load_dotenv()

# Load the calendar ID from the environment variables
calender_id = os.getenv("CALENDAR_ID")

# Load the service account file
SERVICE_ACCOUNT_FILE = "assets/calendar_data.json" 
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
