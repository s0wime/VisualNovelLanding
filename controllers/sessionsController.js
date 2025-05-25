import SessionsService from "../services/sessionsService.js";
import useragent from "useragent";

class SessionsController {
  static async initSession(req, res, next) {
    const body = req.body;

    if (!body.visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    const visitorId = body.visitorId;
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const uaString = req.headers["user-agent"];
    const agent = useragent.parse(uaString);
    const referrer = req.get("Referrer") || req.get("Referer");

    try {
      await SessionsService.initSession(visitorId, ipAddress, agent, referrer);
    } catch (e) {
      next(e);
    }

    return res
      .status(201)
      .json({ message: "Session was successfully initialized." });
  }
}

export default SessionsController;
