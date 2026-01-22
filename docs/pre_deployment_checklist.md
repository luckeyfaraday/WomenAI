# WomenAI Pre-Deployment Checklist

## ✅ Completed Items
- [x] Frontend and backend tested locally  
- [x] Groq API key obtained

## 📋 Remaining Items

### 1. Initialize Git Repository
**Status**: ❌ Not a git repo yet

**Actions Needed**:
```bash
cd c:\Users\ALAN\Desktop\home_ai\projects\WomenAI

# Initialize git
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore

# Initial commit
git add .
git commit -m "Initial commit: WomenAI MVP"

# Create GitHub repo and push
# (Will need to create repo on GitHub first)
```

---

### 2. Document Environment Variables
**Status**: ⚠️ Needs documentation

**Required Environment Variables**:

**Backend (.env)**:
```plaintext
# Database
DATABASE_URL=postgresql://user:password@host/database

# Groq AI
GROQ_API_KEY=gsk_...

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# Session
SESSION_SECRET=[random-32-char-string]

# URLs
FRONTEND_URL=https://womenai.vercel.app
PORT=10000

# Environment
NODE_ENV=production
```

**Frontend (.env.production)**:
```plaintext
VITE_API_URL=https://womenai-api.onrender.com
```

---

### 3. Database Schema Ready
**Status**: ⚠️ Need to locate/create schema file

**Check**: Do you have SQL files in `backend/scripts/`?

**If not, create** `backend/scripts/schema.sql` with your table definitions:
```sql
-- Example structure (update with your actual schema)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cycles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  tags TEXT[],
  notes TEXT,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4. OAuth Credentials (Google)
**Status**: ❌ Need to set up

**Steps**:

#### A. Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Click "Select Project" → "New Project"
3. **Project Name**: WomenAI
4. Click "Create"

#### B. Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click "Enable"

#### C. Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. **User Type**: External
3. Click "Create"
4. **App Name**: WomenAI
5. **User support email**: Your email
6. **Developer contact**: Your email
7. **Scopes**: Add email, profile
8. Click "Save and Continue"

#### D. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. **Application Type**: Web application
4. **Name**: WomenAI Web Client
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://womenai.vercel.app
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:5000/auth/google/callback
   https://womenai-api.onrender.com/auth/google/callback
   ```
7. Click **Create**
8. **Copy Client ID and Client Secret** ✅

---

## Quick Checklist Summary

- [ ] **1. Git Setup**
  - [ ] Initialize git repository
  - [ ] Create .gitignore
  - [ ] Commit code
  - [ ] Create GitHub repo
  - [ ] Push to GitHub

- [ ] **2. Environment Variables**
  - [ ] Document all required variables
  - [ ] Have values for all env vars (Groq ✅, OAuth ❌, Session Secret ❌)

- [ ] **3. Database Schema**
  - [ ] Locate or create schema.sql file
  - [ ] Verify all required tables defined

- [ ] **4. OAuth Setup**
  - [ ] Create Google Cloud project
  - [ ] Enable Google+ API
  - [ ] Configure OAuth consent screen
  - [ ] Create OAuth 2.0 credentials
  - [ ] Save Client ID and Secret

- [ ] **5. Ready to Deploy!**

---

## Next Steps After Checklist Complete

Once all items are checked:
1. Follow `deployment_guide.md` Step 1 (Neon Database)
2. Then Step 2 (Render Backend)
3. Then Step 3 (Vercel Frontend)
4. Then Step 4 (UptimeRobot)
5. Test end-to-end

**Estimated Time**: 30 minutes after checklist complete

---

## Need Help With?

Let me know which step you need help with:
1. Git setup
2. Creating schema.sql
3. Google OAuth setup
4. Generating session secret
5. Ready to deploy
