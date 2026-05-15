const Incident = require("../models/incidentModel");
const logService = require("./logService");
const aiService = require("./aiService");
const { recordException, startActiveSpan } = require("../telemetry");

const WINDOW_BEFORE_MS = 5000;
const WINDOW_AFTER_MS = 5000;

const scheduledIncidents = new Map();

const serializeLog = (log) => ({
  logId: String(log._id || log.logId || ""),
  service: log.service,
  level: log.level,
  severity: log.severity || "medium",
  traceId: log.traceId,
  spanId: log.spanId,
  traceparent: log.traceparent,
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
      await startActiveSpan(
        "incidents.analyze_window",
        {
          attributes: {
            "app.incident.id": String(incidentId),
          },
        },
        async (span) => {
          const incident = await Incident.findById(incidentId);

          if (!incident || incident.status !== "pending") {
            span.addEvent("incident.analysis_skipped");
            return;
          }

          if (incident.triggerLog?.traceId) {
            span.setAttribute("app.trace_id", incident.triggerLog.traceId);
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
        }
      );
    } catch (error) {
      recordException(error);
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

const createIncidentWindow = async (log, io) =>
  startActiveSpan(
    "incidents.create_window",
    {
      attributes: {
        "app.incident.service": log.service || "unknown",
        "app.log.severity": log.severity || "medium",
      },
    },
    async (span) => {
      if ((log.severity || "").toLowerCase() !== "high") {
        span.addEvent("incident.skipped");
        return null;
      }

      if (log.traceId) {
        span.setAttribute("app.trace_id", log.traceId);
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
    }
  );

const getIncidents = async ({ status, limit = 10 } = {}) =>
  startActiveSpan("incidents.list", undefined, async () => {
    const query = {};

    if (status) {
      query.status = status;
    }

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 10)
      .lean();

    return incidents.map(getIncidentSummary);
  });

const resolveIncidentForService = async (service, io) => {
  try {
    return await startActiveSpan(
      "incidents.resolve_for_service",
      {
        attributes: {
          "app.incident.service": service || "unknown",
        },
      },
      async (span) => {
        const incident = await Incident.findOne({
          service,
          status: { $in: ["pending", "completed"] },
        }).sort({ createdAt: -1 });

        if (!incident) {
          return null;
        }

        if (incident.triggerLog?.traceId) {
          span.setAttribute("app.trace_id", incident.triggerLog.traceId);
        }

        incident.status = "resolved";
        incident.updatedAt = new Date();
        await incident.save();

        if (io) {
          io.emit("incident-updated", getIncidentSummary(incident));
        }

        return getIncidentSummary(incident);
      }
    );
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
