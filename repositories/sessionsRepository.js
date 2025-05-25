import prisma from "../prisma.js";

class SessionsRepository {
  static async createSessionRecord(params) {
    await prisma.session.create({ data: params });
  }
}

export default SessionsRepository;
