const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    level: { type: String, required: true }, // info, error, warn
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);