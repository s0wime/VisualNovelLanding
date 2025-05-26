import NotFoundError from "../errors/NotFoundError.js";
import QuizzesRepository from "../repositories/quizzesRepository.js";
import SessionsService from "./sessionsService.js";
import QuizHandlingError from "../errors/QuizHandlingError.js";

class QuizzesService {
  static async startQuiz(visitorId) {
    const session = await SessionsService.getActiveSession(visitorId);
    if (!session) {
      throw new Error("There is no active session in visitor!");
    }

    const quizAttempt = await QuizzesRepository.getQuizAttemptRecord(
      session.id
    );
    if (quizAttempt) {
      return await this.continueQuiz(quizAttempt.id);
    }

    await QuizzesRepository.createQuizAttemptRecord(visitorId, session.id);

    const questionObject = await QuizzesRepository.getQuestionObjectByOrder(0);

    if (!questionObject) {
      throw new QuizHandlingError("Couldn't handle the quiz.");
    }

    return questionObject;
  }

  static async answerQuiz(visitorId, answerObject) {
    const session = await SessionsService.getActiveSession(visitorId);
    if (!session) {
      throw new Error("There is no active session in visitor!");
    }

    const quizAttempt = await QuizzesRepository.getQuizAttemptRecord(
      session.id
    );

    if (!quizAttempt) {
      throw new QuizHandlingError("There is no active quiz!");
    }

    const params = {
      quizAttemptId: quizAttempt.id,
      questionId: answerObject.questionId,
      answerId: answerObject.answerId,
    };

    await QuizzesRepository.createQuizResponseRecord(params);

    return await this.continueQuiz(quizAttempt.id);
  }

  static async continueQuiz(quizAttemptId) {
    const lastQuizResponse = await QuizzesRepository.getLastQuizResponse(
      quizAttemptId
    );

    const nextQuestionObject = await QuizzesRepository.getQuestionObjectByOrder(
      lastQuizResponse.question.order + 1
    );

    if (!nextQuestionObject) {
      return {
        quizEnded: true,
        message: "You have successfully completed the quiz.",
      };
    }

    return nextQuestionObject;
  }
}

export default QuizzesService;
