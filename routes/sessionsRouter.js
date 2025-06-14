import { Router } from "express";
import SessionsController from "../controllers/sessionsController.js";

const router = Router();

router.post("/activity", SessionsController.handleSessionActivity);
router.post("/end", SessionsController.handleSessionEnding);

export default router;
