const { context, trace, SpanStatusCode } = require("@opentelemetry/api");

const TRACE_ID_PATTERN = /^[0-9a-f]{32}$/;
const SPAN_ID_PATTERN = /^[0-9a-f]{16}$/;
const TRACE_FLAGS_PATTERN = /^[0-9a-f]{2}$/;
const TRACEPARENT_PATTERN = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;

const normalizeHex = (value, pattern) => {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim().toLowerCase();
  return pattern.test(normalized) ? normalized : "";
};

const normalizeTraceFlags = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString(16).padStart(2, "0");
  }

  return normalizeHex(value, TRACE_FLAGS_PATTERN);
};

const buildTraceparent = ({ traceId, spanId, traceFlags } = {}) => {
  if (!traceId || !spanId) {
    return "";
  }

  return `00-${traceId}-${spanId}-${traceFlags || "01"}`;
};

const parseTraceparent = (value) => {
  if (typeof value !== "string") {
    return {};
  }

  const normalized = value.trim().toLowerCase();
  const match = normalized.match(TRACEPARENT_PATTERN);

  if (!match) {
    return {};
  }

  return {
    traceId: match[2],
    spanId: match[3],
    traceFlags: match[4],
    traceparent: normalized,
  };
};

const sanitizeTraceContext = (candidate = {}) => {
  const parsedTraceparent = parseTraceparent(candidate.traceparent);
  const traceId = normalizeHex(candidate.traceId, TRACE_ID_PATTERN) || parsedTraceparent.traceId || "";
  const spanId = normalizeHex(candidate.spanId, SPAN_ID_PATTERN) || parsedTraceparent.spanId || "";
  const traceFlags =
    normalizeTraceFlags(candidate.traceFlags) || parsedTraceparent.traceFlags || (traceId ? "01" : "");
  const traceparent =
    parsedTraceparent.traceparent ||
    buildTraceparent({
      traceId,
      spanId,
      traceFlags,
    });

  if (!traceId && !spanId && !traceparent) {
    return {};
  }

  return {
    ...(traceId ? { traceId } : {}),
    ...(spanId ? { spanId } : {}),
    ...(traceFlags ? { traceFlags } : {}),
    ...(traceparent ? { traceparent } : {}),
  };
};

const getTraceContext = () => {
  const activeSpan = trace.getSpan(context.active());

  if (!activeSpan) {
    return {};
  }

  const spanContext = activeSpan.spanContext();

  return sanitizeTraceContext({
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
  });
};

const resolveTraceContext = (...candidates) => {
  const merged = {};

  candidates
    .map((candidate) => sanitizeTraceContext(candidate))
    .forEach((candidate) => {
      Object.entries(candidate).forEach(([key, value]) => {
        if (!merged[key] && value) {
          merged[key] = value;
        }
      });
    });

  return merged;
};

const startActiveSpan = async (name, options, callback) => {
  const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME || "lumina-backend");

  return tracer.startActiveSpan(name, options || {}, async (span) => {
    try {
      return await callback(span);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
};

const recordException = (error, span = trace.getSpan(context.active())) => {
  if (!span || !error) {
    return;
  }

  span.recordException(error);
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
};

const attachTraceContextToRequest = (req, res, next) => {
  const traceContext = resolveTraceContext(getTraceContext(), parseTraceparent(req.headers.traceparent));

  req.traceContext = traceContext;

  if (traceContext.traceId) {
    res.setHeader("x-trace-id", traceContext.traceId);
  }

  if (traceContext.spanId) {
    res.setHeader("x-span-id", traceContext.spanId);
  }

  if (traceContext.traceparent) {
    res.setHeader("traceparent", traceContext.traceparent);
  }

  next();
};

const sendTraceError = (req, res, error, statusCode = 500) => {
  recordException(error);

  const traceContext = resolveTraceContext(req?.traceContext, getTraceContext());
  const payload = {
    error: error.message,
  };

  if (traceContext.traceId) {
    payload.traceId = traceContext.traceId;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  attachTraceContextToRequest,
  getTraceContext,
  recordException,
  resolveTraceContext,
  sendTraceError,
  startActiveSpan,
};
