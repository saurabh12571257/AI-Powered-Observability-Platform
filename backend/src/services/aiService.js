const openai = require("../config/openai");
const esClient = require("../config/elasticsearch");

const analyzeLogs = async () => {

  const result = await esClient.search({
    index: "logs",
    size: 10,
    sort: [{ "@timestamp": "desc" }],
  });

  const logs = result.hits.hits.map(hit => hit._source);

  const logText = logs
    .map(l => `[${l.level}] ${l.service}: ${l.message}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an observability AI. Analyze logs and give short insights.",
      },
      {
        role: "user",
        content: `Analyze these logs and summarize issues:\n${logText}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { analyzeLogs };