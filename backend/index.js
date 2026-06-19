const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Security & Middleware
// ========================
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ========================
// Rate Limiting
// ========================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ========================
// MongoDB Connection
// ========================
mongoose
  .connect(process.env.MONGO_URI) // Removed deprecated options
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ========================
// Static Upload Folder
// ========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================
// Routes
// ========================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/memoryhaven", require("./routes/memoryhaven"));

// ========================
// Health Check
// ========================
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// ========================
// Global Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});