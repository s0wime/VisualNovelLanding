import prisma from "../prisma.js";

class VisitorsRepository {
  static async initVisitorRecord(visitorId) {
    await prisma.visitor.create({
      data: {
        id: visitorId,
      },
    });
  }

  static async readVisitorRecord(visitorId) {
    return await prisma.visitor.findFirst({
      where: {
        id: visitorId,
      },
    });
  }

  static async updateVisitorRecord(visitorId, params) {
    await prisma.visitor.update({
      where: {
        id: visitorId,
      },
      data: params,
    });
  }
}

export default VisitorsRepository;
