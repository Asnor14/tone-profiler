import requests
import os
from dotenv import load_dotenv
from prompts import ModelID, get_ollama_prompt, get_t5_prompt_text

load_dotenv()

OLLAMA_BASE_URL = "http://localhost:11434"

class ModelManager:
    def __init__(self):
        self.current_model_id = None
        self.flan_t5_model = None
        self.flan_t5_tokenizer = None
        print("ModelManager initialized (Ollama mode)")
        self._check_ollama()

    def _check_ollama(self):
        """Check if Ollama is running"""
        try:
            response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m["name"] for m in models]
                print(f"Ollama is running. Available models: {model_names}")
                return True
        except requests.exceptions.ConnectionError:
            print("WARNING: Ollama is not running. Start it with 'ollama serve'")
        except Exception as e:
            print(f"WARNING: Could not connect to Ollama: {e}")
        return False

    def _load_flan_t5(self):
        """Lazy load FLAN-T5 for CPU usage"""
        if self.flan_t5_model is None:
            print("Loading FLAN-T5 (first time, may take a moment)...")
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
            model_name = "google/flan-t5-large"
            self.flan_t5_tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.flan_t5_model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self.flan_t5_model.to("cpu")
            print("FLAN-T5 loaded successfully")

    def generate(self, text: str, tone_id: str, model_id: str, max_tokens: int = 200) -> str:
        """Generate text using either Ollama or FLAN-T5"""
        
        if model_id == ModelID.FLAN_T5:
            return self._generate_flan_t5(text, tone_id, max_tokens)
        elif model_id == ModelID.LLAMA_3_2:
            return self._generate_ollama(text, tone_id, max_tokens)
        else:
            raise ValueError(f"Unknown model ID: {model_id}")

    def _generate_ollama(self, text: str, tone_id: str, max_tokens: int) -> str:
        """Generate using Ollama's REST API"""
        prompt = get_ollama_prompt(text, tone_id)
        
        payload = {
            "model": "llama3.2:3b",  # Ollama model name
            "messages": prompt,
            "stream": False,
            "options": {
                "num_predict": max_tokens,
                "temperature": 0.7
            }
        }

        try:
            response = requests.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload,
                timeout=120  # Longer timeout for CPU generation
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("message", {}).get("content", "").strip()
            else:
                error_msg = response.text
                raise ValueError(f"Ollama error: {error_msg}")
                
        except requests.exceptions.ConnectionError:
            raise ValueError("Cannot connect to Ollama. Make sure it's running with 'ollama serve'")
        except requests.exceptions.Timeout:
            raise ValueError("Ollama request timed out. The model may still be loading.")

    def _generate_flan_t5(self, text: str, tone_id: str, max_tokens: int) -> str:
        """Generate using local FLAN-T5"""
        self._load_flan_t5()
        
        prompt = get_t5_prompt_text(text, tone_id)
        
        inputs = self.flan_t5_tokenizer(prompt, return_tensors="pt").to("cpu")
        outputs = self.flan_t5_model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            do_sample=True,
            temperature=0.7
        )
        return self.flan_t5_tokenizer.decode(outputs[0], skip_special_tokens=True)

# Global singleton
model_manager = ModelManager()