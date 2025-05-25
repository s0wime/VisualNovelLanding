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

  static async getQuestionObjectByOrder(questionOrder) {
    const question = await prisma.question.findFirst({
      where: {
        order: questionOrder,
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
}

export default QuizzesRepository;
