const esClient = require("../config/elasticsearch");
const Log = require("../models/logModel");

const createLog = async (data) => {
    const log = await Log.create(data);

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
      must.push({ match: { level: query.level } });
    }
  
    if (query.service) {
      must.push({ match: { service: query.service } });
    }
  
    // 🔍 Search
    if (query.search) {
      must.push({
        multi_match: {
          query: query.search,
          fields: ["message", "service", "level"],
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

module.exports = { createLog, getLogs, getLogStats };
