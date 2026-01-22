require('dotenv').config();
const { query } = require('../db');

const createSubscriptionTables = async () => {
    try {
        // Add subscription_tier column to users table
        await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free';
    `);
        console.log('Added subscription_tier column to users table.');

        // Create subscriptions table
        await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        stripe_customer_id VARCHAR(255) UNIQUE,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        tier VARCHAR(20) NOT NULL DEFAULT 'free',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        current_period_end TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Subscriptions table created.');

        // Create usage tracking table for rate limiting
        await query(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resource_type VARCHAR(50) NOT NULL,
        usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
        count INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, resource_type, usage_date)
      );
    `);
        console.log('Usage logs table created.');

        // Create index for faster lookups
        await query(`
      CREATE INDEX IF NOT EXISTS idx_usage_logs_user_resource 
      ON usage_logs(user_id, resource_type, usage_date);
    `);
        console.log('Usage logs index created.');

    } catch (err) {
        console.error('Error creating subscription tables:', err);
    } finally {
        process.exit();
    }
};

createSubscriptionTables();
