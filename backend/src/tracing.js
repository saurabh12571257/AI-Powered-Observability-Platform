const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");

const serviceName = process.env.OTEL_SERVICE_NAME || "lumina-backend";
const traceEndpoint =
  process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "";
const traceExporter = traceEndpoint ? new OTLPTraceExporter() : new ConsoleSpanExporter();
const exporterLabel = traceEndpoint ? `OTLP (${traceEndpoint})` : "console";

process.env.OTEL_SERVICE_NAME = serviceName;

if (process.env.OTEL_LOG_LEVEL === "debug") {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      },
    }),
  ],
});

sdk.start();
console.log(`[Tracing] OpenTelemetry initialized for ${serviceName} using ${exporterLabel}`);

let shuttingDown = false;

const shutdown = (signal) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  sdk
    .shutdown()
    .catch((error) => {
      console.error(`[Tracing] OpenTelemetry shutdown failed after ${signal}:`, error.message);
    })
    .finally(() => {
      process.exit(0);
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
