import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = conn.connections[0].readyState;
    console.log("Database Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
