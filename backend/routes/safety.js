const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/safety - Retrieve safety resources
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM safety_resources');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
