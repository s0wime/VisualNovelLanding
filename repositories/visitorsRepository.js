import prisma from "../prisma.js";

class VisitorsRepository {
  static async initVisitorRecord(visitorId) {
    await prisma.visitor.create({
      data: {
        id: visitorId,
      },
    });
  }
}

export default VisitorsRepository;
