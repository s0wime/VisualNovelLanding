import EventsService from "../services/eventsService.js";

class EventsController {
  static async handleEvent(req, res, next) {
    const { visitorId, eventType } = req.body;

    if (!visitorId || !eventType) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      await EventsService.handleEvent(visitorId, eventType);
    } catch (e) {
      return next(e);
    }

    return res.status(201).json({ message: "Event successfully registered." });
  }
}

export default EventsController;
