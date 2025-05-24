import { Router } from "express";
import SessionsController from "../controllers/sessionsController";

const router = new Router();

router.post("/:visitorId", SessionsController.addVisitor);

export default router;
