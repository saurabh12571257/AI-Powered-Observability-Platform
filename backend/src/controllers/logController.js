const logService = require("../services/logService");
const aiService = require("../services/aiService");
const incidentService = require("../services/incidentService");

const analyzeLogs = async (req, res) => {
    try {
      const logs = req.method === "GET" ? undefined : req.body.logs;
      const insight = await aiService.analyzeLogs(logs);
      res.json({ insight });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const createLog = async (req, res) => {
    try {
      const log = await logService.createLog(req.body);
  
      const io = req.app.get("io");
      io.emit("new-log", log);

      const incident = await incidentService.createIncidentWindow(log, io);

      if (incident) {
        io.emit("incident-updated", incident);
      }
  
      res.status(201).json({ log, incident });
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

const getIncidents = async (req, res) => {
    try {
      const incidents = await incidentService.getIncidents(req.query);
      res.json({ incidents });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = { createLog, getLogs, getStats, analyzeLogs, getIncidents };
