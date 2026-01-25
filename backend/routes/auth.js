const express = require('express');
const router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');

// GET /auth/google - Initiate Google OAuth
router.get('/google', (req, res, next) => {
    // Capture the origin to redirect back correctly (local vs production)
    const origin = req.query.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
    req.session.returnToOrigin = origin;
    req.session.returnToPath = req.query.returnTo || '/';
    req.session.isMobile = req.query.platform === 'mobile';

    req.session.save(() => {
        next();
    });
}, require('passport').authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /auth/google/callback - Handle OAuth callback
router.get('/google/callback',
    require('passport').authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const origin = req.session.returnToOrigin || process.env.FRONTEND_URL || 'http://localhost:5173';
        const path = req.session.returnToPath || '/';
        const isMobile = req.session.isMobile;

        // Clean up session flags
        delete req.session.returnToOrigin;
        delete req.session.returnToPath;
        delete req.session.isMobile;

        // Unified Token-Based Auth Flow for Web & Mobile
        // This solves cross-site cookie partitioning issues by handing off the session creation
        // to the frontend (Site A) calling the backend (Site B) via XHR.

        const token = jwt.sign(
            { id: req.user.id },
            process.env.SESSION_SECRET,
            { expiresIn: '5m' }
        );

        if (isMobile) {
            return res.redirect(`womenai://auth/success?token=${token}`);
        }

        // For Web, redirect to frontend with token
        // Frontend will grab token and call /auth/mobile-login (exchange)
        res.redirect(`${origin}${path}?token=${token}`);
    }
);


// GET /auth/logout - Logout user
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// GET /auth/user - Get current user
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            picture: req.user.picture
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// POST /auth/mobile-login - Exchange token for session
router.post('/mobile-login', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'your-secret-key');

        // Find the user (simulate fetch or just trust query if simple)
        // Ideally we should fetch full user from DB if not implicitly trusted
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // Log the user in (Passport)
        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login failed' });

            // Save session
            req.session.save((err) => {
                if (err) return res.status(500).json({ error: 'Session save failed' });
                res.json({ success: true, user });
            });
        });

    } catch (err) {
        console.error("Mobile Login Error:", err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;
