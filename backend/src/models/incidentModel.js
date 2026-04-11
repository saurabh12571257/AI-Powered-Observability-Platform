const mongoose = require("mongoose");

const incidentLogSchema = new mongoose.Schema(
  {
    logId: { type: String },
    service: { type: String },
    level: { type: String },
    severity: { type: String },
    message: { type: String },
    createdAt: { type: Date },
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    triggerLogId: { type: mongoose.Schema.Types.ObjectId, ref: "Log", required: true, index: true },
    triggerLog: { type: incidentLogSchema, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending", index: true },
    service: { type: String, index: true },
    severity: { type: String, index: true },
    windowStart: { type: Date, required: true, index: true },
    windowEnd: { type: Date, required: true, index: true },
    analysis: { type: String, default: "" },
    error: { type: String, default: "" },
    contextLogs: { type: [incidentLogSchema], default: [] },
    logCount: { type: Number, default: 0 },
    analyzedAt: { type: Date },
  },
  { timestamps: true }
);

incidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Incident", incidentSchema);
