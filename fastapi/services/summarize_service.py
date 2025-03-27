from dotenv import load_dotenv
import openai
from services.utils import preprocess_text
import os
load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class SummarizeService:
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
        text = "\n".join(notes)
        text = preprocess_text(text)

        prompt = f"""
            You are an intelligent note assistant.

            Summarize the following notes in a way that is clear, helpful, and personal. The user is reflecting on their week, capturing ideas, managing tasks, and writing brainstorms.

            From the notes, create a structured weekly digest with the following sections:

            1. Notable Ideas 
            Extract any unique thoughts, creative brainstorms, or concepts that stood out.

            2. Action Items
            List clear tasks the user mentioned or implied (use bullet points).

            3. Upcoming Goals
            Mention anything the user wants to do soon, next week, or in the future.

            4. Suggested Reflections
            Based on the content, suggest 1–2 thoughtful questions the user might want to reflect on next week.

            Here are the notes to summarize:

            ---  
            {text }
            ---

            Keep the tone concise but thoughtful. Format it cleanly using headings and bullet points where appropriate.
            """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
        )
    
        summary = response.choices[0].message.content
        return summary
