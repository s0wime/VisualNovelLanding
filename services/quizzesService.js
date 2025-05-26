import NotFoundError from "../errors/NotFoundError.js";
import QuizzesRepository from "../repositories/quizzesRepository.js";
import SessionsService from "./sessionsService.js";
import QuizHandlingError from "../errors/QuizHandlingError.js";
import EventsService from "./eventsService.js";

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
      return await this.continueQuiz(quizAttempt);
    }

    await QuizzesRepository.createQuizAttemptRecord(visitorId, session.id);

    await EventsService.handleEvent(visitorId, "QUIZ_STARTED");

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

    const lastQuizResponse = await QuizzesRepository.getLastQuizResponse(
      quizAttempt.id
    );

    const answeredQuestionObject =
      await QuizzesRepository.getQuestionObjectById(answerObject.questionId);

    if (!answeredQuestionObject) {
      throw new NotFoundError("There is no such question.");
    }

    if (
      lastQuizResponse &&
      answeredQuestionObject.order <= lastQuizResponse.question.order
    ) {
      throw new QuizHandlingError(
        "You already have answered to this question."
      );
    }

    if (
      !answeredQuestionObject.answers.some(
        (answer) => answer.id === answerObject.answerId
      )
    ) {
      throw new QuizHandlingError("There is no such answer for this question.");
    }

    const params = {
      quizAttemptId: quizAttempt.id,
      questionId: answerObject.questionId,
      answerId: answerObject.answerId,
    };

    await QuizzesRepository.createQuizResponseRecord(params);

    return await this.continueQuiz(quizAttempt);
  }

  static async continueQuiz(quizAttempt) {
    const lastQuizResponse = await QuizzesRepository.getLastQuizResponse(
      quizAttempt.id
    );

    const nextQuestionObject = await QuizzesRepository.getQuestionObjectByOrder(
      lastQuizResponse.question.order + 1
    );

    if (!nextQuestionObject) {
      const completedAt = new Date().toISOString();
      const duration =
        Math.abs(
          new Date(completedAt).getTime() -
            new Date(quizAttempt.startedAt).getTime()
        ) / 1000;
      const params = {
        completedAt: completedAt,
        isCompleted: true,
        duration: duration,
      };
      await QuizzesRepository.updateQuizAttemptRecord(quizAttempt.id, params);
      await EventsService.handleEvent(quizAttempt.visitorId);
      return {
        quizEnded: true,
        message: "You have successfully completed the quiz.",
      };
    }

    return nextQuestionObject;
  }
}

export default QuizzesService;
