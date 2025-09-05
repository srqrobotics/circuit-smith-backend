const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Apply authentication middleware to all project routes
// router.use(authenticateUser);

// Save project (create or update)
router.post("/save", projectController.save);

// Get all projects for the authenticated user
router.get("/", projectController.getProjects);

// Get a specific project by ID
router.get("/:projectId", projectController.getProject);

// Delete a project
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;
