const { db } = require("../config/db");
const { projects } = require("../db/schema");
const { eq, desc } = require("drizzle-orm");

const projectModel = {
  // Create a new project
  async create(projectData) {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  },

  // Find project by ID
  async findById(id) {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  },

  // Find projects by user ID
  async findByUserId(userid) {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userid, userid));
    return userProjects;
  },

  // Find latest project by user ID
  async findLatestByUserId(userid) {
    const [latestProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.userid, userid))
      .orderBy(desc(projects.updated_at))
      .limit(1);
    return latestProject;
  },

  // Update project
  async update(id, projectData) {
    const [project] = await db
      .update(projects)
      .set({ ...projectData, updated_at: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  },

  // Delete project
  async delete(id) {
    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return deletedProject;
  },

  // Get all projects
  async findAll() {
    const allProjects = await db.select().from(projects);
    return allProjects;
  },
};

module.exports = projectModel;
