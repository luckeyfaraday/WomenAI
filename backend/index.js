require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./passport-config');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const cyclesRoutes = require('./routes/cycles');
const moodRoutes = require('./routes/mood');
const safetyRoutes = require('./routes/safety');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');

// CORS configuration - support both dev and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, '') // Handle trailing slash
].filter(Boolean);

console.log('Production mode:', isProduction);
console.log('Allowed Origins:', allowedOrigins);
console.log('Environment Check:', {
  HAS_DB: !!process.env.DATABASE_URL,
  HAS_GROQ: !!process.env.GROQ_API_KEY,
  HAS_GOOGLE_ID: !!process.env.GOOGLE_CLIENT_ID,
  HAS_GOOGLE_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    // Normalize origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.some(ao => ao.replace(/\/$/, '') === normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Trust proxy for secure cookies behind Render's proxy
if (isProduction) {
  app.set('trust proxy', 1);
}

// Stripe webhook needs raw body, must come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Debug Middleware: Log Session & Auth State
app.use((req, res, next) => {
  if (['/health', '/favicon.ico'].includes(req.path)) return next();
  console.log(`[${req.method}] ${req.path}`);
  console.log(' - Session ID:', req.sessionID);
  console.log(' - User:', req.user ? req.user.id : 'Unauthenticated');
  console.log(' - Cookies:', req.headers.cookie ? 'Present' : 'None');
  next();
});

// Session configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

app.use(session({
  store: new pgSession({
    pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Debug Middleware: Log Session & Auth State (After Session Init)
app.use((req, res, next) => {
  if (['/health', '/favicon.ico', '/api/test'].includes(req.path)) return next();
  console.log(`[${req.method}] ${req.path}`);
  console.log(' - Session ID:', req.sessionID);
  console.log(' - Session Data:', req.session ? Object.keys(req.session) : 'None');
  console.log(' - User:', req.user ? req.user.id : 'Unauthenticated');
  console.log(' - Cookies:', req.headers.cookie ? 'Present' : 'None');
  next();
});

// Health check endpoint (for UptimeRobot and Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/cycles', cyclesRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stripe', stripeRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the WomenAI backend! Communication successful.' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the WomenAI backend!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port} (${isProduction ? 'production' : 'development'})`);
});
