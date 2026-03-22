const Log = require("../models/logModel");

const createLog = async (data) => {
  return await Log.create(data);
};

const getLogs = async () => {
  return await Log.find().sort({ createdAt: -1 });
};

module.exports = { createLog, getLogs };