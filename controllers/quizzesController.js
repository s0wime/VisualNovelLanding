import QuizzesService from "../services/quizzesService.js";

class QuizzesController {
  static async answerQuiz(req, res, next) {
    const { visitorId, answerObject } = req.body;

    if (!visitorId || !answerObject) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      const questionObject = await QuizzesService.answerQuiz(
        visitorId,
        answerObject
      );
      return res.status(200).json(questionObject);
    } catch (e) {
      return next(e);
    }
  }

  static async startQuiz(req, res, next) {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      const questionObject = await QuizzesService.startQuiz(visitorId);
      return res.status(200).json(questionObject);
    } catch (e) {
      return next(e);
    }
  }

  static async returnToPreviousQuestion(req, res, next) {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      const questionObject = await QuizzesService.getPreviousQuizQuestion(
        visitorId
      );
      return res.status(200).json(questionObject);
    } catch (e) {
      return next(e);
    }
  }
}

export default QuizzesController;
