import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All task routes require authentication
router.use(auth);

router.get("/", asyncHandler(getTasks));
router.post("/", asyncHandler(createTask));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
