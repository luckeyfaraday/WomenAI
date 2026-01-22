const { query } = require('../db');

// Check if user has required subscription tier
const requireTier = (minimumTier) => {
    const tierHierarchy = { free: 0, premium: 1 };

    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const userTier = req.user.subscription_tier || 'free';
            const userTierLevel = tierHierarchy[userTier] || 0;
            const requiredLevel = tierHierarchy[minimumTier] || 0;

            if (userTierLevel < requiredLevel) {
                return res.status(403).json({
                    error: 'Upgrade required',
                    message: `This feature requires ${minimumTier} tier`,
                    currentTier: userTier,
                    requiredTier: minimumTier
                });
            }

            next();
        } catch (error) {
            console.error('Subscription check error:', error);
            res.status(500).json({ error: 'Server error checking subscription' });
        }
    };
};

// Check and enforce usage limits for free tier
const checkUsageLimit = (resourceType, dailyLimit) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const userTier = req.user.subscription_tier || 'free';

            // Premium users have unlimited access
            if (userTier === 'premium') {
                return next();
            }

            // Check current usage for free tier
            const today = new Date().toISOString().split('T')[0];
            const result = await query(
                `SELECT count FROM usage_logs 
         WHERE user_id = $1 AND resource_type = $2 AND usage_date = $3`,
                [req.user.id, resourceType, today]
            );

            const currentUsage = result.rows[0]?.count || 0;

            if (currentUsage >= dailyLimit) {
                return res.status(429).json({
                    error: 'Usage limit reached',
                    message: `Free tier limited to ${dailyLimit} ${resourceType} per day`,
                    limit: dailyLimit,
                    current: currentUsage,
                    upgradeUrl: '/pricing'
                });
            }

            // Increment usage
            await query(
                `INSERT INTO usage_logs (user_id, resource_type, usage_date, count)
         VALUES ($1, $2, $3, 1)
         ON CONFLICT (user_id, resource_type, usage_date)
         DO UPDATE SET count = usage_logs.count + 1`,
                [req.user.id, resourceType, today]
            );

            next();
        } catch (error) {
            console.error('Usage limit check error:', error);
            res.status(500).json({ error: 'Server error checking usage limits' });
        }
    };
};

module.exports = {
    requireTier,
    requirePremium: () => requireTier('premium'),
    checkUsageLimit
};
