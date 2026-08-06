const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    console.log("==================================");
    console.log("Authorization Header:", authHeader);

    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Bearer token missing",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    console.log("Token:", token);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("========== JWT ERROR ==========");
    console.log(error.name);
    console.log(error.message);
    console.log(error);
    console.log("===============================");

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;