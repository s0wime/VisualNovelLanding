import EventsRepository from "../repositories/eventsRepository.js";
import VisitorsService from "./visitorsService.js";
import SessionsService from "./sessionsService.js";

class EventsService {
  static async handleEvent(visitorId, eventType) {
    const visitor = await VisitorsService.getVisitor(visitorId);
    if (!visitor) {
      throw new NotFoundError("Visitor was not found.");
    }

    const session = await SessionsService.getActiveSession(visitorId);
    if (!session) {
      throw new NotFoundError("Session was not found.");
    }

    const eventTime = new Date().toISOString();

    const params = {
      sessionId: session.id,
      visitorId: visitor.id,
      eventType: eventType,
    };

    await EventsRepository.createEventRecord(params);
    await SessionsService.updateSessionLastActivity(session.id, eventTime);
    await VisitorsService.updateVisitorLastSeen(visitor.id, eventTime);
  }
}

export default EventsService;
