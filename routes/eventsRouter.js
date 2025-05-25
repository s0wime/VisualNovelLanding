import { Router } from "express";
import EventsController from "../controllers/eventsController.js";

const router = new Router();

router.post("/", EventsController.handleEvent);

export default router;
