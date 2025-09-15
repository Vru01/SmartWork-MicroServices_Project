// routes/reportRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getWeeklyReport } = require("../controllers/reportController");

const router = express.Router();

// GET /api/reports?week=2025-W37
router.get("/", auth([]), getWeeklyReport);


module.exports = router;