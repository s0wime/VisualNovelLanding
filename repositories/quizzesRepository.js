import prisma from "../prisma.js";

class QuizzesRepository {
  static async getQuizAttemptRecord(sessionId) {
    return await prisma.quizAttempt.findFirst({
      where: {
        AND: [
          {
            sessionId: sessionId,
          },
          {
            isCompleted: false,
          },
        ],
      },
    });
  }

  static async createQuizAttemptRecord(visitorId, sessionId) {
    return await prisma.quizAttempt.create({
      data: {
        visitorId: visitorId,
        sessionId: sessionId,
      },
    });
  }

  static async getQuestionObjectByOrderAndGenre(questionOrder, genre) {
    const question = await prisma.question.findFirst({
      where: {
        AND: [
          {
            order: questionOrder,
          },
          {
            genre: genre,
          },
        ],
      },
    });

    if (!question) {
      return undefined;
    }

    const answers = await prisma.answer.findMany({
      where: {
        questionId: question.id,
      },
    });

    return { question, answers };
  }

  static async getLastQuizResponse(quizAttemptId) {
    try {
      return await prisma.quizResponse.findFirst({
        where: {
          quizAttemptId: quizAttemptId,
        },
        orderBy: {
          question: {
            order: "desc",
          },
        },
        include: {
          question: true,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  static async getQuestionObjectById(questionId) {
    return await prisma.question.findFirst({
      where: {
        id: questionId,
      },
      include: {
        answers: true,
      },
    });
  }

  static async createQuizResponseRecord(params) {
    return await prisma.quizResponse.create({
      data: params,
    });
  }

  static async updateQuizAttemptRecord(quizAttemptId, params) {
    return await prisma.quizAttempt.update({
      where: {
        id: quizAttemptId,
      },
      data: params,
    });
  }

  static async getQuizAttemptResponses(quizAttemptId) {
    return await prisma.quizResponse.findMany({
      where: {
        quizAttemptId: quizAttemptId,
      },
      include: {
        answer: true,
      },
    });
  }

  static async getStoryRecord(option, genre) {
    return await prisma.story.findFirst({
      where: {
        AND: [
          {
            option: option,
          },
          {
            genre: genre,
          },
        ],
      },
    });
  }
}

export default QuizzesRepository;
