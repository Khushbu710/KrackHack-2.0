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

    // Initialize media fields
    let image = null;
    let video = null;
    let audio = null;

    // Categorize uploaded files
    req.files.forEach((file) => {
      const ext = file.originalname.split('.').pop().toLowerCase();
      const filePath = `/uploads/${file.filename}`;

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
        image = filePath;
      } else if (["mp4", "webm", "mov"].includes(ext)) {
        video = filePath;
      } else if (["mp3", "wav", "ogg", "opus"].includes(ext)) {
        audio = filePath;
      }
    });

    // Create new memory capsule
    const newMemoryHaven = new MemoryHaven({
      title,
      description,
      openDate,
      userId: req.userId,
      image,
      video,
      audio,
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
    const memoryHavens = await MemoryHaven.find({ userId: req.userId });

    if (!memoryHavens.length) {
      return res.status(404).json({ message: "No memory havens found" });
    }

    res.status(200).json(memoryHavens);
  } catch (err) {
    console.error("Fetch memory havens error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
