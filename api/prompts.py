from enum import Enum

class Tone(str, Enum):
    NEUTRAL = "neutral"
    FORMAL = "formal"
    URGENT = "urgent"
    OPTIMISTIC = "optimistic"
    SARCASTIC = "sarcastic"

class ModelID(str, Enum):
    FLAN_T5 = "flan-t5"
    LLAMA_3_2 = "llama-3.2"

# Tone descriptions for prompts
TONE_DESCRIPTIONS = {
    Tone.NEUTRAL: "neutral and objective",
    Tone.FORMAL: "formal, professional, and polite",
    Tone.URGENT: "urgent, concise, and commanding",
    Tone.OPTIMISTIC: "optimistic, enthusiastic, and hopeful",
    Tone.SARCASTIC: "sarcastic, dry, and skeptical",
}

# Bilingual instruction for Tagalog/Taglish support
BILINGUAL_INSTRUCTION = """You are a bilingual text-rewriting assistant. If the user input is in Tagalog or Taglish (Filipino-English mix), rewrite the text maintaining that language but applying the specific Tone. If the input is English, keep it English."""

def get_t5_prompt_text(text: str, tone_id: str) -> str:
    """Formats input for FLAN-T5 (instruction style)"""
    tone_desc = TONE_DESCRIPTIONS.get(tone_id, TONE_DESCRIPTIONS[Tone.NEUTRAL])
    return f"{BILINGUAL_INSTRUCTION} Rewrite the following text to be {tone_desc}: {text}"

def get_ollama_prompt(text: str, tone_id: str) -> list[dict]:
    """Formats input for Ollama chat API (Llama 3.2)"""
    tone_desc = TONE_DESCRIPTIONS.get(tone_id, TONE_DESCRIPTIONS[Tone.NEUTRAL])
    
    system_prompt = f"""{BILINGUAL_INSTRUCTION}

You are a text-rewriting engine. Your ONLY job is to rewrite the user's input into a {tone_desc} style.

Rules:
- Output ONLY the rewritten text
- Do NOT add any introduction like "Here is the rewritten text:"
- Do NOT add any explanation
- Just output the result directly
- If the input is in Tagalog/Taglish, respond in Tagalog/Taglish with the correct tone"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text}
    ]
