const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, index: true },
    level: { type: String, required: true, index: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

logSchema.index({ message: "text" });

module.exports = mongoose.model("Log", logSchema);