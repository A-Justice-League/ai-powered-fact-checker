# Architecture Overview

## System Description
The AI-Powered Fact Checker is a full-stack web application that leverages **Gemini 3** with **Google Search Grounding** to verify factual claims from text or image inputs. The system extracts claims, validates them against real-time web sources, and presents users with credibility scores, verdicts, and cited evidence.

---

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **AI Engine**: Gemini 2.0 Flash (via `google-genai` SDK)
- **Search Grounding**: Google Search API integration
- **API Design**: RESTful JSON endpoints with CORS support
- **Environment Management**: `python-dotenv`

### Frontend
- **Framework**: Vite + React 18 + TypeScript
- **UI Components**: Radix UI (shadcn/ui)
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **State Management**: React Hooks + TanStack Query
- **Routing**: React Router v6

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  (React + Vite + Tailwind CSS + Framer Motion)              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/JSON
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND API LAYER                        │
│                    (FastAPI + CORS)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /analyze-text   │  POST /analyze-image         │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  GEMINI 3 AI INTEGRATION                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Claim Extraction                                   │  │
│  │  - Multimodal Processing (Text + Images)             │  │
│  │  - Google Search Grounding Tool                       │  │
│  │  - Structured JSON Response                           │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE SEARCH API                         │
│              (Real-time Web Verification)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app factory
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py       # GET / health check
│   │       └── analysis.py     # POST /analyze-text, /analyze-image
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py           # Pydantic Settings for env vars
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Request/Response models (Pydantic)
│   ├── services/
│   │   ├── __init__.py
│   │   └── gemini.py           # Gemini AI integration logic
│   └── utils/
│       ├── __init__.py
│       └── scoring.py          # Credibility calculation functions
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variable template
└── README.md                  # Backend documentation
```

### Core Components

#### 1. **API Endpoints**
- `GET /`: Health check endpoint
- `POST /analyze-text`: Accepts text input, returns fact-check analysis
- `POST /analyze-image`: Accepts image file, performs multimodal analysis

#### 2. **Data Models (Pydantic)**
```python
FactCheckRequest    # Input: text string
Source              # domain, title, url
Claim               # id, text, verdict, explanation, sources[]
FactCheckResponse   # id, score, summaryVerdict, claims[], timestamp, inputPreview
```

#### 3. **Gemini Integration**
- **Model**: `gemini-2.0-flash`
- **Configuration**: 
  - Google Search Grounding tool enabled
  - JSON-structured output enforced
- **Prompt Engineering**: Instructs Gemini to extract claims, verify with search, and return structured results

#### 4. **Processing Flow**
1. Receive user input (text or image)
2. Construct structured prompt for Gemini
3. Enable Google Search Grounding tool
4. Parse JSON response
5. Calculate credibility score: `(true_count + unsure_count * 0.5) / total_claims * 100`
6. Return formatted response with claim IDs, timestamps, and metadata

---

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── TextInputPanel.tsx
│   │   ├── ImageUploadPanel.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── CredibilityGauge.tsx
│   │   ├── ClaimCard.tsx
│   │   ├── HistoryPanel.tsx
│   │   ├── Footer.tsx
│   │   └── ui/             # shadcn/ui primitives
│   ├── pages/
│   │   ├── Index.tsx       # Main application page
│   │   └── NotFound.tsx    # 404 page
│   ├── data/
│   │   └── mockData.ts     # Mock data for development
│   ├── hooks/
│   │   └── use-toast.ts    # Toast notification hook
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn)
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── public/                 # Static assets
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite build configuration
└── .env.example            # Environment template
```

### Component Hierarchy
```
App
└── QueryClientProvider
    └── TooltipProvider
        └── BrowserRouter
            └── Routes
                ├── Index (Main Page)
                │   ├── Header
                │   ├── Hero
                │   ├── Input Section
                │   │   ├── TextInputPanel
                │   │   └── ImageUploadPanel
                │   ├── ResultsPanel
                │   │   ├── CredibilityGauge
                │   │   └── ClaimCard[]
                │   ├── HistoryPanel
                │   └── Footer
                └── NotFound
```

### State Management
- **Local State**: React `useState` for component-level state
- **Refs**: `useRef` for DOM manipulation (scroll, focus)
- **API Calls**: Native `fetch` with loading/error handling
- **Toasts**: `useToast` hook for user feedback
- **History**: In-memory array (not persisted)

---

## Data Flow

### Text Analysis Flow
```
User Input (TextInputPanel)
    ↓
handleAnalyze(text)
    ↓
POST /analyze-text { text: "..." }
    ↓
FastAPI receives request
    ↓
Gemini 3 + Google Search Grounding
    ↓
JSON Response { claims, summaryVerdict }
    ↓
Calculate score, add IDs, timestamp
    ↓
Return FactCheckResponse
    ↓
Frontend displays in ResultsPanel
    ↓
ClaimCard components render each claim
```

### Image Analysis Flow
```
User Upload (ImageUploadPanel)
    ↓
handleAnalyzeImage(file)
    ↓
POST /analyze-image (multipart/form-data)
    ↓
FastAPI receives file
    ↓
Gemini 3 Multimodal + Google Search Grounding
    ↓
Extract claims from image, verify with search
    ↓
Return FactCheckResponse
    ↓
Frontend displays results
```

---

## API Contract

### POST /analyze-text
**Request:**
```json
{
  "text": "String of text to analyze"
}
```

**Response:**
```json
{
  "id": "uuid",
  "score": 72.5,
  "summaryVerdict": "Mixed credibility — some claims verified...",
  "claims": [
    {
      "id": "c1-abc123",
      "text": "Claim text",
      "verdict": "TRUE" | "FALSE" | "UNSURE",
      "explanation": "Reasoning...",
      "sources": [
        {
          "domain": "nasa.gov",
          "title": "Page Title",
          "url": "https://..."
        }
      ]
    }
  ],
  "timestamp": "2026-02-06T20:00:00Z",
  "inputPreview": "First 150 chars..."
}
```

### POST /analyze-image
**Request:** `multipart/form-data` with `file` field

**Response:** Same as `/analyze-text`

---

## Design System

### Color Palette (from logo)
- **Background**: `#E2E7EC`
- **Primary Navy**: `#112B40`
- **Accent Cyan**: `#6BA6BE`
- **Accent Deep**: `#36526A`
- **Muted Mid**: `#5C7A8F`
- **Light Neutral**: `#B2C0C9`

### Verdict Colors
- **TRUE**: Cyan (`#6BA6BE`)
- **FALSE**: Danger (Red)
- **UNSURE**: Warning (Yellow/Amber)

---

## Security Considerations
- **CORS**: Configured to allow all origins (dev mode). **Must be restricted in production.**
- **API Keys**: Stored in `.env` files, never committed to version control.
- **Input Validation**: Pydantic models enforce type safety on backend.
- **Rate Limiting**: Not yet implemented (TODO for production).

---

## Deployment Architecture (Planned)

### Backend
- **Platform**: Railway, Render, or Google Cloud Run
- **Environment**: Production `.env` with restricted CORS origins
- **Scaling**: Stateless, horizontal scaling ready

### Frontend
- **Platform**: Vercel, Netlify, or GitHub Pages
- **Build**: `npm run build` → static site
- **Environment**: `VITE_API_URL` set to production backend URL

---

## Performance Optimizations
- **Frontend**: Code splitting with React.lazy (not yet implemented)
- **Backend**: Keep-alive connections, async request handling
- **AI Calls**: Single request per analysis, no retries (TODO: add exponential backoff)
- **Caching**: No caching layer yet (TODO: Redis for repeated queries)

---

## Testing Strategy (Not Yet Implemented)
- **Backend**: pytest with mock Gemini responses
- **Frontend**: Vitest + React Testing Library
- **E2E**: Playwright for critical user flows
- **API Contract**: OpenAPI schema validation

---

## Future Architecture Enhancements
1. **Database Layer**: PostgreSQL for user history persistence
2. **Authentication**: JWT-based user accounts
3. **Real-time Updates**: WebSocket for live analysis status
4. **CDN Integration**: CloudFlare for static assets
5. **Monitoring**: Sentry for error tracking, Google Analytics for usage
