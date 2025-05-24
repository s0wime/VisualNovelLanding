import VisitorsRepository from "../repositories/visitorsRepository.js";

class VisitorsService {
  static async addVisitor(visitorId) {
    await VisitorsRepository.initVisitorRecord(visitorId);
  }
}

export default VisitorsService;
