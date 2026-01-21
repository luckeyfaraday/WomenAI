# WomenAI - How to Access

## Two Separate Pages

### 1. Landing Page (Marketing Site)
**Location:** `/home/alan/home_ai/projects/WomenAI/landing/index.html`

**How to view:**
- Open directly in browser: `file:///home/alan/home_ai/projects/WomenAI/landing/index.html`
- Or serve locally:
  ```bash
  cd /home/alan/home_ai/projects/WomenAI/landing
  python3 -m http.server 8000
  # Visit http://localhost:8000
  ```

**Purpose:** Public-facing marketing page with pricing, features, CTAs

---

### 2. React App (Main Application)
**Location:** `/home/alan/home_ai/projects/WomenAI/frontend/`

**How to view:**
```bash
cd /home/alan/home_ai/projects/WomenAI/frontend
npm run dev
# Visit http://localhost:5173
```

**Purpose:** The actual WomenAI application with cycle tracking, mood logging, AI chat, etc.

**⚠️ IMPORTANT:** Do NOT open `frontend/index.html` directly in browser. It will cause CORS errors. Always use the dev server.

---

## Current Status

**Backend:** Running on `http://localhost:3000`
**Frontend:** Should run on `http://localhost:5173` (via `npm run dev`)
**Landing:** Can open directly or serve on any port

## Quick Start

```bash
# Terminal 1: Backend
cd /home/alan/home_ai/projects/WomenAI/backend
node index.js

# Terminal 2: Frontend
cd /home/alan/home_ai/projects/WomenAI/frontend
npm run dev

# Then visit: http://localhost:5173
```
