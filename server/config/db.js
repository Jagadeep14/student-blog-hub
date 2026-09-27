const mongoose = require('mongoose');

// Connect to MongoDB Database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_blog_hub', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Tip: Ensure local MongoDB service is running or set MONGO_URI in server/.env');
    // Do not exit process immediately in development so server can still serve friendly health responses
  }
};

module.exports = connectDB;
