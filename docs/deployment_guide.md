# ClaraAI Free Hosting Deployment Guide

**Goal**: Deploy ClaraAI to production for $0/month using Vercel + Render + Neon free tiers.

**Total Time**: ~30 minutes

---

## Pre-Deployment Checklist

- [ ] GitHub repo is up to date with latest code
- [ ] Environment variables documented
- [ ] Database schema ready
- [ ] Frontend and backend tested locally
- [ ] OAuth credentials ready (Google)
- [ ] Groq API key obtained

---

## Step 1: Set Up Database (Neon) - 5 minutes

### 1.1 Create Neon Account
1. Go to **https://neon.tech**
2. Sign up with GitHub
3. Verify email

### 1.2 Create Database
1. Click **"New Project"**
2. **Project Name**: `ClaraAI`
3. **Region**: Choose closest to your users (e.g., US East)
4. **PostgreSQL Version**: 16 (latest)
5. Click **"Create Project"**

### 1.3 Get Connection String
1. On project dashboard, click **"Connection Details"**
2. Copy the connection string:
   ```
   postgresql://[user]:[password]@[endpoint].neon.tech/womenai
   ```
3. Save this for later ✅

### 1.4 Run Database Schema
```bash
# Option A: Using psql
psql "postgresql://[your-connection-string]" -f backend/schema.sql

# Option B: Using Neon SQL Editor
# 1. Go to SQL Editor in Neon dashboard
# 2. Paste your CREATE TABLE statements
# 3. Click "Run"
```

**✅ Database is ready!**

---

## Step 2: Deploy Backend (Render) - 10 minutes

### 2.1 Create Render Account
1. Go to **https://render.com**
2. Sign up with GitHub
3. Grant access to your ClaraAI repository

### 2.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your **ClaraAI repository**
3. **Name**: `womenai-api`
4. **Region**: Oregon (US West) or closest to you
5. **Branch**: `main` (or your primary branch)
6. **Root Directory**: Leave blank (or `backend` if structured differently)
7. **Environment**: `Node`
8. **Build Command**: `npm install`
9. **Start Command**: `node server.js`
10. **Instance Type**: **Free** 💰

### 2.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```plaintext
DATABASE_URL = postgresql://[your-neon-connection-string]
GROQ_API_KEY = [your-groq-api-key]
GOOGLE_CLIENT_ID = [your-google-oauth-client-id]
GOOGLE_CLIENT_SECRET = [your-google-oauth-secret]
SESSION_SECRET = [generate-random-string-here]
FRONTEND_URL = https://womenai.vercel.app
PORT = 10000
NODE_ENV = production
```

**Generate SESSION_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Watch the logs for any errors
4. Your API will be at: `https://womenai.onrender.com`

### 2.5 Test Backend
```bash
curl https://womenai-api.onrender.com/health
# Should return: {"status":"ok"}
```

**✅ Backend is live!**

---

## Step 3: Deploy Frontend (Vercel) - 10 minutes

### 3.1 Prepare Frontend
```bash
cd frontend

# Create production environment file
echo "VITE_API_URL=https://womenai-api.onrender.com" > .env.production

# Test build locally
npm run build
```

### 3.2 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.3 Deploy to Vercel
```bash
# Run deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? womenai
# - Directory? ./frontend (or just ./ if already in frontend)
# - Override settings? No
```

### 3.4 Deploy to Production
```bash
vercel --prod
```

### 3.5 Add Environment Variable in Vercel Dashboard
1. Go to **https://vercel.com/dashboard**
2. Select your **womenai** project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://womenai-api.onrender.com`
   - **Environment**: Production
5. Click **Save**
6. Redeploy: `vercel --prod`

**Your app is live at**: `https://womenai.vercel.app` 🎉

**✅ Frontend is deployed!**

---

## Step 4: Keep Backend Awake (UptimeRobot) - 5 minutes

**Problem**: Render free tier sleeps after 15 minutes of inactivity.
**Solution**: Ping it every 5 minutes to keep it awake.

### 4.1 Create UptimeRobot Account
1. Go to **https://uptimerobot.com**
2. Sign up (free plan)
3. Verify email

### 4.2 Add Monitor
1. Click **"+ Add New Monitor"**
2. **Monitor Type**: HTTP(s)
3. **Friendly Name**: ClaraAI API Keep-Alive
4. **URL**: `https://womenai-api.onrender.com/health`
5. **Monitoring Interval**: 5 minutes
6. Click **"Create Monitor"**

**✅ Backend will stay awake!**

---

## Step 5: Configure OAuth Redirect URIs

### Update Google OAuth Console
1. Go to **https://console.cloud.google.com**
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your **OAuth 2.0 Client ID**
5. Under **Authorized redirect URIs**, add:
   ```
   https://womenai-api.onrender.com/auth/google/callback
   ```
6. Click **Save**

**✅ OAuth configured!**

---

## Step 6: Test End-to-End

### 6.1 Test Frontend
1. Open `https://womenai.vercel.app`
2. Should load without errors

### 6.2 Test Login
1. Click **"Login with Google"**
2. Should redirect to Google OAuth
3. After login, should redirect back to app
4. Should see dashboard

### 6.3 Test Features
- [ ] Period tracking works
- [ ] Mood logging works
- [ ] AI chat responds
- [ ] Safety resources accessible
- [ ] Data persists after logout/login

**✅ Everything works!**

---

## Deployment Complete! 🎉

Your ClaraAI app is now live at:
- **Frontend**: https://womenai.vercel.app
- **Backend API**: https://womenai.onrender.com

**Costs**: $0/month 💰

---

## Post-Deployment Tasks

### Monitoring
- [ ] Set up error tracking (Sentry free tier)
- [ ] Monitor Neon database usage
- [ ] Check Render free tier hours

### Sharing
- [ ] Share beta link with testers
- [ ] Post on Twitter
- [ ] Add to portfolio

### Optimization
- [ ] Add loading states for cold starts
- [ ] Optimize images
- [ ] Add analytics (Plausible or Simple Analytics)

---

## Troubleshooting

### Backend Returns 503 on First Request
**Cause**: Free tier spun down
**Solution**: Wait 20-30 seconds, retry
**Prevention**: UptimeRobot keeps it awake

### OAuth Redirect Fails
**Cause**: Wrong redirect URI
**Fix**: Check Google Console redirect URIs match your Render URL

### Database Connection Error
**Cause**: Wrong DATABASE_URL
**Fix**: Re-copy connection string from Neon, update Render env var

### Frontend Can't Reach Backend
**Cause**: Wrong VITE_API_URL
**Fix**: Verify it points to `https://womenai-api.onrender.com`

---

## Upgrade Path (When Ready)

### When to Upgrade:
- 100+ daily active users
- Database > 400MB
- Need faster response times
- Want custom domain

### Upgrade Options:
1. **Backend Only**: Render $7/mo (no sleep)
2. **Database Only**: Neon $19/mo (dedicated compute)
3. **All-in-One**: Railway $15-30/mo (everything)

---

## Success Metrics to Track

- Daily active users
- Database size (Neon dashboard)
- Response times (Render metrics)
- Error rate
- User feedback

**Target**: Get to 100 users, then upgrade! 🚀
