const express = require("express");
const passport = require("../config/passport");
const userController = require("../controllers/userController");
const { validateSignup, validateSignin } = require("../middleware/validation");

const router = express.Router();

// Authentication routes with validation
router.post("/signup", validateSignup, userController.signup);
router.post("/signin", validateSignin, userController.signin);
router.get("/validate", userController.validate);
router.post("/logout", userController.logout);

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  userController.googleCallback
);

router.get("/auth/failure", userController.googleFailure);

module.exports = router;
