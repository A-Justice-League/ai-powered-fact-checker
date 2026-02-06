# AI-Powered Fact Checker - Backend

This is the backend service for the AI-Powered Fact Checker, built with FastAPI and integrated with Gemini 3 for automated claim verification and Google Search Grounding.

## 🚀 Features
- **Claim Extraction**: Uses Gemini 3 to parse factual claims from text.
- **Google Search Grounding**: Verifies claims against real-time web data using Google Search.
- **Credibility Scoring**: Calculates a truthfulness score based on verified evidence.
- **Multimodal Support**: Image-to-claim analysis via Gemini 3's native multimodal capabilities.

## 🛠️ Technology Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **AI Engine**: [Gemini 3 API](https://ai.google.dev/) (gemini-2.0-flash)
- **Search Integration**: Google Search Grounding
- **Language**: Python 3.12+

## 📁 Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py       # Health check endpoint
│   │       └── analysis.py     # Fact-checking endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py           # Settings and configuration
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic request/response models
│   ├── services/
│   │   ├── __init__.py
│   │   └── gemini.py           # Gemini AI integration
│   └── utils/
│       ├── __init__.py
│       └── scoring.py          # Credibility scoring logic
├── requirements.txt
├── .env.example
├── README.md
```

## 📦 Deployment
For detailed production deployment instructions, see the top-level [**DEPLOYMENT.md**](../DEPLOYMENT.md).

## 🚦 Getting Started

### 1. Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash
DEBUG=True
```

### 4. Run the Server
```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the built-in runner
python -m app.main
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation
Once the server is running, visit:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### GET `/`
Health check endpoint
```json
{
  "message": "AI-Powered Fact Checker API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

### POST `/analyze-text`
Analyze text for factual claims

**Request:**
```json
{
  "text": "Your text content to fact-check..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "score": 85.5,
  "summaryVerdict": "Overall assessment...",
  "claims": [...],
  "timestamp": "2026-02-06T20:00:00Z",
  "inputPreview": "First 150 chars..."
}
```

### POST `/analyze-image`
Analyze image content for factual claims

**Request:** `multipart/form-data` with `file` field

**Response:** Same structure as `/analyze-text`

## 🏗️ Architecture

### Separation of Concerns
- **`main.py`**: Application factory, CORS setup, route registration
- **`api/routes/`**: HTTP endpoint definitions
- **`services/`**: Business logic (Gemini integration)
- **`models/`**: Data validation schemas
- **`core/`**: Configuration and settings
- **`utils/`**: Helper functions

### Dependency Injection
The application uses FastAPI's dependency injection for services, making it testable and maintainable.

## 🧪 Testing (Coming Soon)
```bash
# Unit tests
pytest tests/

# With coverage
pytest --cov=app tests/
```

## 📦 Deployment

### Production Setup
1. Set `DEBUG=False` in your environment
2. Use a production ASGI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
3. Configure CORS origins in `.env`:
   ```env
   CORS_ORIGINS=["https://yourdomain.com"]
   ```

### Docker (Optional)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
