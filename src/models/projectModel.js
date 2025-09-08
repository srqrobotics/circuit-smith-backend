const { db } = require("../config/db");
const { projects } = require("../db/schema");
const { eq, and } = require("drizzle-orm");

const projectModel = {
  // Create a new project
  async create(projectData) {
    const [project] = await db
      .insert(projects)
      .values({
        ...projectData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return project;
  },

  // Update an existing project
  async update(id, userId, projectData) {
    const [project] = await db
      .update(projects)
      .set({
        ...projectData,
        updated_at: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
      .returning();
    return project;
  },

  // Find project by ID and user ID
  async findByIdAndUserId(id, userId) {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)));
    return project;
  },

  // Find all projects by user ID
  async findByUserId(userId) {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.user_id, userId))
      .orderBy(projects.updated_at);
    return userProjects;
  },

  // Delete project by ID and user ID
  async delete(id, userId) {
    const [deletedProject] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
      .returning();
    return deletedProject;
  },
};

module.exports = projectModel;
