# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: ClaraAI
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: ClaraAI Local Development
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Add to `/home/alan/home_ai/projects/WomenAI/backend/.env`:

```bash
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
SESSION_SECRET=generate_random_string_here
```

Generate a random session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Restart Backend Server

```bash
cd /home/alan/home_ai/projects/WomenAI/backend
pkill -f "node index.js"
node index.js
```

## Step 4: Test Authentication

1. Open frontend: `http://localhost:5173`
2. Click "Sign in with Google" in navbar
3. Authorize the app
4. You should be redirected back with your profile displayed

## What's Implemented

### Backend
- ✅ Users table with Google OAuth fields
- ✅ Session table for persistent login
- ✅ Passport.js with Google OAuth strategy
- ✅ Auth routes: `/auth/google`, `/auth/google/callback`, `/auth/logout`, `/auth/user`
- ✅ Session management with PostgreSQL store

### Frontend
- ✅ LoginButton component with user profile
- ✅ Integrated in navbar
- ✅ Auto-checks authentication on load

## Next Steps

After authentication is working:
1. Update existing routes to use `req.user.id` instead of hardcoded user_id
2. Protect routes that require authentication
3. Test that user data (cycles, moods) is properly associated with logged-in users
