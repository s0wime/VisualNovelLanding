import VisitorsRepository from "../repositories/visitorsRepository.js";
import EventsService from "./eventsService.js";

class VisitorsService {
  static async addVisitor(visitorId) {
    return await VisitorsRepository.initVisitorRecord(visitorId);
  }

  static async getVisitor(visitorId) {
    const visitor = await VisitorsRepository.readVisitorRecord(visitorId);
    return visitor;
  }

  static async updateVisitorLastSeen(visitorId, lastSeen) {
    const params = {
      lastSeenAt: lastSeen,
    };

    return await VisitorsRepository.updateVisitorRecord(visitorId, params);
  }

  static async addVisitorEmail(visitorId, email) {
    await VisitorsRepository.addVisitorEmail(visitorId, email);

    return await EventsService.handleEvent(visitorId, "EMAIL_FORM_SUBMITTED");
  }
}

export default VisitorsService;
