import EventsService from "../services/eventsService.js";

class EventsController {
  static async handleEvent(req, res, next) {
    const body = req.body;

    if (!body.visitorId || !body.eventType) {
      return res.status(400).json({ error: "Bad request." });
    }

    const { visitorId, eventType } = body;

    try {
      await EventsService.handleEvent(visitorId, eventType);
    } catch (e) {
      return next(e);
    }

    return res.status(201).json({ message: "Event successfully registered." });
  }
}

export default EventsController;
