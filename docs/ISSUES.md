# GitHub Issues for AI-Powered Fact Checker

This document contains structured GitHub issues ready to be created. Each issue is formatted with a title, description, labels, and acceptance criteria.

---

## 🏗️ Infrastructure & Setup

### Issue #1: Delete Deprecated main.py File
**Priority:** Low  
**Labels:** `cleanup`, `refactoring`

**Description:**
The old monolithic `backend/main.py` file is no longer needed after the modularization. It should be deleted to avoid confusion.

**Tasks:**
- [ ] Delete `backend/main.py`
- [ ] Verify that `uvicorn app.main:app` still works
- [ ] Update any documentation that references the old file

**Acceptance Criteria:**
- Old `main.py` is removed from the repository
- Backend still runs without errors

---

### Issue #2: Add .gitignore for Python and Node
**Priority:** High  
**Labels:** `infrastructure`, `good-first-issue`

**Description:**
We need a comprehensive `.gitignore` file to prevent committing environment files, dependencies, and build artifacts.

**Tasks:**
- [ ] Create `.gitignore` in project root
- [ ] Ignore Python artifacts (`__pycache__`, `*.pyc`, `.env`, `venv/`)
- [ ] Ignore Node artifacts (`node_modules/`, `dist/`, `.env.local`)
- [ ] Ignore IDE files (`.vscode/`, `.idea/`)

**Acceptance Criteria:**
- `.gitignore` exists and covers all common artifacts
- No sensitive files (`.env`) are tracked by Git

---

### Issue #3: Add Logging Infrastructure
**Priority:** Medium  
**Labels:** `enhancement`, `backend`

**Description:**
Replace `print()` statements with proper Python logging for better observability in production.

**Tasks:**
- [ ] Create `app/core/logging.py` with logging configuration
- [ ] Add structured logging (JSON format for production)
- [ ] Replace all `print()` calls with `logger.info()`, `logger.error()`
- [ ] Add request ID tracking for debugging

**Acceptance Criteria:**
- All console output uses Python's `logging` module
- Logs include timestamps, log levels, and context
- Production logs are in JSON format

---

## 🤖 AI & Gemini Integration

### Issue #4: Document Google Search Grounding Implementation
**Priority:** High  
**Labels:** `documentation`, `ai`

**Description:**
The Google Search Grounding feature is already implemented but not well-documented. We need to explain how it works and how to verify it's functioning.

**Tasks:**
- [ ] Add a `GOOGLE_SEARCH_GROUNDING.md` doc explaining the feature
- [ ] Document how to verify grounding is working (check response metadata)
- [ ] Add examples of grounded vs. non-grounded responses
- [ ] Link to official Google docs

**Acceptance Criteria:**
- New documentation file exists
- Developers can understand how grounding works
- Examples show real grounding metadata from Gemini

---

### Issue #5: Add Retry Logic for Gemini API Calls
**Priority:** Medium  
**Labels:** `enhancement`, `backend`, `reliability`

**Description:**
Gemini API calls can occasionally fail due to rate limits or network issues. We should implement exponential backoff retry logic.

**Tasks:**
- [ ] Install `tenacity` library for retries
- [ ] Wrap Gemini calls with `@retry` decorator
- [ ] Configure max retries (3) and exponential backoff
- [ ] Log retry attempts
- [ ] Add custom error messages for different failure types

**Acceptance Criteria:**
- Transient failures are automatically retried
- Permanent failures return clear error messages
- Retry attempts are logged

---

### Issue #6: Improve Gemini Prompt for Better Claim Extraction
**Priority:** High  
**Labels:** `enhancement`, `ai`, `prompt-engineering`

**Description:**
The current prompt sometimes misses claims or extracts irrelevant information. We should refine the prompt for better accuracy.

**Tasks:**
- [ ] Research best practices for claim extraction prompts
- [ ] Add few-shot examples to the prompt
- [ ] Test on 20+ sample articles
- [ ] Document prompt improvements in `PROMPTS.md`

**Acceptance Criteria:**
- Claim extraction accuracy improves by at least 20%
- Prompt is version-controlled and documented

---

### Issue #7: Add Gemini Response Caching
**Priority:** Low  
**Labels:** `enhancement`, `performance`

**Description:**
Identical text inputs should return cached results instead of making duplicate Gemini API calls.

**Tasks:**
- [ ] Install Redis or use in-memory cache
- [ ] Hash input text to create cache keys
- [ ] Cache responses for 24 hours
- [ ] Add cache hit/miss metrics

**Acceptance Criteria:**
- Duplicate queries return instantly from cache
- Cache invalidation works correctly
- Metrics show cache hit rate

---

## 🎨 Frontend Enhancements

### Issue #8: Fix TypeScript Lint Errors in ImageUploadPanel
**Priority:** Medium  
**Labels:** `bug`, `frontend`, `typescript`

**Description:**
There are TypeScript errors in `ImageUploadPanel.tsx` related to module resolution (react, lucide-react). These need to be investigated and fixed.

**Tasks:**
- [ ] Run `npm run build` to reproduce errors
- [ ] Check if errors are real or IDE false positives
- [ ] Update `tsconfig.json` if needed
- [ ] Verify all imports resolve correctly

**Acceptance Criteria:**
- `npm run build` completes without errors
- No TypeScript errors in IDE

---

### Issue #9: Add LocalStorage Persistence for History
**Priority:** High  
**Labels:** `enhancement`, `frontend`

**Description:**
Analysis history is currently lost on page refresh. We should persist it to `localStorage`.

**Tasks:**
- [ ] Create `hooks/useLocalStorage.ts` hook
- [ ] Persist `history` state to localStorage
- [ ] Load history on app mount
- [ ] Add "Clear History" button

**Acceptance Criteria:**
- History persists across page refreshes
- Users can clear their history
- Maximum 50 items stored (prevent localStorage overflow)

---

### Issue #10: Implement Share Functionality
**Priority:** Medium  
**Labels:** `enhancement`, `frontend`

**Description:**
The "Share" button on claim cards currently does nothing. We should implement URL-based sharing.

**Tasks:**
- [ ] Add URL state management for analysis results
- [ ] Generate shareable links (e.g., `?result=base64encodeddata`)
- [ ] Add copy-to-clipboard functionality
- [ ] Show "Link copied!" toast notification

**Acceptance Criteria:**
- Clicking Share copies a working URL to clipboard
- Opening the URL shows the shared analysis result
- Toast notification confirms copy action

---

### Issue #11: Add Dark Mode Toggle
**Priority:** Low  
**Labels:** `enhancement`, `frontend`, `ui/ux`

**Description:**
The app uses `next-themes` but doesn't expose a dark mode toggle. We should add one to the header.

**Tasks:**
- [ ] Add theme toggle button to `Header.tsx`
- [ ] Verify dark mode styles work correctly
- [ ] Persist theme preference to localStorage
- [ ] Add smooth transition animation

**Acceptance Criteria:**
- Users can switch between light/dark modes
- Theme preference persists across sessions
- All components look good in both modes

---

### Issue #12: Add Loading Skeleton States
**Priority:** Low  
**Labels:** `enhancement`, `frontend`, `ui/ux`

**Description:**
While analysis is running, we should show more detailed skeleton loaders that match the actual result structure.

**Tasks:**
- [ ] Create skeleton components for gauge, claim cards
- [ ] Replace generic spinner with structured skeletons
- [ ] Add staggered animation for polish

**Acceptance Criteria:**
- Loading states show realistic preview of results
- Skeletons match final layout

---

## 🧪 Testing

### Issue #13: Add Backend Unit Tests
**Priority:** High  
**Labels:** `testing`, `backend`

**Description:**
We need unit tests for the backend services, especially the scoring logic and Gemini integration.

**Tasks:**
- [ ] Set up `pytest` and `pytest-cov`
- [ ] Create `tests/` directory structure
- [ ] Write tests for `utils/scoring.py` (100% coverage)
- [ ] Mock Gemini responses for service tests
- [ ] Add GitHub Actions CI pipeline

**Acceptance Criteria:**
- Tests pass locally with `pytest`
- Coverage is at least 70%
- CI runs tests on PRs

---

### Issue #14: Add Frontend Unit Tests
**Priority:** Medium  
**Labels:** `testing`, `frontend`

**Description:**
Add Vitest tests for critical frontend components.

**Tasks:**
- [ ] Set up Vitest with React Testing Library
- [ ] Write tests for `CredibilityGauge` component
- [ ] Write tests for `ClaimCard` component
- [ ] Test API integration logic

**Acceptance Criteria:**
- Tests pass with `npm run test`
- Coverage is at least 60%

---

### Issue #15: Add E2E Tests with Playwright
**Priority:** Low  
**Labels:** `testing`, `frontend`

**Description:**
Test critical user flows end-to-end.

**Tasks:**
- [ ] Install Playwright
- [ ] Write E2E test for text analysis flow
- [ ] Write E2E test for image upload flow
- [ ] Add to CI pipeline

**Acceptance Criteria:**
- E2E tests pass locally
- Tests run in CI before deployment

---

## 📦 Deployment

### Issue #16: Deploy Backend to Railway/Render
**Priority:** High  
**Labels:** `deployment`, `backend`

**Description:**
Deploy the backend API to a cloud platform for public access.

**Tasks:**
- [ ] Choose platform (Railway vs. Render)
- [ ] Set up environment variables in platform
- [ ] Configure CORS to allow frontend domain
- [ ] Test deployed API endpoints
- [ ] Add deployment URL to README

**Acceptance Criteria:**
- Backend is accessible at public URL
- All endpoints work correctly
- CORS allows frontend requests

---

### Issue #17: Deploy Frontend to Vercel
**Priority:** High  
**Labels:** `deployment`, `frontend`

**Description:**
Deploy the frontend to Vercel for public demo access.

**Tasks:**
- [ ] Connect GitHub repo to Vercel
- [ ] Configure `VITE_API_URL` to point to production backend
- [ ] Test deployment
- [ ] Add custom domain (optional)
- [ ] Add deployment URL to README

**Acceptance Criteria:**
- Frontend is accessible at public URL
- Can successfully call production backend
- No CORS errors

---

### Issue #18: Create Dockerfile for Backend
**Priority:** Low  
**Labels:** `deployment`, `backend`, `docker`

**Description:**
Add Docker support for easier local development and deployment.

**Tasks:**
- [ ] Create `Dockerfile` in backend/
- [ ] Create `docker-compose.yml` for full stack
- [ ] Document Docker setup in README
- [ ] Test build and run

**Acceptance Criteria:**
- `docker build` succeeds
- `docker-compose up` starts both frontend and backend
- Documentation is clear

---

## 📝 Documentation

### Issue #19: Update Main README.md
**Priority:** High  
**Labels:** `documentation`

**Description:**
The root README needs to be updated with project overview, setup instructions, and demo links.

**Tasks:**
- [ ] Add project description and features
- [ ] Add screenshots/demo GIF
- [ ] Link to backend and frontend READMEs
- [ ] Add quick start guide
- [ ] Add contribution guidelines link

**Acceptance Criteria:**
- README is comprehensive and welcoming
- New contributors can get started quickly

---

### Issue #20: Create API Documentation with OpenAPI
**Priority:** Medium  
**Labels:** `documentation`, `backend`

**Description:**
FastAPI auto-generates OpenAPI docs, but we should customize them for better presentation.

**Tasks:**
- [ ] Add detailed docstrings to all endpoints
- [ ] Add example requests/responses
- [ ] Customize Swagger UI theme
- [ ] Export OpenAPI spec to `openapi.json`

**Acceptance Criteria:**
- `/docs` endpoint shows comprehensive API documentation
- All endpoints have examples

---

### Issue #21: Add CONTRIBUTING.md Guidelines
**Priority:** Medium  
**Labels:** `documentation`

**Description:**
Update CONTRIBUTING.md with specific development workflows and code standards.

**Tasks:**
- [ ] Add code style guidelines (Black, ESLint)
- [ ] Add commit message conventions
- [ ] Add PR checklist template
- [ ] Add code review guidelines

**Acceptance Criteria:**
- Contributors know how to format code
- PRs follow a consistent format

---

## 🎬 Hackathon Submission

### Issue #22: Create Demo Video (3 minutes)
**Priority:** Critical  
**Labels:** `hackathon`, `demo`

**Description:**
Record a 3-minute video demonstrating the application for the hackathon submission.

**Tasks:**
- [ ] Write script highlighting Gemini 3 usage
- [ ] Record text analysis demo
- [ ] Record image analysis demo
- [ ] Show Google Search Grounding feature
- [ ] Emphasize social impact (fighting misinformation)
- [ ] Edit and add captions
- [ ] Upload to YouTube

**Deadline:** February 9, 2026

**Acceptance Criteria:**
- Video is under 3 minutes
- Shows all key features
- Uploaded and linked in submission

---

### Issue #23: Write Project Description (200 words)
**Priority:** Critical  
**Labels:** `hackathon`, `documentation`

**Description:**
Write the official project description for the Devpost submission.

**Tasks:**
- [ ] Explain the problem (misinformation)
- [ ] Describe the solution (Gemini 3 + Search Grounding)
- [ ] Highlight technical architecture
- [ ] Emphasize real-world impact
- [ ] Keep to 200 words

**Deadline:** February 9, 2026

**Acceptance Criteria:**
- Description is exactly 200 words
- Clearly explains Gemini 3 integration
- Compelling and professional

---

### Issue #24: Take High-Quality Screenshots
**Priority:** High  
**Labels:** `hackathon`, `documentation`

**Description:**
Capture 10-15 screenshots for the README and Devpost submission.

**Tasks:**
- [ ] Screenshot: Landing page
- [ ] Screenshot: Text input with sample content
- [ ] Screenshot: Analysis results with high score
- [ ] Screenshot: Analysis results with low score
- [ ] Screenshot: Claim cards with sources
- [ ] Screenshot: Image upload flow
- [ ] Optimize images (compressed, but high quality)

**Acceptance Criteria:**
- At least 10 screenshots
- Images are 1920x1080 or similar
- Saved in `docs/screenshots/`

---

### Issue #25: Add MIT License
**Priority:** Medium  
**Labels:** `legal`, `good-first-issue`

**Description:**
Add an open-source license to the project.

**Tasks:**
- [ ] Create `LICENSE` file with MIT license text
- [ ] Add year and copyright holder (A-Justice-League Team)
- [ ] Reference license in README

**Acceptance Criteria:**
- LICENSE file exists
- README mentions the license

---

## 🚀 Advanced Features (Post-Hackathon)

### Issue #26: Add User Authentication with JWT
**Priority:** Low  
**Labels:** `enhancement`, `backend`, `post-hackathon`

**Description:**
Allow users to create accounts and save their analysis history to the cloud.

**Tasks:**
- [ ] Add JWT authentication endpoints
- [ ] Create user database schema
- [ ] Protect history endpoints with auth
- [ ] Add login/signup UI

---

### Issue #27: Add Real-time Analysis Status with WebSockets
**Priority:** Low  
**Labels:** `enhancement`, `backend`, `frontend`, `post-hackathon`

**Description:**
Stream analysis progress to the frontend instead of blocking.

**Tasks:**
- [ ] Add WebSocket support to FastAPI
- [ ] Emit progress events (claim extraction, verification, etc.)
- [ ] Update frontend to show live progress

---

### Issue #28: Add Multi-Language Support (i18n)
**Priority:** Low  
**Labels:** `enhancement`, `frontend`, `post-hackathon`

**Description:**
Support fact-checking in multiple languages, not just English.

**Tasks:**
- [ ] Add i18next to frontend
- [ ] Update Gemini prompts for multi-language claims
- [ ] Test with Spanish, French, Arabic content

---

### Issue #29: Add Browser Extension
**Priority:** Low  
**Labels:** `enhancement`, `new-feature`, `post-hackathon`

**Description:**
Create a Chrome extension to fact-check any text on the web.

**Tasks:**
- [ ] Create extension manifest
- [ ] Add context menu "Fact-check this"
- [ ] Integrate with backend API
- [ ] Publish to Chrome Web Store

---

### Issue #30: Add Fact-Check History Dashboard with Analytics
**Priority:** Low  
**Labels:** `enhancement`, `frontend`, `post-hackathon`

**Description:**
Build a dashboard showing trends in user's fact-checking activity.

**Tasks:**
- [ ] Create dashboard page with charts
- [ ] Add filters (date range, verdict type)
- [ ] Show most-checked topics
- [ ] Add export to CSV/PDF

---

## 📊 Monitoring & Observability

### Issue #31: Add Sentry for Error Tracking
**Priority:** Medium  
**Labels:** `infrastructure`, `monitoring`

**Description:**
Integrate Sentry to track errors in production.

**Tasks:**
- [ ] Create Sentry account
- [ ] Add Sentry SDK to backend
- [ ] Add Sentry SDK to frontend
- [ ] Test error reporting

**Acceptance Criteria:**
- Errors are captured in Sentry dashboard
- Source maps work correctly

---

### Issue #32: Add Analytics with Google Analytics
**Priority:** Low  
**Labels:** `infrastructure`, `analytics`

**Description:**
Track usage metrics to understand user behavior.

**Tasks:**
- [ ] Add GA4 tracking code
- [ ] Track analysis events
- [ ] Create custom events for key actions
- [ ] Respect user privacy (GDPR)

---

## 🛠️ Developer Experience

### Issue #33: Add Pre-commit Hooks
**Priority:** Medium  
**Labels:** `infrastructure`, `dx`

**Description:**
Enforce code quality with pre-commit hooks.

**Tasks:**
- [ ] Install `pre-commit` package
- [ ] Configure Black (Python formatter)
- [ ] Configure ESLint + Prettier (JS/TS)
- [ ] Add hooks to `.pre-commit-config.yaml`

**Acceptance Criteria:**
- Code is auto-formatted before commits
- Linting errors prevent commits

---

### Issue #34: Create Development Setup Script
**Priority:** Low  
**Labels:** `infrastructure`, `dx`, `good-first-issue`

**Description:**
Add a script to automate the entire development setup.

**Tasks:**
- [ ] Create `setup.sh` for backend
- [ ] Create `setup.sh` for frontend
- [ ] Check for dependencies (Python, Node)
- [ ] Auto-create `.env` files

**Acceptance Criteria:**
- New developers can run one script to set up
- Script works on Mac, Linux, Windows (WSL)

---

## 🔒 Security

### Issue #35: Add Rate Limiting to API
**Priority:** High  
**Labels:** `security`, `backend`

**Description:**
Prevent abuse by limiting the number of requests per IP address.

**Tasks:**
- [ ] Install `slowapi` middleware
- [ ] Configure rate limits (10 requests/minute)
- [ ] Return 429 status code when exceeded
- [ ] Add rate limit info to response headers

**Acceptance Criteria:**
- Excessive requests are blocked
- Users see clear error message

---

### Issue #36: Sanitize User Input
**Priority:** High  
**Labels:** `security`, `backend`

**Description:**
Ensure user-submitted text cannot cause injection attacks or break the system.

**Tasks:**
- [ ] Add input length limits (max 10,000 characters)
- [ ] Strip potentially harmful characters
- [ ] Validate file uploads (type, size)
- [ ] Add tests for malicious inputs

**Acceptance Criteria:**
- Injection attempts are blocked
- Large payloads are rejected

---

---

**Total Issues:** 36  
**Critical:** 2 | **High:** 9 | **Medium:** 11 | **Low:** 14

**Labels Used:**
- `good-first-issue`: 3 issues
- `hackathon`: 3 issues  
- `backend`: 11 issues
- `frontend`: 11 issues
- `documentation`: 5 issues
- `testing`: 3 issues
- `deployment`: 4 issues
- `enhancement`: 14 issues
- `bug`: 1 issue
- `security`: 2 issues
