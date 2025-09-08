require("dotenv").config();
const { db } = require("../config/db");
const { sql } = require("drizzle-orm");

const runMigration = async () => {
  try {
    console.log(
      "⚠️  WARNING: This migration will DROP the existing projects table and recreate it with UUID IDs."
    );
    console.log("⚠️  All existing project data will be LOST!");
    console.log(
      "⚠️  Make sure to backup any important project data before running this migration."
    );
    console.log("");
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        google_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add google_id column if it doesn't exist (for existing tables)
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)
    `);

    // Enable UUID extension if not already enabled
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Drop existing projects table if it exists (to change from SERIAL to UUID)
    await db.execute(sql`DROP TABLE IF EXISTS projects CASCADE`);

    // Create projects table with UUID
    await db.execute(sql`
      CREATE TABLE projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(255),
        wiring_config TEXT,
        arduino_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Migration completed successfully");
    console.log("✅ Projects table now uses UUID primary keys");
    console.log("✅ New projects will automatically get UUID IDs");
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
};

// Run migration
runMigration().catch(console.error);
