const {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
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
  id: serial("id").primaryKey(),
  userid: integer("userid")
    .notNull()
    .references(() => users.id),
  jsonString: text("json_string"),
  cppString: text("cpp_string"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

module.exports = {
  users,
  projects,
};
