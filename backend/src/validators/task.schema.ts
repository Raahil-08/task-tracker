import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title must be at least 1 character")
      .max(200, "Title must be at most 200 characters")
      .optional(),
    description: z
      .string()
      .max(1000, "Description must be at most 1000 characters")
      .optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.completed !== undefined,
    { message: "At least one field must be provided" }
  );

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
