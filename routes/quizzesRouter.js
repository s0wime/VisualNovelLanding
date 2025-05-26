import { Router } from "express";
import QuizzesController from "../controllers/quizzesController.js";

const router = new Router();

router.post("/start", QuizzesController.startQuiz);
router.post("/answer", QuizzesController.answerQuiz);

export default router;
