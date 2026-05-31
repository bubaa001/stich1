import os
import random
from google import genai
from google.genai import types

_ai_client = None

def get_gemini_client():
    global _ai_client
    if _ai_client is None:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not defined.")
        
        # According to standard SDK requirements
        _ai_client = genai.Client(
            api_key=api_key,
            http_options={'headers': {'User-Agent': 'aistudio-build'}}
        )
    return _ai_client

def generate_math_hint(prompt: str, system_instruction: str = None) -> dict:
    if not system_instruction:
        system_instruction = "You are Professor Aris, an expert, encouraging secondary school mathematics tutor. Keep hints short, conceptual, and highly elegant, with clean Markdown."
        
    try:
        client = get_gemini_client()
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7
            )
        )
        
        parsed_text = response.text or "I was unable to compute that answer. Let's try another formula!"
        return {"text": parsed_text}
        
    except Exception as e:
        print("Gemini API server-side issue:", e)
        
        # Fallback Simulated Math Assistant responses if API key is not yet set or errors
        fallback_instructions = [
            "Here is Professor Aris's hint: Remember that for any quadratic equation in the form of $ax^2 + bx + c = 0$, you can solve for $x$ by factoring, completing the square, or using the Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. Make sure to calculate the discriminant $D = b^2 - 4ac$ first to check for real roots!",
            "Review study indicator: In inequality algebra, when you multiply or divide both sides of an inequality by a negative number, you MUST reverse the inequality sign! E.g. $-2x < 6 \\implies x > -3$.",
            "Let's solve $2x + 5 = 15$ step by step:\n1. Subtract $5$ from both sides: $2x = 10$\n2. Divide by $2$: $x = 5$. Thus, option B is correct!"
        ]
        random_fallback = random.choice(fallback_instructions)
        return {
            "text": random_fallback,
            "warning": "Operating in high-fidelity simulator fallback mode (Gemini API key is unset or awaiting activation)."
        }
