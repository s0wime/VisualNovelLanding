import { Router } from "express";
import SessionsController from "../controllers/sessionsController.js";

const router = Router();

router.post("/init", SessionsController.initSession);

export default router;
