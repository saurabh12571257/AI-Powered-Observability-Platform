const logService = require("../services/logService");
const aiService = require("../services/aiService");

const analyzeLogs = async (req, res) => {
    try {
      const insight = await aiService.analyzeLogs();
      res.json({ insight });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const createLog = async (req, res) => {
  try {
    const log = await logService.createLog(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLogs = async (req, res) => {
    try {
      const result = await logService.getLogs(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getStats = async (req, res) => {
    try {
      const stats = await logService.getLogStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

module.exports = { createLog, getLogs, getStats, analyzeLogs };