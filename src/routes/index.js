const express = require("express");
const userRoutes = require("./userRoute");

const router = express.Router();

// Mount route modules
router.use("/users", userRoutes);

module.exports = router;
