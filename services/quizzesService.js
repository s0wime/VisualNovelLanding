import NotFoundError from "../errors/NotFoundError.js";
import QuizzesRepository from "../repositories/quizzesRepository.js";
import SessionsService from "./sessionsService.js";
import QuizHandlingError from "../errors/QuizHandlingError.js";
import EventsService from "./eventsService.js";
import VisitorsService from "./visitorsService.js";
import BadRequestError from "../errors/BadRequestError.js";
import SessionsRepository from "../repositories/sessionsRepository.js";
import { GenreType } from "../generated/prisma/index.js";

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

    return {
      question: {
        aboutAge: true,
        text: "What is your age?",
      },
    };
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

    const quizDuration =
      Math.abs(
        new Date(quizAttempt.startedAt).getTime() - new Date().getTime()
      ) / 1000;

    await QuizzesRepository.updateQuizAttemptRecord(quizAttempt.id, {
      duration: quizDuration,
    });

    await Promise.all([
      VisitorsService.updateVisitorLastSeen(
        visitorId,
        new Date().toISOString()
      ),
      SessionsService.updateSessionLastActivity(
        session.id,
        new Date().toISOString()
      ),
    ]);

    if (answerObject.aboutAge) {
      if (!["17-21", "21-35", "35-45", "45+"].includes(answerObject.age)) {
        throw new BadRequestError("Bad request!");
      }

      await SessionsRepository.updateSessionRecord(session.id, {
        age: answerObject.age,
      });
    } else if (answerObject.aboutGender) {
      if (
        !["Male", "Female", "Non-binary", "Prefer not to say"].includes(
          answerObject.gender
        )
      ) {
        throw new BadRequestError("Bad request!");
      }

      await SessionsRepository.updateSessionRecord(session.id, {
        gender: answerObject.gender,
      });
    } else if (answerObject.aboutQuizGenre) {
      if (!Object.values(GenreType).includes(answerObject.quizGenre)) {
        throw new BadRequestError("Bad request!");
      }

      await QuizzesRepository.updateQuizAttemptRecord(quizAttempt.id, {
        quizType: answerObject.quizGenre,
      });
      quizAttempt.quizType = answerObject.quizGenre;
    } else {
      const lastQuizResponse = await QuizzesRepository.getLastQuizResponse(
        quizAttempt.id
      );

      const answeredQuestionObject =
        await QuizzesRepository.getQuestionObjectById(answerObject.questionId);

      if (!answeredQuestionObject) {
        throw new NotFoundError("There is no such question.");
      }

      if (lastQuizResponse) {
        if (
          answeredQuestionObject.order >
          lastQuizResponse.question.order + 1
        ) {
          throw new QuizHandlingError("You can't skip questions.");
        }
      }

      if (
        !answeredQuestionObject.answers.some(
          (answer) => answer.id === answerObject.answerId
        )
      ) {
        throw new QuizHandlingError(
          "There is no such answer for this question."
        );
      }

      const params = {
        quizAttemptId: quizAttempt.id,
        questionId: answerObject.questionId,
        answerId: answerObject.answerId,
      };

      await QuizzesRepository.createQuizResponseRecord(params);
    }

    return await this.continueQuiz(quizAttempt);
  }

  static async getStoryByAnswers(quizAttempt) {
    const quizResponses = await QuizzesRepository.getQuizAttemptResponses(
      quizAttempt.id
    );

    const options = quizResponses.map((response) => {
      return response.answer.option;
    });
    const frequency = {};
    for (let option of options) {
      frequency[option] = (frequency[option] || 0) + 1;
    }

    let maxOption = "";
    let maxCount = 0;

    for (let option in frequency) {
      if (frequency[option] > maxCount) {
        maxCount = frequency[option];
        maxOption = option;
      }
    }

    const storyRecord = await QuizzesRepository.getStoryRecord(
      maxOption,
      quizAttempt.quizType
    );

    return storyRecord;
  }

  static async continueQuiz(quizAttempt) {
    const session = await SessionsService.getActiveSession(
      quizAttempt.visitorId
    );
    if (!session) {
      throw new Error("There is no active session in visitor!");
    }

    if (!session.age) {
      const questionObject = {
        question: {
          aboutAge: true,
          text: "What is your age?",
        },
      };
      return questionObject;
    } else if (!session.gender) {
      const questionObject = {
        question: {
          aboutGender: true,
          text: "What is your gender?",
        },
      };
      return questionObject;
    } else if (!quizAttempt.quizType) {
      const questionObject = {
        question: {
          aboutQuizGenre: true,
          text: "Choose genre",
        },
      };
      return questionObject;
    }

    const lastQuizResponse = await QuizzesRepository.getLastQuizResponse(
      quizAttempt.id
    );

    if (!lastQuizResponse) {
      return await QuizzesRepository.getQuestionObjectByOrderAndGenre(
        0,
        quizAttempt.quizType
      );
    }

    const nextQuestionObject =
      await QuizzesRepository.getQuestionObjectByOrderAndGenre(
        lastQuizResponse.question.order + 1,
        quizAttempt.quizType
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
      await EventsService.handleEvent(quizAttempt.visitorId, "QUIZ_ENDED");

      const storyObj = await this.getStoryByAnswers(quizAttempt);
      return {
        quizEnded: true,
        title: storyObj.title,
        text: storyObj.text,
        genre: storyObj.genre,
      };
    }

    return nextQuestionObject;
  }

  static async getPreviousQuizQuestion(visitorId) {
    const session = await SessionsRepository.readActiveSessionRecord(visitorId);
    if (!session) {
      throw new Error("There is no active session in visitor.");
    }

    const quizAttempt = await QuizzesRepository.getQuizAttemptRecord(
      session.id
    );
    if (!quizAttempt) {
      return new QuizHandlingError("There is no active quiz in visitor.");
    }

    const lastQuizResponse = await QuizzesRepository.getLastQuizResponse(
      quizAttempt.id
    );
    if (lastQuizResponse) {
      console.log(lastQuizResponse);
      await QuizzesRepository.removeQuizResponseRecord(lastQuizResponse.id);
    }

    return await this.continueQuiz(quizAttempt);
  }
}

export default QuizzesService;
