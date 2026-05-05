import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return secret;
};

/**
 * Sign a JWT containing the user's ID.
 * Token expires in 7 days.
 */
export const signToken = (userId: string): string => {
  return jwt.sign({ userId }, getSecret(), { expiresIn: "7d" });
};

/**
 * Verify and decode a JWT, returning the payload.
 * Throws if the token is invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};
