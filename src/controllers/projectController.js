const projectModel = require("../models/projectModel");

const projectController = {
  // Save a project (create or update)
  async save(req, res) {
    try {
      const { wiring, code, projectId } = req.body;
      const userId = req.user?.id || 1; // Default to user ID 1 for testing

      // For now, we'll allow saving without authentication for development

      let project;

      // If projectId is provided and not "0", try to update existing project
      if (projectId && projectId !== "0") {
        const existingProject = await projectModel.findByIdAndUserId(
          projectId,
          userId
        );

        if (existingProject) {
          // Update existing project
          project = await projectModel.update(projectId, userId, {
            wiring_config: wiring,
            arduino_code: code,
          });
          console.log(`Updated project ${projectId} for user ${userId}`);
        } else {
          // Project not found, create new one
          project = await projectModel.create({
            user_id: userId,
            name: `Project ${new Date().toISOString().slice(0, 10)}`,
            wiring_config: wiring,
            arduino_code: code,
          });
          console.log(`Created new project for user ${userId}`);
        }
      } else {
        // Create new project
        project = await projectModel.create({
          user_id: userId,
          name: `Project ${new Date().toISOString().slice(0, 10)}`,
          wiring_config: wiring,
          arduino_code: code,
        });
        console.log(`Created new project for user ${userId}`);
      }

      res.json({
        success: true,
        projectId: project.id.toString(),
        message: "Project saved successfully",
      });
    } catch (error) {
      console.error("Error saving project:", error);
      res.status(500).json({
        error: error.message,
      });
    }
  },

  // Get all projects for a user
  async getProjects(req, res) {
    try {
      const userId = req.user?.id || 1; // Default to user ID 1 for testing

      // For now, we'll allow saving without authentication for development

      const userProjects = await projectModel.findByUserId(userId);

      res.json({
        success: true,
        projects: userProjects,
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({
        error: error.message,
      });
    }
  },

  // Get a specific project by ID
  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id || 1; // Default to user ID 1 for testing

      // For now, we'll allow saving without authentication for development

      const project = await projectModel.findByIdAndUserId(projectId, userId);

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        project: {
          id: project.id,
          name: project.name,
          jsonString: project.wiring_config,
          cppString: project.arduino_code,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
        },
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        error: error.message,
      });
    }
  },

  // Delete a project
  async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id || 1; // Default to user ID 1 for testing

      // For now, we'll allow saving without authentication for development

      const deletedProject = await projectModel.delete(projectId, userId);

      if (!deletedProject) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({
        error: error.message,
      });
    }
  },
};

module.exports = projectController;
