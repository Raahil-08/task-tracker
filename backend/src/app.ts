import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Security headers
app.use(helmet());

// CORS — default "*" for development; lock down in production
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint (used by Render to verify service is up)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Centralized error handler — must be last
app.use(errorHandler);

export default app;
