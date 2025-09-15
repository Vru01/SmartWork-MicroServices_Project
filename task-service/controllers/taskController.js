const Task = require("../models/Task");
const { getChannel } = require("../config/rabbitmq");

// Create task (any logged-in user)
exports.createTask = async (req, res) => {
  try {
    const { title, description, week } = req.body;
    const { id, role, email } = req.user;

    const task = await Task.create({
      title,
      description,
      week,
      userId: id,
      userEmail: email,
    });

    // Publish event to RabbitMQ
    const channel = getChannel();
    if (channel) {
      const event = { taskId: task._id, userId: id, week, title };
      channel.publish("taskExchange", "task.created", Buffer.from(JSON.stringify(event)));
      console.log("📤 Event published: task.created", event);
    }

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks
exports.getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { week } = req.query; // optional filter

    let filter = {};
    if (week) filter.week = week;

    if (role !== "manager") {
      filter.userId = id; // regular employee sees only their tasks
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Allow employee to update only their own task
    if (req.user.role === "employee" && task.userId !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Managers can update any task
    if (req.user.role === "manager" || task.userId === req.user.id.toString()) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      await task.save();
      return res.json({ message: "Task updated", task });
    }

    res.status(403).json({ message: "Access denied" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Employee can only delete their own task
    if (req.user.role === "employee" && task.userId !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Managers can delete any task
    if (req.user.role === "manager" || task.userId === req.user.id.toString()) {
      await task.deleteOne();
      return res.json({ message: "Task deleted" });
    }

    res.status(403).json({ message: "Access denied" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};