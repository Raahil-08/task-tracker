import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";
import app from "./app";

// Fail fast if required environment variables are missing
const requiredVars = ["MONGO_URI", "JWT_SECRET"] as const;
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`FATAL: ${varName} environment variable is not set.`);
    process.exit(1);
  }
}

const PORT = parseInt(process.env.PORT || "4000", 10);

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
