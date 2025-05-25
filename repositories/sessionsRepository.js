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

  static async updateSessionRecord(params) {
    await prisma.session.update({
      where: {
        id: params.sessionId,
      },
      data: {
        lastActivityAt: params.lastActivityAt,
        scrollDepthPercentage: params.scrollDepthPercentage,
      },
    });
  }
}

export default SessionsRepository;
