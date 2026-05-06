import { Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "../models/Task";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.schema";

/**
 * GET /api/tasks
 * Returns all tasks for the authenticated user, newest first.
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const tasks = await Task.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({ tasks });
};

/**
 * POST /api/tasks
 * Creates a new task for the authenticated user.
 */
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0].message });
    return;
  }

  const task = await Task.create({
    userId: req.userId,
    title: result.data.title,
    description: result.data.description,
    priority: result.data.priority,
    dueDate: result.data.dueDate,
  });

  res.status(201).json({ task });
};

/**
 * PATCH /api/tasks/:id
 * Updates a task belonging to the authenticated user.
 *
 * Returns a generic 404 whether the task doesn't exist or belongs to
 * another user — this prevents enumeration of other users' task IDs.
 */
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId = req.params.id as string;

  // Validate ObjectId format to avoid Mongoose cast errors
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const result = updateTaskSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0].message });
    return;
  }

  // Only update if task belongs to the authenticated user
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId: req.userId },
    { $set: result.data },
    { new: true, runValidators: true }
  );

  if (!task) {
    // Generic 404 prevents cross-user ID enumeration
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json({ task });
};

/**
 * DELETE /api/tasks/:id
 * Deletes a task belonging to the authenticated user.
 * Same generic 404 rationale as updateTask.
 */
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const taskId = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const task = await Task.findOneAndDelete({
    _id: taskId,
    userId: req.userId,
  });

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json({ success: true });
};
