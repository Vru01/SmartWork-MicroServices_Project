// server.js (API Gateway)
require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const cors = require("cors");
const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));


// Logging incoming requests
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Service URLs from .env
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL;
const REPORT_SERVICE_URL = process.env.REPORT_SERVICE_URL;

// Proxy configuration
app.use(
  "/api/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.use(
  "/api/tasks",
  createProxyMiddleware({
    target: TASK_SERVICE_URL,
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.use(
  "/api/reports",
  createProxyMiddleware({
    target: REPORT_SERVICE_URL,
    changeOrigin: true,
    logLevel: "debug",
  })
);

// Health check
app.get("/health", (req, res) => res.json({ status: "API Gateway running" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
