const userService = require("../services/userService");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const user = await userService.validateToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
