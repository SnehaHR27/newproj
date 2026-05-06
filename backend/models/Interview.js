const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  feedbackSummary: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
