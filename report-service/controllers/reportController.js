// controllers/reportController.js
const UserEvent = require("../models/UserEvent");
const TaskEvent = require("../models/TaskEvent");
const { getChannel } = require("../config/rabbitmq");

const initEventListeners = async (channel) => {
  if (!channel) return;

  // Ensure exchanges are present (they should be created by user/task services already)
  await channel.assertExchange("userExchange", "topic", { durable: true });
  await channel.assertExchange("taskExchange", "topic", { durable: true });

  // create durable queues and bind
  await channel.assertQueue("reportUserQueue", { durable: true });
  await channel.bindQueue("reportUserQueue", "userExchange", "user.created");

  await channel.assertQueue("reportTaskQueue", { durable: true });
  await channel.bindQueue("reportTaskQueue", "taskExchange", "task.created");

  // consume user.created events
  channel.consume("reportUserQueue", async (msg) => {
    try {
      const payload = JSON.parse(msg.content.toString());
      // Upsert user event by id (so repeated events won't duplicate)
      await UserEvent.findOneAndUpdate(
        { id: payload.id },
        { id: payload.id, name: payload.name || payload.name, email: payload.email, role: payload.role },
        { upsert: true, new: true }
      );
      channel.ack(msg);
    } catch (err) {
      console.error("Failed processing user event:", err);
      channel.nack(msg, false, false);
    }
  });

  // consume task.created events
  channel.consume("reportTaskQueue", async (msg) => {
    try {
      const payload = JSON.parse(msg.content.toString());
      // payload expected: { taskId, userId, week, title } or include description if sent
      await TaskEvent.create({
        taskId: payload.taskId,
        userId: String(payload.userId),
        title: payload.title || payload.taskTitle || "",
        description: payload.description || payload.taskDescription || "",
        week: payload.week || payload.week
      });
      channel.ack(msg);
    } catch (err) {
      console.error("Failed processing task event:", err);
      channel.nack(msg, false, false);
    }
  });

  console.log("✅ Report Service listening for user.created and task.created events");
};

const getWeeklyReport = async (req, res) => {
  try {
    const week = req.query.week;
    if (!week) return res.status(400).json({ message: "week query param required (e.g. 2025-W37)" });

    // fetch tasks for the week
    const match = { week };

    if (req.user.role === "employee") {
      // employee: only tasks with userId === req.user.id (note task.userId stored as string)
      match.userId = String(req.user.id);
    }

    const tasks = await TaskEvent.find(match).sort({ createdAt: -1 }).lean();

    // join user information
    const userIds = [...new Set(tasks.map(t => t.userId))];
    const users = await UserEvent.find({ id: { $in: userIds.map(u => Number(u)) } }).lean();

    const usersById = {};
    users.forEach(u => { usersById[String(u.id)] = u; });

    const reportItems = tasks.map(t => ({
      taskId: t.taskId,
      title: t.title,
      description: t.description,
      week: t.week,
      user: usersById[t.userId] ? { id: usersById[t.userId].id, name: usersById[t.userId].name, email: usersById[t.userId].email } : null,
      createdAt: t.createdAt
    }));

    return res.json({ week, count: reportItems.length, tasks: reportItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { initEventListeners, getWeeklyReport };