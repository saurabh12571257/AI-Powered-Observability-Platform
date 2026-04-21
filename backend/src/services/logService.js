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

  try {
    await esClient.index({
      index: "logs",
      document: {
        ...rest,
        "@timestamp": new Date(),
      },
    });
  } catch (error) {
    console.error("Elasticsearch indexing failed, falling back to MongoDB only:", error.message);
  }

  return log;
};

const getLogs = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const must = [];

    if (query.level) {
      must.push({ match: { level: normalizeText(query.level) } });
    }

    if (query.service) {
      must.push({ match: { service: query.service } });
    }

    if (query.severity) {
      must.push({ match: { severity: normalizeText(query.severity) } });
    }

    if (query.search) {
      must.push({
        multi_match: {
          query: query.search,
          fields: ["message", "service", "level", "severity"],
        },
      });
    }

    const result = await esClient.search({
      index: "logs",
      from: skip,
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
  } catch (error) {
    console.warn("Elasticsearch search failed, falling back to MongoDB:", error.message);

    const mongoQuery = {};
    if (query.level) mongoQuery.level = normalizeText(query.level);
    if (query.service) mongoQuery.service = query.service;
    if (query.severity) mongoQuery.severity = normalizeText(query.severity);
    if (query.search) {
      mongoQuery.$or = [
        { message: { $regex: query.search, $options: "i" } },
        { service: { $regex: query.search, $options: "i" } },
      ];
    }

    const [total, logs] = await Promise.all([
      Log.countDocuments(mongoQuery),
      Log.find(mongoQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return { total, logs };
  }
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
  try {
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
  } catch (error) {
    console.warn("Elasticsearch stats aggregation failed:", error.message);
    const agg = await Log.aggregate([{ $group: { _id: "$level", count: { $sum: 1 } } }]);

    const stats = {};
    agg.forEach((item) => {
      stats[item._id] = item.count;
    });

    return stats;
  }
};

module.exports = { createLog, getLogs, getLogsInWindow, getLogStats };
