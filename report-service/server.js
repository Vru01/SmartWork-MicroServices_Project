// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
const reportRoutes = require("./routes/reportRoutes");
const { initEventListeners } = require("./controllers/reportController");

const app = express();
app.use(express.json());

(async () => {
  await connectDB();

  await connectRabbitMQ();
  const channel = getChannel();
  if (channel) {
    await channel.assertExchange("userExchange", "topic", { durable: true });
    await channel.assertExchange("taskExchange", "topic", { durable: true });
  }

  // start listeners that persist incoming events to MongoDB
  initEventListeners(channel);

  app.use("/api/reports", reportRoutes);

  app.listen(process.env.PORT || 5003, () => {
    console.log(`Report Service running on port ${process.env.PORT || 5003}`);
  });
})();