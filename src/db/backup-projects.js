require("dotenv").config();
const { db } = require("../config/db");
const { sql } = require("drizzle-orm");
const fs = require("fs");
const path = require("path");

const backupProjects = async () => {
  try {
    console.log("🔄 Starting backup of existing projects...");

    // Check if projects table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'projects'
      );
    `);

    if (!tableExists[0]?.exists) {
      console.log("ℹ️  No projects table found. Nothing to backup.");
      return;
    }

    // Get all projects
    const projects = await db.execute(sql`
      SELECT * FROM projects ORDER BY id
    `);

    if (projects.length === 0) {
      console.log("ℹ️  No projects found in database. Nothing to backup.");
      return;
    }

    console.log(`📦 Found ${projects.length} projects to backup`);

    // Create backup directory
    const backupDir = path.join(__dirname, "..", "..", "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(
      backupDir,
      `projects-backup-${timestamp}.json`
    );

    // Write backup to file
    const backupData = {
      timestamp: new Date().toISOString(),
      projectCount: projects.length,
      projects: projects,
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

    console.log(`✅ Backup completed successfully`);
    console.log(`📁 Backup saved to: ${backupFile}`);
    console.log(`📊 Backed up ${projects.length} projects`);
    console.log("");
    console.log("ℹ️  You can now run the migration script safely.");
    console.log(
      "ℹ️  To restore projects later, you'll need to manually recreate them with new UUID IDs."
    );
  } catch (err) {
    console.error("❌ Backup failed:", err);
    throw err;
  }
};

// Run backup
backupProjects().catch(console.error);
