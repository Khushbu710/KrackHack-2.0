console.log("Memoryhaven route file loaded");

const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authenticate");
const MemoryHaven = require("../models/MemoryHaven");
const multer = require("multer");
const path = require("path");

// ========================
// MULTER CONFIG
// ========================
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ========================
// CREATE MEMORY HAVEN
// ========================
router.post("/", authenticate, upload.any(), async (req, res) => {
  const { title, description, openDate } = req.body;

  try {
    if (new Date(openDate) <= new Date()) {
      return res.status(400).json({ message: "openDate must be a future date" });
    }

    const mediaPaths = req.files.map(file =>
      `/uploads/${path.basename(file.path)}`
    );

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
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET USER CAPSULES
// ========================
router.get("/", authenticate, async (req, res) => {
  try {
    const memoryHavens = await MemoryHaven.find({ userId: req.userId });

    res.status(200).json(memoryHavens);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;