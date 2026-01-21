require('dotenv').config();
const { query } = require('../db');

const createTables = async () => {
    try {
        // Create mood_logs table
        await query(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
        tags TEXT[],
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('mood_logs table created.');

        // Create safety_resources table
        await query(`
      CREATE TABLE IF NOT EXISTS safety_resources (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        website TEXT,
        category TEXT,
        country_code VARCHAR(2) DEFAULT 'US'
      );
    `);
        console.log('safety_resources table created.');

        // Seed safety_resources
        // Check if empty first to avoid duplicates on re-run
        const res = await query('SELECT COUNT(*) FROM safety_resources');
        if (parseInt(res.rows[0].count) === 0) {
            await query(`
        INSERT INTO safety_resources (name, phone, website, category, country_code)
        VALUES 
        ('National Domestic Violence Hotline', '1-800-799-7233', 'https://www.thehotline.org/', 'Domestic Violence', 'US'),
        ('RAINN (National Sexual Assault Hotline)', '1-800-656-4673', 'https://www.rainn.org/', 'Sexual Assault', 'US'),
        ('Crisis Text Line', 'Text HOME to 741741', 'https://www.crisistextline.org/', 'Crisis Support', 'US')
      `);
            console.log('safety_resources seeded.');
        } else {
            console.log('safety_resources already has data, skipping seed.');
        }

    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        process.exit();
    }
};

createTables();
