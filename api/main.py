import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import requests

from model_manager import model_manager
from prompts import Tone, ModelID
from utils import file_to_text

# Load environment variables
load_dotenv()

app = FastAPI(title="ChadGPT API (Ollama)")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ElevenLabs Male Voice ID mapping per tone persona
VOICE_MAP = {
    "neutral": "pNInz6obpgDQGcFmaJgB",     # Adam - Deep, narration style
    "formal": "ErXwobaYiN019PkySvjV",       # Antoni - Polite, well-spoken
    "urgent": "2EiwWnXFnvU5JabPnv8n",       # Clyde - Deep, authoritative
    "optimistic": "TxGEqnHWrfWFTfGW9XjX",   # Josh - Young, energetic, happy
    "sarcastic": "MF3mGyEYCl7XYWbV9V6O",    # Fin - Low pitch, dry, monotone
}

class GenerateRequest(BaseModel):
    text: str
    toneId: str
    modelId: str

class TTSRequest(BaseModel):
    text: str
    toneId: str

@app.get("/")
def read_root():
    return {"status": "ChadGPT API is running (Ollama mode). Ready to get swole."}

@app.post("/generate")
async def generate_text(request: GenerateRequest):
    try:
        # Validate inputs
        if request.toneId not in [t.value for t in Tone]:
            raise HTTPException(status_code=400, detail=f"Invalid toneId: {request.toneId}")
        if request.modelId not in [m.value for m in ModelID]:
            raise HTTPException(status_code=400, detail=f"Invalid modelId: {request.modelId}")
        
        print(f"Received request: Model={request.modelId}, Tone={request.toneId}")
        
        # Generate
        output = model_manager.generate(
            text=request.text,
            tone_id=request.toneId,
            model_id=request.modelId
        )
        
        # Clean output (remove common prefixes if model adds them)
        cleaned = output.strip()
        prefixes_to_remove = [
            "Here is the rewritten text:",
            "Here's the rewritten text:",
            "Sure, here is the text:",
            "Here you go:",
        ]
        for prefix in prefixes_to_remove:
            if cleaned.lower().startswith(prefix.lower()):
                cleaned = cleaned[len(prefix):].strip()
        
        return {"rewritten": cleaned}

    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    toneId: str = Form(...),
    modelId: str = Form(...)
):
    try:
        content = await file.read()
        raw_text = file_to_text(file.filename or "unknown.txt", content)
        
        # Truncate for safety (1000 chars)
        if len(raw_text) > 1000:
            raw_text = raw_text[:1000]
        
        req = GenerateRequest(text=raw_text, toneId=toneId, modelId=modelId)
        return await generate_text(req)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Text-to-Speech endpoint using ai33.pro API (ElevenLabs proxy).
    Uses task-based flow: create task -> poll until done -> return audio URL.
    Uses male voices matched to each persona tone.
    """
    import time
    
    try:
        # Get API key from environment
        api_key = os.getenv("ELEVENLABS_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="ELEVENLABS_API_KEY not configured. Add it to your .env file."
            )
        
        # Get voice ID based on tone (default to Adam if not found)
        voice_id = VOICE_MAP.get(request.toneId, VOICE_MAP["neutral"])
        
        # ai33.pro API endpoint (ElevenLabs proxy)
        url = f"https://api.ai33.pro/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128"
        
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": api_key,
        }
        
        # Note: ai33.pro usually ignores voice_settings in the payload or handles them differently
        # We stick to the basic payload required by ai33.pro docs
        payload = {
            "text": request.text,
            "model_id": "eleven_multilingual_v2",
            "with_transcript": False,
        }
        
        print(f"TTS Request: Tone={request.toneId}, Voice={voice_id} (via ai33.pro)")
        
        # Step 1: Create TTS task
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            error_detail = response.text
            print(f"ai33.pro API Error: {error_detail}")
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"ai33.pro API error: {error_detail}"
            )
        
        result = response.json()
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail="Failed to create TTS task")
        
        task_id = result.get("task_id")
        print(f"TTS Task created: {task_id}")
        
        # Step 2: Poll for task completion (max 30 seconds)
        task_url = f"https://api.ai33.pro/v1/task/{task_id}"
        max_attempts = 30
        
        for attempt in range(max_attempts):
            time.sleep(1)  # Wait 1 second between polls
            
            task_response = requests.get(task_url, headers={"xi-api-key": api_key})
            
            if task_response.status_code != 200:
                continue
            
            task_data = task_response.json()
            status = task_data.get("status")
            
            print(f"TTS Task {task_id} status: {status}")
            
            if status == "done":
                # Get audio URL from metadata
                metadata = task_data.get("metadata", {})
                audio_url = metadata.get("audio_url")
                
                if not audio_url:
                    raise HTTPException(status_code=500, detail="No audio URL in response")
                
                # Step 3: Fetch the audio and stream it back
                audio_response = requests.get(audio_url, stream=True)
                
                if audio_response.status_code != 200:
                    raise HTTPException(status_code=500, detail="Failed to fetch audio")
                
                def generate_audio():
                    for chunk in audio_response.iter_content(chunk_size=1024):
                        if chunk:
                            yield chunk
                
                return StreamingResponse(
                    generate_audio(),
                    media_type="audio/mpeg",
                    headers={
                        "Content-Disposition": "inline",
                        "Cache-Control": "no-cache",
                    }
                )
            
            elif status == "failed":
                error_msg = task_data.get("error_message", "Unknown error")
                raise HTTPException(status_code=500, detail=f"TTS task failed: {error_msg}")
        
        # Timeout
        raise HTTPException(status_code=504, detail="TTS task timed out")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"TTS Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
