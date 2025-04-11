from dotenv import load_dotenv
import openai
from services.utils import preprocess_text
import os
load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class OpenAIService:
    """
    Service for generating summaries of notes and semantic embeddings.
    """

    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate_embeddings(self, note_content: str) -> list[float]:
        """
        Generates a semantic embedding for a single note.
        Returns:
            A list of floats representing the embedding vector.
        Raises:
            Exception if the OpenAI API fails.
        """

        if not note_content or not note_content.strip():
            raise ValueError("Note text is empty or invalid.")

        text = preprocess_text(note_content)

        try:
            response = self.client.embeddings.create(
                model="text-embedding-3-small",  
                input=text,
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error generating embedding: {e}")
            raise e

    def summarize_notes(self, notes_content: list[str]):
        """
        Summarizes the given text using the OpenAI API.
        Args:
            notes_content (str): The notes to summarize.
        Returns:
            str: The summarized text.
        """

        if len(notes_content) == 0:
            return "No notes added today."
        
        text = "\n".join(notes_content)
        text = preprocess_text(text)

        prompt = f"""
            You are a smart assistant that analyzes unstructured notes and extracts the most important insights.

            Your task is to:

            Identify and list key insights from the notes, in order of importance (most important first)

            Use clear, simple, and concise language

            Merge or condense similar points

            Output guidelines:

            Do not include an introduction, summary, announcements, or headings

            Do not use any special formatting (e.g. bullets, numbers, punctuation)

            Do not include any filler language — just the insights

            Use only alphabetical characters (no emojis or symbols)

            Example output (Do not use these exact words, just use this format):
                Many ideas about new categorization features.
                Heavily considering switching to chicken breast over thighs.
                Feeling frustrated this week with sports.

            Here's the content to extract insights from:
            ---  
            {text }
            ---
            """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
        )

        summary = response.choices[0].message.content
        return summary
