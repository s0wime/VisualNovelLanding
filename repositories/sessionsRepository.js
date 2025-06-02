import prisma from "../prisma.js";

class SessionsRepository {
  static async createSessionRecord(params) {
    await prisma.session.create({ data: params });
  }

  static async readActiveSessionRecord(visitorId) {
    return await prisma.session.findFirst({
      where: {
        AND: [{ visitorId: visitorId }, { sessionEnd: null }],
      },
    });
  }

  static async updateSessionRecord(sessionId, params) {
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: params,
    });
  }

  static async findPossibleInactiveSessionRecords(threshold) {
    return await prisma.session.findMany({
      where: {
        AND: [
          {
            sessionEnd: null,
          },
          {
            lastActivityAt: {
              lt: threshold,
            },
          },
        ],
      },
    });
  }
}

export default SessionsRepository;
