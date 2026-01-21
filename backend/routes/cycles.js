const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/cycles - Retrieve cycle history
router.get('/', async (req, res) => {
    try {
        // TODO: Filter by user_id when auth is implemented
        const result = await db.query('SELECT * FROM cycles ORDER BY start_date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/cycles - Log a new cycle
router.post('/', async (req, res) => {
    const { start_date, user_id } = req.body; // Expect user_id for now until auth

    // Basic validation
    if (!start_date) {
        return res.status(400).json({ error: 'Start date is required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO cycles (user_id, start_date) VALUES ($1, $2) RETURNING *',
            [user_id || 1, start_date] // Default to user_id 1 if not provided
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
