from dotenv import load_dotenv
import openai
from services.utils import preprocess_text
import os
load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class SummarizeService:
    """
    Service for summarizing notes.
    """

    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def summarize_notes(self, notes):
        """
        Summarizes the given text using the OpenAI API.
        Args:
            notes (str): The notes to summarize.
        Returns:
            str: The summarized text.
        """

        if len(notes) == 0:
            return "No notes added today."
        
        text = "\n".join(notes)
        text = preprocess_text(text)

        prompt = f"""
            You are a helpful assistant that takes a series of notes and returns a concise set of bullet points summarizing 
            core ideas, important tasks and reminders, and the user's personal reflections.

            Summarize the following notes.

            Guidelines:
            1. 300 character limit. 
            2. Keep the tone concise but thoughtful. 
            3. Do not make assumptions about the user's intentions or actions unless the user has explicitly stated something.

            Here are the notes to summarize:

            ---  
            {text }
            ---
            """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
        )
    
        summary = response.choices[0].message.content
        return summary
