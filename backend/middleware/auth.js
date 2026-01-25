const jwt = require('jsonwebtoken');
const { query } = require('../db');

const ensureAuthenticated = async (req, res, next) => {
    // 1. Check if Passport already authenticated via Cookie
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // 2. Check for Authorization Header (Bearer Token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            // Verify Token
            const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'your-secret-key');
            
            // Find User
            const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
            
            if (result.rows.length > 0) {
                // Attach user to request manually
                req.user = result.rows[0];
                return next();
            }
        } catch (err) {
            console.warn("Token verification failed:", err.message);
            // Don't fail here, let the specific route handler decide if it needs auth
        }
    }

    // 3. Check for Guest Mode (Header)
    if (req.headers['x-guest-mode'] === 'true') {
        req.user = {
            id: -1,
            name: 'Guest',
            email: 'guest@womenai.local',
            is_guest: true,
            subscription_tier: 'free'
        };
        return next();
    }

    next();
};

module.exports = ensureAuthenticated;
