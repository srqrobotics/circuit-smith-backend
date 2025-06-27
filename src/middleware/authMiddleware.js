const jwt = require("jsonwebtoken");

// Auth middleware
const authenticateUser = (req, res, next) => {
  try {
    let token;

    // First check for token in cookies (HttpOnly cookie approach)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Authorization header if no cookie is found
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user data to request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Authentication error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  authenticateUser,
};
