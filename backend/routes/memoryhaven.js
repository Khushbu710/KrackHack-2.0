const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authenticate");
const MemoryHaven = require("../models/MemoryHaven");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create a new memory haven with file uploads
router.post("/", authenticate, upload.any(), async (req, res) => {
  const { title, description, openDate } = req.body;

  try {
    if (new Date(openDate) <= new Date()) {
      return res.status(400).json({ message: "openDate must be a future date" });
    }

    // Store file paths
    // const mediaPaths = req.files.map((file) => file.path);
    // const mediaPaths = req.files.map((file) => `/uploads/${file.filename}`);
    const mediaPaths = req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);



    // Create a new memory haven
    const newMemoryHaven = new MemoryHaven({
      title,
      description,
      openDate,
      userId: req.userId,
      media: mediaPaths,
    });

    await newMemoryHaven.save();
    res.status(201).json(newMemoryHaven);
  } catch (err) {
    console.error("Create memory haven error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Fetch all memory havens for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const currentDate = new Date();

    // Only fetch memory havens where openDate is in the past or today
    const memoryHavens = await MemoryHaven.find({
      userId: req.userId,
      openDate: { $lte: currentDate }, // Only show unlocked capsules
    });
    if (!memoryHavens.length) {
      return res.status(404).json({ message: "No memory havens found" });
    }

    res.status(200).json(memoryHavens);
  } catch (err) {
    console.error("Fetch memory havens error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Ensure uploaded files are accessible
// router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;

