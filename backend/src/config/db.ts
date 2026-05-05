import mongoose from "mongoose";

/**
 * Connect to MongoDB using the MONGO_URI environment variable.
 * Exits the process on connection failure to fail fast at startup.
 */
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("FATAL: MONGO_URI environment variable is not set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
