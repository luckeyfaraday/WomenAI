const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/mood - Retrieve mood history
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM mood_logs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/mood - Log mood
router.post('/', async (req, res) => {
    const { mood_score, tags, notes, user_id } = req.body;

    if (!mood_score || mood_score < 1 || mood_score > 5) {
        return res.status(400).json({ error: 'Valid mood score (1-5) is required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO mood_logs (user_id, mood_score, tags, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id || 1, mood_score, tags || [], notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
