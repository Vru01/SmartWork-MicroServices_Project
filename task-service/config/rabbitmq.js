const amqplib = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
