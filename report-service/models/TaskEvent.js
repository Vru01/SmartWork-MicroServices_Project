// models/TaskEvent.js
const mongoose = require("mongoose");

const TaskEventSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  userId: { type: String, required: true }, // task.userId from Task Service (string)
  title: String,
  description: String,
  week: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TaskEvent", TaskEventSchema);
