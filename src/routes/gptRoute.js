const express = require("express");
const router = express.Router();
const gptController = require("../controllers/gptController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Apply authentication middleware to protect the generate endpoint
router.post("/generate", authenticateUser, gptController.generate);
router.post("/generateCode", authenticateUser, gptController.generateCode);

module.exports = router;
