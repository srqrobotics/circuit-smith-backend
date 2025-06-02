const express = require("express");
const componentRoutes = require("./componentRoutes");

const router = express.Router();

router.use("/components", componentRoutes);

module.exports = router;
