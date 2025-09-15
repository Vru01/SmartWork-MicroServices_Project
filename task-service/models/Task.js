const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  week: { type: String, required: true }, // e.g., "2025-W37"
  userId: { type: String, required: true },
  userEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
