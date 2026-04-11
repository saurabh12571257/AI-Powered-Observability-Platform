const openai = require("../config/openai");
const esClient = require("../config/elasticsearch");

const formatLogs = (logs) =>
  logs
    .map((log, index) => {
      const timestamp = log.createdAt || log["@timestamp"] || "unknown-time";
      const severity = log.severity ? ` severity=${log.severity}` : "";

      return `${index + 1}. [${timestamp}] [${log.level}]${severity} ${log.service}: ${log.message}`;
    })
    .join("\n");

const getRecentLogs = async () => {
  const result = await esClient.search({
    index: "logs",
    size: 10,
    sort: [{ "@timestamp": "desc" }],
  });

  return result.hits.hits.map((hit) => hit._source);
};

const analyzeLogs = async (inputLogs) => {
  const logs = Array.isArray(inputLogs) && inputLogs.length > 0 ? inputLogs : await getRecentLogs();
  const logText = formatLogs(logs);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an observability AI. Analyze log bursts, explain likely root causes, user impact, and give concise next debugging steps.",
      },
      {
        role: "user",
        content: `Analyze these logs and summarize the issue:\n${logText}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

const analyzeIncidentWindow = async ({ logs, triggerLog, windowStart, windowEnd }) => {
  const logText = formatLogs(logs);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an observability AI. You are given a high-severity trigger log and the surrounding logs from a 10-second incident window. Explain the likely root cause, impacted services, timeline clues, and the next debugging steps. Be concrete and concise.",
      },
      {
        role: "user",
        content: [
          `Trigger log: [${triggerLog.createdAt || "unknown-time"}] [${triggerLog.level}] severity=${triggerLog.severity || "unknown"} ${triggerLog.service}: ${triggerLog.message}`,
          `Window start: ${windowStart.toISOString()}`,
          `Window end: ${windowEnd.toISOString()}`,
          "",
          "Incident window logs:",
          logText || "No logs found in the incident window.",
        ].join("\n"),
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { analyzeLogs, analyzeIncidentWindow };
