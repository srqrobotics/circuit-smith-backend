const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const userService = {
  // Register new user
  async signup(userData) {
    const { full_name, email, password } = userData;

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await userModel.create({
      full_name,
      email,
      password_hash,
    });

    // Remove password from response
    const { password_hash: _, ...userResponse } = user;
    return userResponse;
  },

  // Sign in user
  async signin(email, password) {
    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password_hash: _, ...userResponse } = user;
    return { user: userResponse, token };
  },

  // Validate token and get user
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      const { password_hash: _, ...userResponse } = user;
      return userResponse;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },
};

module.exports = userService;
