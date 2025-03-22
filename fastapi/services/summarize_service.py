from services.utils import preprocess_text
from imports import *

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text(notes):
    """
    Summarizes the given text using the OpenAI API.
    Args:
        text (str): The text to summarize.
    Returns:
        str: The summarized text.
    """
    text = "\n".join(notes)
    text = preprocess_text(text)

    # Get the current date in EST
    est = pytz.timezone('US/Eastern')
    today = datetime.now(est)
    date_str = today.strftime("%Y-%m-%d")

    prompt = f"""
    Produce a daily report of the following notes: {text}
    Avoid making strong assumptions or connections between the notes.
    The report should be in the following format:
    - Date: {date_str}
    - Random thoughts: [Random thoughts and reflections]
    - Brainstorm Ideas: [Important ideas and insights]
    - General Tasks: [Upcoming tasks and projects]
    - ImportantReminders: [Reminders for upcoming events]
    - Notes: [Any additional notes]
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    summary = response.choices[0].message.content
    return summary
