const logService = require("../services/logService");

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

module.exports = { createLog, getLogs };