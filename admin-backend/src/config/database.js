const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`, {
      authSource: process.env.MONGODB_AUTH_SOURCE
    });
    console.log(`MongoDB Connected: ${conn.connection.host} | DB: ${process.env.MONGODB_DB}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
