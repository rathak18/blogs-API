const mongoose = require('mongoose');
require('dotenv').config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  }
};

module.exports = {
  connectToDB,
  mongoose, // Export the mongoose instance for sharing
};
