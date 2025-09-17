const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { getChannel } = require("../config/rabbitmq");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role });

    // Publish event to RabbitMQ
    const channel = getChannel();
    if (channel) {
      const event = { id: user.id, email: user.email, role: user.role };
      channel.publish("userExchange", "user.created", Buffer.from(JSON.stringify(event)));
      console.log("📤 Event published: user.created", event);
    }

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token , role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};