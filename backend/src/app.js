const express = require("express");
const cors = require("cors");

const { getDBHealth } = require("./config/db");
const { metricsRegister, metricsContentType } = require("./metrics");
const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", logRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", metricsContentType);
    res.end(await metricsRegister.metrics());
  } catch (error) {
    res.status(500).json({ error: "Failed to collect metrics" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/ready", async (req, res) => {
  const dbHealth = await getDBHealth();

  if (!dbHealth.ok) {
    return res.status(503).json({
      status: "error",
      service: "backend",
      mongo: "down",
      error: dbHealth.error,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    status: "ok",
    service: "backend",
    mongo: "up",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
