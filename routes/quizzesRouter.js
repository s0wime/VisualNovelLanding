import { Router } from "express";
import QuizzesController from "../controllers/quizzesController.js";

const router = new Router();

router.post("/start", QuizzesController.startQuiz);
router.post("/answer", QuizzesController.answerQuiz);
router.post("/questionBack", QuizzesController.returnToPreviousQuestion);

export default router;
