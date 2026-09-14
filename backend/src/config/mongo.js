const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};