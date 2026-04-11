const express = require("express");
const router = express.Router();
const {
    createLog,
    getLogs,
    getStats,
    analyzeLogs,
    getIncidents,
  } = require("../controllers/logController");

router.post("/logs", createLog);
router.get("/logs", getLogs);
router.get("/logs/stats", getStats);
router.get("/incidents", getIncidents);
router.get("/logs/ai-analysis", analyzeLogs);
router.post("/logs/ai-analysis", analyzeLogs);

module.exports = router;
