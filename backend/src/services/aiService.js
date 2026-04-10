const openai = require("../config/openai");
const esClient = require("../config/elasticsearch");

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

  const logText = logs
    .map((log, index) => {
      const timestamp = log.createdAt || log["@timestamp"] || "unknown-time";
      return `${index + 1}. [${timestamp}] [${log.level}] ${log.service}: ${log.message}`;
    })
    .join("\n");

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

module.exports = { analyzeLogs };
