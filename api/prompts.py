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

# Language-specific instructions
ENGLISH_INSTRUCTION = """You are an English rewriting assistant. STRICTLY reply in English. Do not use other languages."""

TAGALOG_INSTRUCTION = """You are a Filipino rewriting assistant. STRICTLY reply in Tagalog or Taglish (Tagalog-English mix). Adapt the persona to Filipino culture:
- 'Formal' uses 'po/opo' and deep Tagalog
- 'Neutral' uses conversational Tagalog  
- 'Urgent' uses commanding Filipino phrases
- 'Optimistic' uses encouraging Filipino expressions
- 'Sarcastic' uses 'kanto slang' like 'lodi', 'charr', 'anyare', 'charot'"""


def get_language_instruction(language: str) -> str:
    """Get the appropriate language instruction"""
    if language == "tagalog":
        return TAGALOG_INSTRUCTION
    return ENGLISH_INSTRUCTION


def get_t5_prompt_text(text: str, tone_id: str, language: str = "english") -> str:
    """Formats input for FLAN-T5 (instruction style)"""
    tone_desc = TONE_DESCRIPTIONS.get(tone_id, TONE_DESCRIPTIONS[Tone.NEUTRAL])
    lang_instruction = get_language_instruction(language)
    return f"{lang_instruction} Rewrite the following text to be {tone_desc}: {text}"


def get_ollama_prompt(text: str, tone_id: str, language: str = "english") -> list[dict]:
    """Formats input for Ollama chat API (Llama 3.2)"""
    tone_desc = TONE_DESCRIPTIONS.get(tone_id, TONE_DESCRIPTIONS[Tone.NEUTRAL])
    lang_instruction = get_language_instruction(language)
    
    system_prompt = f"""{lang_instruction}

You are a text-rewriting engine. Your ONLY job is to rewrite the user's input into a {tone_desc} style.

Rules:
- Output ONLY the rewritten text
- Do NOT add any introduction like "Here is the rewritten text:"
- Do NOT add any explanation
- Just output the result directly"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text}
    ]
