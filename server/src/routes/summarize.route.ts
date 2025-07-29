import { Router } from "express";
import { summarizeTasks } from "../controllers/summarize.controller";
import { authenticate } from "../controllers/auth.controllers";

const router = Router();
router.post("/", authenticate, summarizeTasks);
export default router;
