import { Router } from "express";
import VisitorsController from "../controllers/visitorsController.js";

const router = new Router();

router.post("/create", VisitorsController.addVisitor);

export default router;
