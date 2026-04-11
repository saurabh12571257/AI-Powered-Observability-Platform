const mongoose = require("mongoose");

const pingDB = async () => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection is not initialized");
  }

  await mongoose.connection.db.admin().ping();
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    await pingDB();

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log("MongoDB ping successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const getDBHealth = async () => {
  try {
    await pingDB();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

module.exports = { connectDB, getDBHealth };
