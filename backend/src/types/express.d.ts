// Extend the Express Request interface to include userId,
// which is attached by the auth middleware after JWT verification.

declare namespace Express {
  interface Request {
    userId?: string;
  }
}
