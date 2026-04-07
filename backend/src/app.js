const express = require("express");
const cors = require("cors");

const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", logRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

module.exports = app;