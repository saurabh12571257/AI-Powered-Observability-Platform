const express = require("express");
const cors = require("cors");

const logRoutes = require("./routes/logRoutes");

const app = express();   // ✅ MUST come before using app

app.use(cors());
app.use(express.json());

app.use("/api", logRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

module.exports = app;