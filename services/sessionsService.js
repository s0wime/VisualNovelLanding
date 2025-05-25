import SessionsRepository from "../repositories/sessionsRepository.js";
import NotFoundError from "../errors/NotFoundError.js";
import useragent from "useragent";
import VisitorsService from "./visitorsService.js";

class SessionsService {
  static async initSession(visitorId, ipAddress, agent, referrer) {
    const params = {
      visitorId: visitorId,
      ipAddress: ipAddress,
      uaDevice: agent.device.toString(),
      uaOs: agent.os.toString(),
      uaBrowser: agent.toAgent(),
      referrer: referrer,
    };

    console.log(JSON.stringify(params));

    await SessionsRepository.createSessionRecord(params);
  }

  static async recordSessionActivity(
    visitorId,
    ipAddress,
    agent,
    referrer,
    scrollDepthPercentage
  ) {
    const session = await this.getActiveSession(visitorId);

    if (!session) {
      this.initSession(visitorId, ipAddress, agent, referrer);
      return;
    }

    const lastActivityAt = new Date().toISOString();

    const params = {
      lastActivityAt: lastActivityAt,
    };

    await VisitorsService.updateVisitorLastSeen(visitorId, lastActivityAt);

    if (scrollDepthPercentage) {
      params.scrollDepthPercentage =
        scrollDepthPercentage > session.scrollDepthPercentage
          ? scrollDepthPercentage
          : session.scrollDepthPercentage;
    } else {
      params.scrollDepthPercentage = session.scrollDepthPercentage;
    }

    await SessionsRepository.updateSessionRecord(session.id, params);
  }

  static async endSession(visitorId) {
    const session = await this.getActiveSession(visitorId);

    if (!session) {
      throw new NotFoundError("There is no opened sessions.");
    }

    const sessionEnd = new Date().toISOString();
    const duration =
      Math.abs(
        new Date(session.sessionStart).getTime() -
          new Date(sessionEnd).getTime()
      ) / 1000;

    const params = {
      sessionEnd: sessionEnd,
      duration: duration,
      lastActivityAt: sessionEnd,
    };

    return await SessionsRepository.updateSessionRecord(session.id, params);
  }

  static async getActiveSession(visitorId) {
    return await SessionsRepository.readActiveSessionRecord(visitorId);
  }
}

export default SessionsService;
