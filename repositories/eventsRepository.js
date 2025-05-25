import prisma from "../prisma.js";

class EventsRepository {
  static async createEventRecord(params) {
    return await prisma.event.create({
      data: params,
    });
  }
}

export default EventsRepository;
