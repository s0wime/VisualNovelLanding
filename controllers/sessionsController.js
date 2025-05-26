import SessionsService from "../services/sessionsService.js";
import useragent from "useragent";
import VisitorsService from "../services/visitorsService.js";

class SessionsController {
  static async handleSessionActivity(req, res, next) {
    const { visitorId, scrollDepthPercentage } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      const visitor = await VisitorsService.getVisitor(visitorId);
      if (!visitor) {
        await VisitorsService.addVisitor(visitorId);
      }
    } catch (e) {
      return next(e);
    }

    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const uaString = req.headers["user-agent"];
    const agent = useragent.parse(uaString);
    const referrer = req.get("Referrer") || req.get("Referer");
    const scrollDepthPercentageParsed = scrollDepthPercentage ?? 0;

    try {
      await SessionsService.recordSessionActivity(
        visitorId,
        ipAddress,
        agent,
        referrer,
        scrollDepthPercentageParsed
      );
    } catch (e) {
      return next(e);
    }

    return res
      .status(201)
      .json({ message: "Session activity has been updated." });
  }

  static async handleSessionEnding(req, res, next) {
    const body = req.body;

    if (!body.visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    const visitorId = body.visitorId;

    try {
      await SessionsService.endSession(visitorId);
    } catch (e) {
      return next(e);
    }

    return res.status(201).json({ message: "Session has been closed." });
  }
}

export default SessionsController;
