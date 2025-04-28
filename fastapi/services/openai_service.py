from typing import List
from dotenv import load_dotenv
import openai
from services.utils import preprocess_text, get_category_examples
import os
import json

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
        category_examples = "\n".join(get_category_examples())
        prompt = f"""
        Analyze the following notes.
        
        Generate a short, general label that captures the core topic or purpose of the group. Avoid overly specific or niche phrasing.

        Formatting Rules:

        Use Title Case (capitalize each major word)

        Use only letters and spaces (no punctuation or special characters)

        Use 2 to 3 words maximum (2 preferred if sufficient)

        Examples:
        {category_examples}

        Notes:
        {input_string}
        """

        # Generate response
        res = self.client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=[{"role": "user", "content": prompt}],  
            max_tokens=10,
            temperature=0.0,
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
            You are a summarization assistant.

            Your task is to provide a snapshot of the given notes. Be extremely concise. Focus on important ideas. Group together related ideas.

            Formatting Rules:

            Provide 2 - 4 short sections (1 - 3 bullet points each)

            Format each section with a bolded header, followed by a brief, concise bullet point list.

            Use valid Markdown syntax: **Header** followed by the bullet points.

            Add one extra line between each section to visually separate them.

            Strict Constraints:

            Do not refer to the user.

            Do not invent or infer anything not explicitly stated.

            Do not wrap the output in code blocks or triple backticks.

            Do not use bullet points, numbered lists, or emojis.

            Do not include an introduction or closing statement.

            Here are the notes:
            ---  
            {text }
            ---
            """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=1000,
        )

        summary = response.choices[0].message.content
        return summary
