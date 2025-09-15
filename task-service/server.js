require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

(async () => {
  // Connect DB
  await connectDB();

  // Connect RabbitMQ
  await connectRabbitMQ();
  const channel = getChannel();
  if (channel) {
    await channel.assertExchange("taskExchange", "topic", { durable: true });
    console.log("✅ RabbitMQ Exchange ready: taskExchange");
  }

  // Routes
  app.use("/api/tasks", taskRoutes);

  // Start server
  app.listen(process.env.PORT || 5002, () =>
    console.log(`Task Service running on port ${process.env.PORT || 5002}`)
  );
})();
