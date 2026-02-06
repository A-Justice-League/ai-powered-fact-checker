# Deployment Guide

This guide covers both local development setup and production deployment for the AI-Powered Fact Checker.

---

## 📋 Table of Contents

- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Verification](#verification)
- [Production Deployment](#production-deployment)
  - [Backend Deployment (Railway)](#backend-deployment-railway)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Alternative Platforms](#alternative-platforms)
- [Docker Deployment](#docker-deployment)
- [Environment Variables Reference](#environment-variables-reference)
- [Troubleshooting](#troubleshooting)

---

## 🛠️ Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12+** ([Download here](https://www.python.org/downloads/))
- **Node.js 18+** and **npm** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Gemini API Key** (Get one at [ai.google.dev](https://ai.google.dev/))

#### Verify Installation

```bash
python3 --version  # Should be 3.12+
node --version     # Should be 18+
npm --version
```

---

### Backend Setup

#### 1. Navigate to Backend Directory

```bash
cd backend
```

#### 2. Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate it (Linux/Mac)
source venv/bin/activate

# Activate it (Windows)
venv\Scripts\activate
```

Your terminal should now show `(venv)` at the beginning of the prompt.

#### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi uvicorn google-genai python-multipart python-dotenv pydantic pydantic-settings
```

#### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Required configuration:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
DEBUG=True
```

**To get your Gemini API key:**
1. Visit [ai.google.dev](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to "Get API Key"
4. Copy the key and paste it into your `.env` file

#### 5. Start the Backend Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### 6. Test Backend

Open a new terminal and run:

```bash
curl http://localhost:8000/
```

**Expected response:**
```json
{
  "message": "AI-Powered Fact Checker API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

**Interactive API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

### Frontend Setup

#### 1. Navigate to Frontend Directory

```bash
# Open a NEW terminal (keep backend running)
cd frontend
```

#### 2. Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 1234 packages in 45s
```

#### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env
```

**Required configuration:**
```env
VITE_API_URL=http://localhost:8000
```

#### 4. Start the Frontend Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.4.19  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.x:5173/
  ➜  press h to show help
```

#### 5. Access the Application

Open your browser and visit: **http://localhost:5173**

You should see the AI-Powered Fact Checker homepage!

---

### Verification

#### Test Text Analysis

1. Click on the text input area
2. Paste this sample text:
   ```
   The Eiffel Tower is 330 meters tall and was completed in 1889.
   ```
3. Click "Analyze"
4. Wait 5-10 seconds for Gemini to respond
5. Verify:
   - Credibility score appears
   - Claims are listed with verdicts
   - Sources are clickable links

#### Test Image Analysis

1. Find an image with text or create a screenshot of an article
2. Upload it to the Image Upload panel
3. Click "Analyze Image"
4. Verify results appear with claims and sources

---

## 🚀 Production Deployment

### Backend Deployment (Railway)

[Railway](https://railway.app) offers easy deployment with automatic scaling.

#### Step 1: Create Railway Account

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

#### Step 2: Deploy from GitHub

1. Select "Deploy from GitHub repo"
2. Choose your repository
3. Select the `backend` directory as the root

#### Step 3: Configure Environment Variables

In the Railway dashboard:

1. Go to your project → Variables
2. Add the following:

```env
GEMINI_API_KEY=your_production_api_key
GEMINI_MODEL=gemini-2.0-flash
DEBUG=False
```

#### Step 4: Configure Build Settings

Railway should auto-detect Python. Verify:

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Railway will provide a public URL (e.g., `https://your-app.railway.app`)

#### Step 6: Test Production Backend

```bash
curl https://your-app.railway.app/
```

**Expected response:**
```json
{
  "message": "AI-Powered Fact Checker API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

### Frontend Deployment (Vercel)

[Vercel](https://vercel.com) is optimized for React/Vite deployments.

#### Step 1: Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"

#### Step 2: Import Repository

1. Select your GitHub repository
2. **Important**: Set the root directory to `frontend`

#### Step 3: Configure Build Settings

Vercel should auto-detect Vite. Verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 4: Configure Environment Variables

In the Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add:

```env
VITE_API_URL=https://your-backend.railway.app
```

**Important:** Use your Railway backend URL here!

#### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Vercel will provide a URL (e.g., `https://your-app.vercel.app`)

#### Step 6: Test Production Frontend

1. Visit your Vercel URL
2. Try analyzing text or uploading an image
3. Verify it connects to the production backend

---

### Alternative Platforms

#### Backend Alternatives

**Render** (Similar to Railway)
1. Visit [render.com](https://render.com)
2. Create a new Web Service
3. Connect GitHub repo
4. Set environment variables
5. Deploy command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Google Cloud Run** (Serverless)
1. Build Docker image: `docker build -t gcr.io/PROJECT_ID/fact-checker .`
2. Push to GCR: `docker push gcr.io/PROJECT_ID/fact-checker`
3. Deploy: `gcloud run deploy fact-checker --image gcr.io/PROJECT_ID/fact-checker`

#### Frontend Alternatives

**Netlify**
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set `VITE_API_URL` environment variable

**GitHub Pages** (Static only)
```bash
npm run build
gh-pages -d dist
```

---

## 🐳 Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build and run:**
```bash
cd backend
docker build -t fact-checker-backend .
docker run -p 8000:8000 --env-file .env fact-checker-backend
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build app
COPY . .
RUN npm run build

# Production server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run:**
```bash
cd frontend
docker build -t fact-checker-frontend .
docker run -p 3000:80 fact-checker-frontend
```

### Docker Compose (Full Stack)

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DEBUG=False
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
```

**Run the full stack:**
```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 🔐 Environment Variables Reference

### Backend (`.env`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `GEMINI_API_KEY` | Your Gemini API key | `AIza...` | ✅ Yes |
| `GEMINI_MODEL` | Model to use | `gemini-2.0-flash` | ✅ Yes |
| `DEBUG` | Enable debug mode | `True` / `False` | ❌ No (default: `False`) |
| `CORS_ORIGINS` | Allowed CORS origins | `["https://yourapp.com"]` | ❌ No (default: `["*"]`) |

### Frontend (`.env`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` | ✅ Yes |

---

## 🚨 Troubleshooting

### Backend Issues

#### Error: "ModuleNotFoundError: No module named 'app'"

**Solution:**
```bash
# Make sure you're running from the backend directory
cd backend
uvicorn app.main:app --reload
```

#### Error: "GEMINI_API_KEY not configured"

**Solution:**
1. Check that `.env` file exists in `backend/`
2. Verify `GEMINI_API_KEY` is set
3. Make sure there are no spaces around the `=` sign

#### Error: "Port 8000 is already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

#### Error: "Failed to fetch" when clicking Analyze

**Solution:**
1. Verify backend is running at `http://localhost:8000`
2. Check `VITE_API_URL` in frontend `.env`
3. Check browser console for CORS errors

#### Error: "npm ERR! code ELIFECYCLE"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Blank page after deployment

**Solution:**
1. Check browser console for errors
2. Verify `VITE_API_URL` points to production backend
3. Rebuild: `npm run build`

### Production Issues

#### CORS errors in production

**Solution:**

Backend `.env`:
```env
CORS_ORIGINS=["https://your-frontend.vercel.app"]
```

Or update `app/core/config.py` to read from environment.

#### "502 Bad Gateway" on Railway/Render

**Solution:**
1. Check build logs for errors
2. Verify start command uses `$PORT` variable
3. Ensure all environment variables are set

---

## 📊 Performance Optimization

### Backend

1. **Enable caching** for duplicate requests
2. **Use connection pooling** for Gemini API
3. **Add rate limiting** with `slowapi`

### Frontend

1. **Code splitting** with React.lazy()
2. **Image optimization** - compress uploads before sending
3. **Service worker** for offline support (PWA)

---

## 🔄 Continuous Deployment

### GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway CLI deploy
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support

If you encounter issues:

1. Check this guide thoroughly
2. Review [ISSUES.md](./ISSUES.md) for known problems
3. Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Python version, Node version)

---

**Happy Deploying! 🚀**
