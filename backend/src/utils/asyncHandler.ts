import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express route handler so that rejected promises
 * are automatically forwarded to the centralized error handler
 * via next(err), instead of causing an unhandled rejection.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
