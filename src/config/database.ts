import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.NODE_ENV === "production"
  ? process.env.PROD_MONGODB_URI
  : process.env.DEV_MONGODB_URI;

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected to ${process.env.NODE_ENV} database`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
