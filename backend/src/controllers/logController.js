const logService = require("../services/logService");
const aiService = require("../services/aiService");
const incidentService = require("../services/incidentService");
const { sendTraceError } = require("../telemetry");

const analyzeLogs = async (req, res) => {
  try {
    const logs = req.method === "GET" ? undefined : req.body.logs;
    const insight = await aiService.analyzeLogs(logs);
    res.json({ insight });
  } catch (err) {
    return sendTraceError(req, res, err);
  }
};

const createLog = async (req, res) => {
  try {
    const log = await logService.createLog(req.body, { traceContext: req.traceContext });

    const io = req.app.get("io");
    io.emit("new-log", log);

    const incident = await incidentService.createIncidentWindow(log, io);

    if (incident) {
      io.emit("incident-updated", incident);
    } else if (log.severity === "low" || log.level === "info") {
      await incidentService.resolveIncidentForService(log.service, io);
    }

    res.status(201).json({ log, incident });
  } catch (error) {
    return sendTraceError(req, res, error);
  }
};

const getLogs = async (req, res) => {
  try {
    const result = await logService.getLogs(req.query);
    res.json(result);
  } catch (error) {
    return sendTraceError(req, res, error);
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await logService.getLogStats();
    res.json(stats);
  } catch (err) {
    return sendTraceError(req, res, err);
  }
};

const getIncidents = async (req, res) => {
  try {
    const incidents = await incidentService.getIncidents(req.query);
    res.json({ incidents });
  } catch (error) {
    return sendTraceError(req, res, error);
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;
    // Get latest logs for context
    const { logs } = await logService.getLogs({ limit: 50 });
    const reply = await aiService.chatWithLogs(messages, logs);
    res.json({ reply });
  } catch (error) {
    return sendTraceError(req, res, error);
  }
};

module.exports = { createLog, getLogs, getStats, analyzeLogs, getIncidents, chatWithAI };
