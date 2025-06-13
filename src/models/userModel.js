const { db } = require("../config/db");
const { users } = require("../db/schema");
const { eq } = require("drizzle-orm");

const userModel = {
  // Create a new user
  async create(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  // Find user by email
  async findByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  // Find user by ID
  async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  // Update user
  async update(id, userData) {
    const [user] = await db
      .update(users)
      .set({ ...userData, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },
};

module.exports = userModel;
