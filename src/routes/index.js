const express = require("express");
const userRoutes = require("./userRoute");
const gptRoutes = require("./gptRoute");
const projectRoutes = require("./projectRoute");
const fileRoutes = require("./fileRoute");

const router = express.Router();

// Mount route modules
router.use("/users", userRoutes);
router.use("/gpt", gptRoutes);
router.use("/projects", projectRoutes);
router.use("/", fileRoutes); // File routes at root level for /save-config

module.exports = router;
