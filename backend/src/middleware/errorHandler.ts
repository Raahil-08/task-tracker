import { Request, Response, NextFunction } from "express";

/**
 * Centralized error handler — must be registered as the LAST app.use().
 *
 * Catches any error that propagates from controllers or middleware and
 * sends a structured JSON response. Unknown errors log to console and
 * return a generic 500 to avoid leaking internal details.
 */
export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Internal server error" : err.message;

  res.status(statusCode).json({ error: message });
};
