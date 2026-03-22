const Log = require("../models/logModel");

const createLog = async (data) => {
  return await Log.create(data);
};

const getLogs = async (query) => {
  const filter = {};

  // 🔹 Filtering
  if (query.level) {
    filter.level = query.level;
  }

  if (query.service) {
    filter.service = query.service;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  // 📄 Pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;

  const skip = (page - 1) * limit;

  let logs;

if (query.search) {
  logs = await Log.find(filter, {
    score: { $meta: "textScore" },
  })
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit);
} else {
  logs = await Log.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

  const total = await Log.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    logs,
  };
};

module.exports = { createLog, getLogs };