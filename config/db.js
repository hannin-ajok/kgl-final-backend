const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use a single shared mongoose connection for the whole app.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
