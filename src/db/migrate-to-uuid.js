require("dotenv").config();
const { db } = require("../config/db");
const { sql } = require("drizzle-orm");

const migrateToUUID = async () => {
  try {
    console.log("Starting migration to UUID for projects table...");

    // Check if projects table exists and has data
    const existingProjects = await db.execute(sql`
      SELECT COUNT(*) as count FROM projects
    `);

    const projectCount = existingProjects[0]?.count || 0;
    console.log(`Found ${projectCount} existing projects`);

    if (projectCount > 0) {
      console.log("⚠️  WARNING: You have existing projects with integer IDs.");
      console.log(
        "This migration will create a new UUID-based projects table."
      );
      console.log("Existing projects will need to be manually migrated.");
      console.log("");
      console.log("To proceed safely:");
      console.log("1. Backup your existing projects data");
      console.log("2. Run this migration");
      console.log("3. Manually create new projects with UUID IDs");
      console.log("4. Update any file references from integer IDs to UUID IDs");
      console.log("");

      // For now, we'll just create the new table structure
      // without dropping the old one to preserve data
    }

    // Enable UUID extension
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create new projects table with UUID (if it doesn't exist)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS projects_new (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(255),
        wiring_config TEXT,
        arduino_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ New projects table created with UUID support");
    console.log("");
    console.log("Next steps:");
    console.log("1. Update your application to use the new table structure");
    console.log("2. Test with new projects (they will get UUID IDs)");
    console.log(
      "3. When ready, drop the old projects table and rename the new one"
    );
    console.log("4. Update any existing project file references");
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
};

// Run migration
migrateToUUID().catch(console.error);
