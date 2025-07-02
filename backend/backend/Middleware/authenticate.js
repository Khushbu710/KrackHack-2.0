const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing from .env");
      return res.status(500).json({ message: "Server error: JWT secret missing" });
    }

    // Check for Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token provided or incorrect format");
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    // Decode token (without verifying) to check expiration
    const decoded = jwt.decode(token);
    if (!decoded) {
      console.error("❌ Invalid JWT format");
      return res.status(401).json({ message: "Invalid token format" });
    }

    if (decoded.exp * 1000 < Date.now()) {
      console.error("❌ Token expired at:", new Date(decoded.exp * 1000));
      return res.status(401).json({ message: "Token has expired, please log in again" });
    }

    // Verify JWT Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", verified);

    req.userId = verified.id; // Attach user ID to request object
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
