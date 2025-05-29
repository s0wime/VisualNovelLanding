import prisma from "../prisma.js";

class VisitorsRepository {
  static async initVisitorRecord(visitorId) {
    return await prisma.visitor.create({
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
    return await prisma.visitor.update({
      where: {
        id: visitorId,
      },
      data: params,
    });
  }
}

export default VisitorsRepository;
