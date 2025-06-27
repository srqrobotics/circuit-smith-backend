const express = require("express");
const userRoutes = require("./userRoute");
const gptRoutes = require("./gptRoute");

const router = express.Router();

// Mount route modules
router.use("/users", userRoutes);
router.use("/gpt", gptRoutes);

module.exports = router;
