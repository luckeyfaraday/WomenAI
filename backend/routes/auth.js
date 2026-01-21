const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /auth/google - Initiate Google OAuth
router.get('/google', (req, res, next) => {
    req.session.returnTo = req.query.returnTo || '/';
    next();
}, require('passport').authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /auth/google/callback - Handle OAuth callback
router.get('/google/callback',
    require('passport').authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(`http://localhost:5173${returnTo}`);
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

module.exports = router;
