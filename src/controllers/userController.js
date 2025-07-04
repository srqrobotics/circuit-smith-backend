const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const userController = {
  // Signup endpoint
  async signup(req, res) {
    try {
      const { fullName, email, password } = req.body;

      const user = await userService.signup({ fullName, email, password });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  // Signin endpoint
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const { user, token } = await userService.signin(email, password);

      // Set httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        message: "Signed in successfully",
        user,
      });
    } catch (error) {
      res.status(401).json({
        error: error.message,
      });
    }
  },

  // Validate token endpoint
  async validate(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          error: "No token provided",
        });
      }

      const user = await userService.validateToken(token);

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(401).json({
        error: error.message,
      });
    }
  },

  // Logout endpoint
  async logout(req, res) {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  },

  // Google OAuth success callback
  async googleCallback(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Google authentication failed",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Remove password from response
      const { password_hash: _, ...userResponse } = req.user;

      // Redirect to frontend with success
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}/auth/google/callback`);
    } catch (error) {
      res.status(500).json({
        error: "Authentication error",
      });
    }
  },

  // Google OAuth failure callback
  async googleFailure(req, res) {
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendURL}/auth/failure`);
  },
};

module.exports = userController;
