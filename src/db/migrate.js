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
