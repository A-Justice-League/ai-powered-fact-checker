# AI-Powered Fact Checker - Frontend

The frontend for the AI-Powered Fact Checker, providing a clean, premium interface for users to verify claims from text and images. Built with **React 18**, **TypeScript**, and **Vite** for maximum performance and a modern developer experience.

## 🚀 Features
- **Premium Design**: A polished, glassmorphic UI using a custom color palette curated for the project.
- **Multimodal Input**: Supports both plain text analysis and direct image uploads.
- **Real-time Feedback**: Interactive loading states and staggered animations for a fluid user experience.
- **Credibility Gauge**: Instant visual representation of the overall content's truthfulness.
- **Detailed Claim Cards**: Each verified claim includes an explanation and clickable grounding sources.
- **Responsive Layout**: Optimized for all devices, from mobile phones to high-resolution desktops.

## 🛠️ Technology Stack
- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (via [shadcn/ui](https://ui.shadcn.com/))
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks + [TanStack Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Environment Configuration
Create a `.env` file in the root of the frontend directory:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your running backend:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```
The static files will be generated in the `dist/` directory.

## 📁 Directory Structure
```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── Header.tsx
│   │   ├── TextInputPanel.tsx
│   │   ├── ImageUploadPanel.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   └── Index.tsx
│   ├── data/               # Static data and types
│   ├── lib/                # Shared utilities (cn helper, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Root component & providers
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── ... configurations
```

## 🎨 Design Tokens
The project uses a custom color palette defined in `tailwind.config.ts`:
- **Brand Navy**: `#112B40` (Primary text & backgrounds)
- **Brand Cyan**: `#6BA6BE` (Accent & True verdicts)
- **Brand Deep**: `#36526A` (Secondary elements)
- **Brand Muted**: `#5C7A8F` (Metadata & subtle text)
- **Danger**: For FALSE verdicts
- **Warning**: For UNSURE verdicts

## 🧪 Testing
```bash
npm run test
```
(Unit testing setup is in progress. See `ISSUES.md` #14)

## 📦 Deployment
See the top-level [**DEPLOYMENT.md**](../DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

---
**Part of the A-Justice-League Gemini 3 Hackathon Entry**
