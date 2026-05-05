import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { signupSchema, loginSchema } from "../validators/auth.schema";

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/signup
 * Creates a new user account and returns a JWT + user object.
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  // Validate request body
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0].message });
    return;
  }

  const { name, email, password } = result.data;

  // Check for duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

  const token = signToken(user._id.toString());

  res.status(201).json({ token, user: user.toJSON() });
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT + user object.
 * Uses a generic error message to prevent leaking which field was wrong.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0].message });
    return;
  }

  const { email, password } = result.data;

  // Generic message prevents attackers from enumerating valid emails
  const genericError = "Invalid email or password";

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ error: genericError });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ error: genericError });
    return;
  }

  const token = signToken(user._id.toString());

  res.status(200).json({ token, user: user.toJSON() });
};
