const express = require("express");
const router = express.Router();
const {
  createLog,
  getLogs,
} = require("../controllers/logController");

router.post("/logs", createLog);
router.get("/logs", getLogs);

module.exports = router;