const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, index: true },
    level: { type: String, required: true, index: true },
    severity: { type: String, default: "medium", index: true },
    traceId: { type: String, index: true },
    spanId: { type: String, index: true },
    traceFlags: { type: String },
    traceparent: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

logSchema.index({ message: "text" });
logSchema.index({ createdAt: 1 });
logSchema.index({ traceId: 1, createdAt: -1 });

module.exports = mongoose.model("Log", logSchema);
