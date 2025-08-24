const express = require("express");
const projectController = require("../controllers/projectController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// All project routes require authentication
router.use(authenticateUser);

// Save project (create new or update existing)
router.post("/save", projectController.saveProject);

// Get all projects for authenticated user
router.get("/", projectController.getUserProjects);

// Get specific project by ID
router.get("/:id", projectController.getProject);

// Delete project by ID
router.delete("/:id", projectController.deleteProject);

module.exports = router;
