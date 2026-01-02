from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model_manager import model_manager
from prompts import Tone, ModelID
from utils import file_to_text

app = FastAPI(title="ChadGPT API (Ollama)")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    text: str
    toneId: str
    modelId: str

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
