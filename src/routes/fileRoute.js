const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

// Save configuration files
router.post("/save-config", fileController.saveConfig);

// Get file content
router.get("/file-content", fileController.getFileContent);

module.exports = router;
