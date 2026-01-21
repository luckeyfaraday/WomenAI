require('dotenv').config();
const { query } = require('../db');

const createCyclesTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS cycles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Cycles table created successfully or already exists.');
  } catch (err) {
    console.error('Error creating cycles table:', err);
  } finally {
    // It's important to end the pool if this script is meant to be run standalone
    process.exit();
  }
};

createCyclesTable();
