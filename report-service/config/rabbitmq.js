// config/rabbitmq.js
const amqp = require("amqplib");
require("dotenv").config();

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    console.log("✅ Connected to RabbitMQ for Report Service");
    return channel;
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err);
    process.exit(1);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
