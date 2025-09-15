const { Sequelize } = require("sequelize");
const path = require("path");

// SQLite database file will be in the root folder as user.db
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../user.db"), // file path
  logging: false, // optional: logs SQL queries
});

sequelize.authenticate()
  .then(() => console.log("✅ SQLite Database connected"))
  .catch(err => console.error("❌ SQLite connection error:", err));

module.exports = sequelize;
