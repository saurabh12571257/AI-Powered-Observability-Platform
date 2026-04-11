const esClient = require("../config/elasticsearch");
const Log = require("../models/logModel");

const normalizeText = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().toLowerCase();
};

const createLog = async (data) => {
    const normalizedData = {
      ...data,
      service: typeof data.service === "string" ? data.service.trim() : data.service,
      level: normalizeText(data.level, "info"),
      severity: normalizeText(data.severity, "medium"),
      message: typeof data.message === "string" ? data.message.trim() : data.message,
    };

    const log = await Log.create(normalizedData);

    const { _id, __v, ...rest } = log.toObject();
  
    await esClient.index({
      index: "logs",
      document: {
        ...rest,
        "@timestamp": new Date(),
      },
    });
  
    return log;
  };

  const getLogs = async (query) => {
    const must = [];
  
    // 🔹 Filtering
    if (query.level) {
      must.push({ match: { level: normalizeText(query.level) } });
    }
  
    if (query.service) {
      must.push({ match: { service: query.service } });
    }

    if (query.severity) {
      must.push({ match: { severity: normalizeText(query.severity) } });
    }
  
    // 🔍 Search
    if (query.search) {
      must.push({
        multi_match: {
          query: query.search,
          fields: ["message", "service", "level", "severity"],
        },
      });
    }
  
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 5;
  
    const from = (page - 1) * limit;
  
    const result = await esClient.search({
      index: "logs",
      from,
      size: limit,
      sort: [{ "@timestamp": "desc" }],
      query: {
        bool: {
          must,
        },
      },
    });
  
    return {
      total: result.hits.total.value,
      logs: result.hits.hits.map((hit) => hit._source),
    };
  };

  const getLogsInWindow = async ({ start, end }) => {
    const logs = await Log.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ createdAt: 1 })
      .lean();

    return logs;
  };

  const getLogStats = async () => {
    const result = await esClient.search({
      index: "logs",
      size: 0,
      aggs: {
        levels: {
          terms: {
            field: "level.keyword",
          },
        },
      },
    });
  
    const stats = {};
  
    result.aggregations.levels.buckets.forEach((bucket) => {
      stats[bucket.key] = bucket.doc_count;
    });
  
    return stats;
  };

module.exports = { createLog, getLogs, getLogsInWindow, getLogStats };
