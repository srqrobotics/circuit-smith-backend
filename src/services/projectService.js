const projectModel = require("../models/projectModel");

const projectService = {
  // Save or update a project
  async saveProject(userid, { code, wiring, projectId }) {
    try {
      const projectData = {
        userid,
        cppString: code,
        jsonString: wiring,
        updated_at: new Date(),
      };

      let project;

      if (projectId && projectId > 0) {
        // Update existing project
        project = await projectModel.update(projectId, projectData);
        if (!project) {
          throw new Error("Project not found");
        }
      } else {
        // Create new project
        project = await projectModel.create(projectData);
      }

      return project;
    } catch (error) {
      throw new Error(`Failed to save project: ${error.message}`);
    }
  },

  // Get project by ID
  async getProjectById(id) {
    try {
      const project = await projectModel.findById(id);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      throw new Error(`Failed to get project: ${error.message}`);
    }
  },

  // Get projects by user ID
  async getProjectsByUserId(userid) {
    try {
      const projects = await projectModel.findByUserId(userid);
      return projects;
    } catch (error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }
  },

  // Get latest project by user ID
  async getLatestProjectByUserId(userid) {
    try {
      const project = await projectModel.findLatestByUserId(userid);
      if (!project) {
        throw new Error("No projects found for this user");
      }
      return project;
    } catch (error) {
      throw new Error(`Failed to get latest project: ${error.message}`);
    }
  },

  // Delete project
  async deleteProject(id, userid) {
    try {
      // First check if project exists and belongs to user
      const project = await projectModel.findById(id);
      if (!project) {
        throw new Error("Project not found");
      }
      if (project.userid !== userid) {
        throw new Error("Unauthorized to delete this project");
      }

      const deletedProject = await projectModel.delete(id);
      return deletedProject;
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  },
};

module.exports = projectService;
