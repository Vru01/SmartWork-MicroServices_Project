const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const { connectRabbitMQ, getChannel } = require("./config/rabbitmq");
require("dotenv").config();

const app = express();
app.use(express.json());

(async () => {
  // Connect to RabbitMQ
  await connectRabbitMQ();
  const channel = getChannel();
  if (channel) {
    await channel.assertExchange("userExchange", "topic", { durable: true });
    console.log("✅ RabbitMQ Exchange ready: userExchange");
  }

  // Sync DB
  await sequelize.sync({ alter: true });
  console.log("✅ Database synced");

  // Routes
  app.use("/api/users", userRoutes);

  app.listen(process.env.PORT || 5001, () => {
    console.log(`User Service running on port ${process.env.PORT || 5001}`);
  });
})();
