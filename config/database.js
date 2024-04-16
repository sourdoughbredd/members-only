require("dotenv").config();

// Set up database connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const db = process.env.MONGODB_URI;

module.exports.connect = async () => {
  try {
    console.log("Connecting to db...");
    await mongoose.connect(db);
    console.log("Connected successfully.");
  } catch (err) {
    console.error("Database connection failed!", err);
  }
};

module.exports.disconnect = mongoose.disconnect;
