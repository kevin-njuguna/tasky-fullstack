import { Router } from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  getIncompleteTasks,
  getCompletedTasks,
  getDeletedTasks,
  updateTask,
  deleteTask,
  restoreTask,
  markTaskComplete,
  markTaskIncomplete,
} from "../controllers/task.controller";

import { authenticate } from "../controllers/auth.controllers";

const router: Router = Router();

router.get("/", authenticate, getAllTasks);
router.get("/incomplete", authenticate, getIncompleteTasks);
router.get("/completed", authenticate, getCompletedTasks);
router.get("/deleted", authenticate, getDeletedTasks);
router.get("/:taskId", authenticate, getTaskById);
router.post("/", authenticate, createTask);
router.patch("/:taskId", authenticate, updateTask);
router.delete("/:taskId", authenticate, deleteTask);
router.patch("/restore/:taskId", authenticate, restoreTask);
router.patch("/complete/:taskId", authenticate, markTaskComplete);
router.patch("/incomplete/:taskId", authenticate, markTaskIncomplete);
router.get("/incomplete", authenticate, getIncompleteTasks);

export default router;
