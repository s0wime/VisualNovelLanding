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
}

export default SessionsService;
