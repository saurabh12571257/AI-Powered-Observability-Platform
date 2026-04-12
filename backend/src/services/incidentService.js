const Incident = require("../models/incidentModel");
const logService = require("./logService");
const aiService = require("./aiService");

const WINDOW_BEFORE_MS = 5000;
const WINDOW_AFTER_MS = 5000;

const scheduledIncidents = new Map();

const serializeLog = (log) => ({
  logId: String(log._id || log.logId || ""),
  service: log.service,
  level: log.level,
  severity: log.severity || "medium",
  message: log.message,
  createdAt: log.createdAt || log["@timestamp"] || new Date(),
});

const getIncidentSummary = (incident) => ({
  _id: incident._id,
  triggerLogId: incident.triggerLogId,
  triggerLog: incident.triggerLog,
  status: incident.status,
  service: incident.service,
  severity: incident.severity,
  windowStart: incident.windowStart,
  windowEnd: incident.windowEnd,
  analysis: incident.analysis,
  error: incident.error,
  logCount: incident.logCount,
  analyzedAt: incident.analyzedAt,
  createdAt: incident.createdAt,
  updatedAt: incident.updatedAt,
});

const scheduleIncidentAnalysis = (incidentId, io) => {
  const existingTimer = scheduledIncidents.get(String(incidentId));

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(async () => {
    try {
      const incident = await Incident.findById(incidentId);

      if (!incident || incident.status !== "pending") {
        return;
      }

      const logs = await logService.getLogsInWindow({
        start: incident.windowStart,
        end: incident.windowEnd,
      });
      const contextLogs = logs.map(serializeLog);
      const analysis = await aiService.analyzeIncidentWindow({
        logs: contextLogs,
        triggerLog: incident.triggerLog,
        windowStart: incident.windowStart,
        windowEnd: incident.windowEnd,
      });

      incident.contextLogs = contextLogs;
      incident.logCount = contextLogs.length;
      incident.analysis = analysis;
      incident.status = "completed";
      incident.analyzedAt = new Date();
      incident.error = "";

      await incident.save();

      if (io) {
        io.emit("incident-updated", getIncidentSummary(incident));
      }
    } catch (error) {
      const incident = await Incident.findById(incidentId);

      if (incident) {
        incident.status = "failed";
        incident.error = error.message;
        incident.analyzedAt = new Date();
        await incident.save();

        if (io) {
          io.emit("incident-updated", getIncidentSummary(incident));
        }
      }
    } finally {
      scheduledIncidents.delete(String(incidentId));
    }
  }, WINDOW_AFTER_MS);

  scheduledIncidents.set(String(incidentId), timer);
};

const createIncidentWindow = async (log, io) => {
  if ((log.severity || "").toLowerCase() !== "high") {
    return null;
  }

  const triggerTime = new Date(log.createdAt || Date.now());
  const incident = await Incident.create({
    triggerLogId: log._id,
    triggerLog: serializeLog(log),
    service: log.service,
    severity: log.severity,
    windowStart: new Date(triggerTime.getTime() - WINDOW_BEFORE_MS),
    windowEnd: new Date(triggerTime.getTime() + WINDOW_AFTER_MS),
  });

  scheduleIncidentAnalysis(incident._id, io);

  return getIncidentSummary(incident);
};

const getIncidents = async ({ status, limit = 10 } = {}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  const incidents = await Incident.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 10)
    .lean();

  return incidents.map(getIncidentSummary);
};

const resolveIncidentForService = async (service, io) => {
  try {
    const incident = await Incident.findOne({
      service,
      status: { $in: ["pending", "completed"] },
    }).sort({ createdAt: -1 });

    if (!incident) {
      return null;
    }

    incident.status = "resolved";
    incident.updatedAt = new Date();
    await incident.save();

    if (io) {
      io.emit("incident-updated", getIncidentSummary(incident));
    }

    return getIncidentSummary(incident);
  } catch (error) {
    console.error("Failed to resolve incident:", error);
    return null;
  }
};

module.exports = {
  createIncidentWindow,
  getIncidents,
  resolveIncidentForService,
};

