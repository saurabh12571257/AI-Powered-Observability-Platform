const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, index: true },
    level: { type: String, required: true, index: true },
    severity: { type: String, default: "medium", index: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

logSchema.index({ message: "text" });
logSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Log", logSchema);
