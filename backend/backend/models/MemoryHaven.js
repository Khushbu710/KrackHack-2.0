const mongoose = require('mongoose');

const memoryHavenSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"], 
    trim: true 
  },
  openDate: { 
    type: Date, 
    required: [true, "Open date is required"],
    validate: {
      validator: function (value) {
        return value > new Date(); // Must be a future date
      },
      message: "Open date must be in the future",
    },
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" 
  },
  status: {
    type: String,
    enum: ['active', 'opened'],
    default: 'active',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  image: { 
    type: String, 
    default: null 
  }, // Stores image file path or URL
  video: { 
    type: String, 
    default: null 
  }, // Stores video file path or URL
  audio: { 
    type: String, 
    default: null 
  }, // Stores audio file path or URL
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Middleware to update `updatedAt` on every save
memoryHavenSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MemoryHaven', memoryHavenSchema);
