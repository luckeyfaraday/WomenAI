require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./passport-config');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const cyclesRoutes = require('./routes/cycles');
const moodRoutes = require('./routes/mood');
const safetyRoutes = require('./routes/safety');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Stripe webhook needs raw body, must come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Session configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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
    secure: false // Set to true in production with HTTPS
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

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
  console.log(`Server listening on port ${port}`);
});
