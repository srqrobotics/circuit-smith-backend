require("dotenv").config();
const postgres = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");

// Create postgres connection with explicit SSL configuration
const queryClient = postgres(process.env.DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false, // For hosted databases like Neon
  },
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 60,
});

// Create drizzle ORM instance
const db = drizzle(queryClient);

// Test database connection
const testConnection = async () => {
  try {
    await queryClient`SELECT 1`;
    console.log("Successfully connected to PostgreSQL database");
    return true;
  } catch (err) {
    console.error("Database connection error:", err.message);
    return false;
  }
};

// Keep legacy interface for backward compatibility
const query = async (text, params) => {
  console.warn(
    "Legacy query interface used. Consider using Drizzle ORM directly."
  );
  const result = await queryClient.unsafe(text, params);
  return { rows: result };
};

module.exports = {
  db,
  query,
  testConnection,
  client: queryClient,
};
