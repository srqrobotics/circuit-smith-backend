const express = require("express");
const userController = require("../controllers/userController");
const { validateSignup, validateSignin } = require("../middleware/validation");

const router = express.Router();

// Authentication routes with validation
router.post("/signup", validateSignup, userController.signup);
router.post("/signin", validateSignin, userController.signin);
router.get("/validate", userController.validate);
router.post("/logout", userController.logout);

module.exports = router;
