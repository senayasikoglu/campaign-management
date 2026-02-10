/**
 * Database connection setup
 */

const mongoose = require("mongoose");

// MongoDB connection URL - use environment variable or default to local MongoDB
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campaign-dashboard";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
