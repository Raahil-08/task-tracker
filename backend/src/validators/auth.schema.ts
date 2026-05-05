import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
