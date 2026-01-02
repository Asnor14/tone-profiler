@echo off
echo Starting ChadGPT Backend Setup...

cd api

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies (this may take a while)...
pip install -r requirements.txt

if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and add your HF_TOKEN
    echo.
)

echo Starting FastAPI Server...
echo API will be available at http://localhost:8000
echo.
python main.py

pause
