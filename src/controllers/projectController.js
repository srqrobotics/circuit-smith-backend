const projectService = require("../services/projectService");

const projectController = {
  // Save project endpoint
  async saveProject(req, res) {
    try {
      const { code, wiring, projectId } = req.body;

      const userid = req.user.userId; // Get user ID from decoded JWT token

      // Validate required fields
      if (!code && !wiring) {
        return res.status(400).json({
          success: false,
          error: "At least one of 'code' or 'wiring' is required",
        });
      }

      const project = await projectService.saveProject(userid, {
        code,
        wiring,
        projectId,
      });

      res.status(200).json({
        success: true,
        message: projectId
          ? "Project updated successfully"
          : "Project created successfully",
        projectId: project.id,
        project,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get project by ID
  async getProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(parseInt(id));

      // Check if user owns the project
      if (project.userid !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized to access this project",
        });
      }

      res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get all projects for the authenticated user
  async getUserProjects(req, res) {
    try {
      const userid = req.user.userId;
      const projects = await projectService.getProjectsByUserId(userid);

      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get latest project for the authenticated user
  async getLatestProject(req, res) {
    try {
      const userid = req.user.userId;
      const project = await projectService.getLatestProjectByUserId(userid);

      res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Delete project
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const userid = req.user.userId;

      const deletedProject = await projectService.deleteProject(
        parseInt(id),
        userid
      );

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        project: deletedProject,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = projectController;
