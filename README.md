# 🔍 AI-Powered Fact Checker

> **Gemini 3 Hackathon Project** - Fighting misinformation with AI-powered claim verification and real-time web grounding.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

---

## 📖 Overview

The **AI-Powered Fact Checker** is a full-stack web application that leverages **Gemini 3** with **Google Search Grounding** to automatically verify factual claims from text or image inputs. Users receive instant credibility scores, detailed verdicts (TRUE/FALSE/UNSURE), and cited sources—all powered by cutting-edge AI.

### 🎯 Key Features

- ✅ **Text Analysis**: Paste articles, social media posts, or any text for instant fact-checking
- ✅ **Image Analysis**: Upload screenshots or images containing claims
- ✅ **Gemini 3 Integration**: Powered by `gemini-2.0-flash` for fast, accurate analysis
- ✅ **Google Search Grounding**: Real-time web verification with cited sources
- ✅ **Credibility Scoring**: Algorithmic truthfulness score (0-100%)
- ✅ **Premium UI**: Modern, responsive design with smooth animations
- ✅ **Structured Output**: JSON-formatted claims with verdicts and evidence

### 🌍 Social Impact

Misinformation is a global crisis affecting elections, public health, and social cohesion. Our tool empowers users to:
- **Verify claims** before sharing on social media
- **Educate** themselves with evidence-based explanations
- **Combat** the spread of false information

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   React Frontend (Vite + TypeScript) │
│   - Premium UI with Tailwind CSS     │
│   - Framer Motion animations         │
└───────────────┬─────────────────────┘
                │ HTTP/JSON
                ▼
┌─────────────────────────────────────┐
│   FastAPI Backend (Python 3.12+)    │
│   - Modular architecture             │
│   - Pydantic validation              │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Gemini 3 API (gemini-2.0-flash)   │
│   + Google Search Grounding          │
└─────────────────────────────────────┘
```

**For detailed architecture documentation**, see [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+**
- **Node.js 18+**
- **Gemini API Key** (get one at [ai.google.dev](https://ai.google.dev/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ai-powered-fact-checker.git
cd ai-powered-fact-checker
```

### 2. Setup Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

The API will run at `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📚 Documentation

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design and technical details
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Full local and production deployment guide
- **[FEATURES.md](./docs/FEATURES.md)** - Feature roadmap and implementation status
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute to the project
- **[ISSUES.md](./docs/ISSUES.md)** - Planned GitHub issues and enhancements
- **[GOOGLE_SEARCH_GROUNDING.md](./docs/GOOGLE_SEARCH_GROUNDING.md)** - Deep dive into grounding implementation
- **[Backend README](./backend/README.md)** - Backend-specific documentation
- **[Frontend README](./frontend/README.md)** - Frontend-specific documentation

---

## 🎬 Demo

### Text Analysis
1. Paste an article or social media post
2. Click "Analyze"
3. View credibility score, claim verdicts, and sources

### Image Analysis
1. Upload a screenshot containing claims
2. Gemini extracts text and identifies claims
3. Google Search verifies each claim
4. View results with cited sources

**[📹 Watch the full demo video →](#)** _(Coming soon)_

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Gemini 3 API** - `gemini-2.0-flash` for claim extraction and verification
- **Google Search Grounding** - Real-time web verification
- **Pydantic** - Data validation and settings management
- **Python 3.12+** - Modern Python with type hints

### Frontend
- **React 18** - Component-based UI library
- **Vite** - Next-generation build tool
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ --cov=app
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### E2E Tests (Coming Soon)
```bash
npm run test:e2e
```

---

## 📦 Deployment

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables:
   - `GEMINI_API_KEY`
   - `DEBUG=False`
3. Deploy!

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set `VITE_API_URL` to your production backend URL
3. Deploy!

**Live Demo:** _Coming soon after deployment_

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting PRs.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write tests
5. Submit a pull request

### Code Standards
- **Backend**: Black formatting, type hints, docstrings
- **Frontend**: ESLint + Prettier, TypeScript strict mode
- **Commits**: Conventional Commits format

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**A-Justice-League** - Gemini 3 Hackathon Participants

- [Team Member 1] - Backend Development
- [Team Member 2] - Frontend Development
- [Team Member 3] - AI/ML Engineering
- [Your Name] - Full Stack & Project Lead

---

## 🙏 Acknowledgments

- **Google** for the Gemini API and hackathon opportunity
- **FastAPI** and **React** communities for excellent documentation
- All open-source contributors whose libraries made this possible

---

## 📞 Contact

- **GitHub Issues**: [Open an issue](https://github.com/your-org/ai-powered-fact-checker/issues)
- **Email**: your-team@example.com
- **Twitter**: [@YourTeamHandle](#)

---

## 🌟 Star this repo if you find it useful!

**Like what you see?** Give us a ⭐ on GitHub to show your support!

---

**Made with ❤️ for the Gemini 3 Global Hackathon**
