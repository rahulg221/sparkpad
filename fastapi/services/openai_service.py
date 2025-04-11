from typing import List
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

    def generate_category(self, notes: List[str]):
        """
        Generates a category name based on the provided notes.
        """
        input_string = "".join(notes)
        prompt = f"""Create a category name for the following text: {input_string}
          1. The category name should be one to three words that capture the main idea of the notes.
          2. Avoid too generic category names, if the majority of the notes are about a specific topic, the category name should reflect that.
          3. Avoid non-alphabetical characters other than spaces. 
        """

        # Generate response
        res = self.client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=[{"role": "user", "content": prompt}],  
            max_tokens=10,
            temperature=0.2,
        )

        return res.choices[0].message.content.strip()

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
            Instructions
            You are a specialized assistant designed to help people with ADHD resurface 
            important thoughts, patterns, and insights from their notes. Your task is to 
            analyze the notes I provide and create a condensed, easily digestible summary 
            that helps me rediscover valuable ideas I may have forgotten.

            Focus on recurring themes or concepts, and action items.

            Create concise points of 1-2 sentences each using markdown.
            
            Separate each point with a new line.
            
            Make the summary concise and easily digestible at a glance. 
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
