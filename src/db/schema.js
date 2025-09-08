const {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  uuid,
} = require("drizzle-orm/pg-core");

// Users table schema
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  google_id: varchar("google_id", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Projects table schema
const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 255 }),
  wiring_config: text("wiring_config"), // JSON string for wiring configuration
  arduino_code: text("arduino_code"), // Arduino code string
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

module.exports = {
  users,
  projects,
};
