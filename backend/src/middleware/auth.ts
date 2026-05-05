import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

/**
 * JWT authentication middleware.
 *
 * Reads the Authorization header, extracts the Bearer token, verifies it,
 * and attaches the userId to the request. Responds 401 on any failure —
 * missing header, malformed token, expired token, or invalid signature.
 * The generic 401 prevents information leakage about why auth failed.
 */
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = header.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
