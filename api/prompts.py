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

# Tagalog tone-specific cultural mappings for authentic Filipino output
TAGALOG_TONE_MAPPING = {
    "neutral": "Gamitin ang natural na pang-araw-araw na Tagalog. Maging conversational at approachable.",
    "formal": "Gamitin ang malalim na Tagalog. PALAGING gumamit ng 'po' at 'opo'. Iwasan ang slang. Maging magalang at propesyonal. Halimbawa: 'Magandang araw po. Maaari ko po bang malaman...'",
    "urgent": "Gumamit ng maikli at direktang Tagalog commands. Parang military o authority figure. Halimbawa: 'NGAYON NA!', 'GAWIN MO AGAD!', 'HINDI NA PWEDENG MAGHINTAY!'",
    "optimistic": "Gumamit ng masigla at positibong Filipino expressions. Halimbawa: 'Kaya yan!', 'Laban lang!', 'Ang galing naman!', 'Excited ako para sayo!'",
    "sarcastic": "Gumamit ng kanto slang at Filipino internet speak. Halimbawa: 'Charot!', 'Lodi', 'Anyare?', 'Edi wow', 'Sana all', 'Awit', 'Sige na nga'",
}

# STRICT English instruction - NO exceptions
ENGLISH_INSTRUCTION = """CRITICAL LANGUAGE RULE: You MUST respond ONLY in English.
- DO NOT use any Tagalog, Filipino, or non-English words
- DO NOT code-switch or mix languages
- If the input contains Tagalog words, still respond in 100% English
- Every single word in your response MUST be English
- VIOLATION OF THIS RULE IS UNACCEPTABLE"""

# STRICT Tagalog instruction with cultural mapping
TAGALOG_INSTRUCTION = """CRITICAL LANGUAGE RULE: You MUST respond ONLY in Tagalog or natural Taglish (Filipino code-mixing).
- DO NOT respond in pure English
- Use authentic Filipino expressions, not translated English
- Sound like a native Filipino speaker from Manila
- Use Filipino sentence structure, not English translated to Tagalog
- Include natural Filipino expressions like 'naman', 'kasi', 'diba', 'eh', 'ba'
- NEVER sound like Google Translate

CULTURAL TONE ADAPTATION:
{tone_mapping}

EXAMPLE NATURAL TAGALOG:
- Instead of "I am happy" → "Masaya ako!" or "Ang saya ko!"
- Instead of "Please help me" → "Tulong naman po" or "Paki-tulong po"
- Instead of "That's interesting" → "Ang galing naman nun!" or "Grabe, nice yan!"

VIOLATION OF THIS LANGUAGE RULE IS UNACCEPTABLE."""


def get_language_instruction(language: str, tone_id: str = "neutral") -> str:
    """Get the appropriate language instruction with tone-specific cultural mapping"""
    if language == "tagalog":
        tone_mapping = TAGALOG_TONE_MAPPING.get(tone_id, TAGALOG_TONE_MAPPING["neutral"])
        return TAGALOG_INSTRUCTION.format(tone_mapping=tone_mapping)
    return ENGLISH_INSTRUCTION


def get_t5_prompt_text(text: str, tone_id: str, language: str = "english") -> str:
    """Formats input for FLAN-T5 (instruction style)"""
    tone_desc = TONE_DESCRIPTIONS.get(tone_id, TONE_DESCRIPTIONS[Tone.NEUTRAL])
    lang_instruction = get_language_instruction(language, tone_id)
    return f"{lang_instruction}\n\nRewrite the following text to be {tone_desc}: {text}"


def get_ollama_prompt(text: str, tone_id: str, language: str = "english") -> list[dict]:
    """Formats input for Ollama chat API (Llama 3.2)"""
    tone_desc = TONE_DESCRIPTIONS.get(tone_id, TONE_DESCRIPTIONS[Tone.NEUTRAL])
    lang_instruction = get_language_instruction(language, tone_id)
    
    system_prompt = f"""{lang_instruction}

You are a text-rewriting engine. Your ONLY job is to rewrite the user's input into a {tone_desc} style.

STRICT OUTPUT RULES:
- Output ONLY the rewritten text
- Do NOT add any introduction like "Here is the rewritten text:"
- Do NOT add any explanation or commentary
- Do NOT translate - transform the MEANING, not just the words
- Just output the result directly

REMEMBER: Follow the LANGUAGE RULE above with ZERO exceptions."""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text}
    ]
