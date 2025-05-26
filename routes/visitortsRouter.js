import { Router } from "express";
import VisitorsController from "../controllers/visitorsController.js";

const router = new Router();

router.post("/create", VisitorsController.addVisitor);
router.post("/submitEmail", VisitorsController.submitEmail);

export default router;
