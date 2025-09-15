const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
  } catch (err) {
    console.error("❌ RabbitMQ connection failed:", err);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
