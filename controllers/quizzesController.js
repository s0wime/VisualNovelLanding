import QuizzesService from "../services/quizzesService.js";

class QuizzesController {
  static async handleQuiz(req, res, next) {}

  static async startQuiz(req, res, next) {
    const body = req.body;

    if (!body.visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    const visitorId = body.visitorId;

    try {
      const questionObject = await QuizzesService.startQuiz(visitorId);
      return res.status(200).json(questionObject);
    } catch (e) {
      return next(e);
    }
  }
}

export default QuizzesController;
