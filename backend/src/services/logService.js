const esClient = require("../config/elasticsearch");
const Log = require("../models/logModel");
const { resolveTraceContext, startActiveSpan } = require("../telemetry");

const normalizeText = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().toLowerCase();
};

const normalizeTraceFilter = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
};

const createLog = async (data, { traceContext } = {}) =>
  startActiveSpan(
    "logs.create",
    {
      attributes: {
        "app.log.service": typeof data?.service === "string" ? data.service.trim() : "unknown",
        "app.log.level": normalizeText(data?.level, "info"),
        "app.log.severity": normalizeText(data?.severity, "medium"),
      },
    },
    async (span) => {
      const correlatedTraceContext = resolveTraceContext(data, traceContext);
      const normalizedData = {
        ...data,
        ...(correlatedTraceContext.traceId ? { traceId: correlatedTraceContext.traceId } : {}),
        ...(correlatedTraceContext.spanId ? { spanId: correlatedTraceContext.spanId } : {}),
        ...(correlatedTraceContext.traceFlags ? { traceFlags: correlatedTraceContext.traceFlags } : {}),
        ...(correlatedTraceContext.traceparent
          ? { traceparent: correlatedTraceContext.traceparent }
          : {}),
        service: typeof data.service === "string" ? data.service.trim() : data.service,
        level: normalizeText(data.level, "info"),
        severity: normalizeText(data.severity, "medium"),
        message: typeof data.message === "string" ? data.message.trim() : data.message,
      };

      const log = await Log.create(normalizedData);
      const { _id, __v, ...rest } = log.toObject();

      span.setAttribute("app.log.id", String(log._id));

      if (log.traceId) {
        span.setAttribute("app.trace_id", log.traceId);
      }

      if (log.spanId) {
        span.setAttribute("app.span_id", log.spanId);
      }

      try {
        await esClient.index({
          index: "logs",
          document: {
            ...rest,
            "@timestamp": new Date(),
          },
        });

        span.addEvent("elasticsearch.indexed_log", {
          "app.log.id": String(log._id),
        });
      } catch (error) {
        span.addEvent("elasticsearch.log_index_failed", {
          "error.message": error.message,
        });
        console.error("Elasticsearch indexing failed, falling back to MongoDB only:", error.message);
      }

      return log;
    }
  );

const getLogs = async (query) =>
  startActiveSpan(
    "logs.search",
    {
      attributes: {
        "app.log.page": parseInt(query.page) || 1,
        "app.log.limit": parseInt(query.limit) || 5,
      },
    },
    async (span) => {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 5;
      const skip = (page - 1) * limit;
      const normalizedTraceId = normalizeTraceFilter(query.traceId);
      const normalizedSpanId = normalizeTraceFilter(query.spanId);

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

        if (normalizedTraceId) {
          must.push({ term: { "traceId.keyword": normalizedTraceId } });
          span.setAttribute("app.trace_id", normalizedTraceId);
        }

        if (normalizedSpanId) {
          must.push({ term: { "spanId.keyword": normalizedSpanId } });
          span.setAttribute("app.span_id", normalizedSpanId);
        }

        if (query.search) {
          must.push({
            multi_match: {
              query: query.search,
              fields: ["message", "service", "level", "severity", "traceId", "spanId"],
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
          logs: result.hits.hits.map((hit) => ({
            _id: hit._source._id || hit._id,
            ...hit._source,
          })),
        };
      } catch (error) {
        span.addEvent("elasticsearch.search_fallback", {
          "error.message": error.message,
        });
        console.warn("Elasticsearch search failed, falling back to MongoDB:", error.message);

        const mongoQuery = {};
        if (query.level) mongoQuery.level = normalizeText(query.level);
        if (query.service) mongoQuery.service = query.service;
        if (query.severity) mongoQuery.severity = normalizeText(query.severity);
        if (normalizedTraceId) mongoQuery.traceId = normalizedTraceId;
        if (normalizedSpanId) mongoQuery.spanId = normalizedSpanId;
        if (query.search) {
          mongoQuery.$or = [
            { message: { $regex: query.search, $options: "i" } },
            { service: { $regex: query.search, $options: "i" } },
            { traceId: { $regex: query.search, $options: "i" } },
            { spanId: { $regex: query.search, $options: "i" } },
          ];
        }

        const [total, logs] = await Promise.all([
          Log.countDocuments(mongoQuery),
          Log.find(mongoQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        ]);

        return { total, logs };
      }
    }
  );

const getLogsInWindow = async ({ start, end }) =>
  startActiveSpan("logs.window_lookup", undefined, async () => {
    const logs = await Log.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ createdAt: 1 })
      .lean();

    return logs;
  });

const getLogStats = async () =>
  startActiveSpan("logs.stats", undefined, async (span) => {
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
      span.addEvent("elasticsearch.stats_fallback", {
        "error.message": error.message,
      });
      console.warn("Elasticsearch stats aggregation failed:", error.message);
      const agg = await Log.aggregate([{ $group: { _id: "$level", count: { $sum: 1 } } }]);

      const stats = {};
      agg.forEach((item) => {
        stats[item._id] = item.count;
      });

      return stats;
    }
  });

module.exports = { createLog, getLogs, getLogsInWindow, getLogStats };
