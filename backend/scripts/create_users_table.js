require('dotenv').config();
const { query } = require('../db');

const createUsersTable = async () => {
    try {
        // Create users table
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('users table created.');

        // Create session table for connect-pg-simple
        await query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (sid)
      );
    `);
        console.log('session table created.');

        // Add index on expire column for session cleanup
        await query(`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
    `);
        console.log('session index created.');

    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        process.exit();
    }
};

createUsersTable();
