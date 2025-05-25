import SessionsRepository from "../repositories/sessionsRepository.js";
import useragent from "useragent";

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

    console.log(session);

    const params = {
      sessionId: session.id,
      lastActivityAt: new Date().toISOString(),
    };

    if (scrollDepthPercentage) {
      params.scrollDepthPercentage =
        scrollDepthPercentage > session.scrollDepthPercentage
          ? scrollDepthPercentage
          : session.scrollDepthPercentage;
    } else {
      params.scrollDepthPercentage = session.scrollDepthPercentage;
    }

    await SessionsRepository.updateSessionRecord(params);
  }

  static async getActiveSession(visitorId) {
    const session = await SessionsRepository.readActiveSessionRecord(visitorId);

    return session;
  }
}

export default SessionsService;
