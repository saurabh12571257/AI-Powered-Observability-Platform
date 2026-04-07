const express = require("express");
const router = express.Router();
const {
  createLog,
  getLogs,
  getStats,
} = require("../controllers/logController");

router.post("/logs", createLog);
router.get("/logs", getLogs);
router.get("/stats", getStats);
router.get("/ai-analysis", analyzeLogs);

module.exports = router;