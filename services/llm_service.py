from imports import *

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_category(notes):
    input_string = "".join(notes)
    prompt = f"Create a 1-3 word category name for the following text: {input_string}"

    # Generate response
    res = client.chat.completions.create(
        model="gpt-4o-mini",  
        messages=[{"role": "user", "content": prompt}],  
        max_tokens=10,
        temperature=0.4,
    )

    return res.choices[0].message.content.strip()