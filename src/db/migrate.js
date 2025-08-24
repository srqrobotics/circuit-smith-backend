require("dotenv").config();
const { db } = require("../config/db");
const { sql } = require("drizzle-orm");

const runMigration = async () => {
  try {
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

    // Create projects table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        userid INTEGER NOT NULL REFERENCES users(id),
        json_string TEXT,
        cpp_string TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Migration completed successfully");
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
};

// Run migration
runMigration().catch(console.error);
