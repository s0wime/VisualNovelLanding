import { Router } from "express";
import VisitorsController from "../controllers/visitorsController.js";

const router = new Router();

router.post("/", VisitorsController.addVisitor);

export default router;
