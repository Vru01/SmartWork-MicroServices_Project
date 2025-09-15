// models/UserEvent.js
const mongoose = require("mongoose");

const UserEventSchema = new mongoose.Schema({
  id: { type: Number, required: true },     // user id from User Service (integer)
  name: String,
  email: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserEvent", UserEventSchema);
