import cron from "node-cron";
import SessionsService from "./services/sessionsService.js";

const delayMinutes = 1;

function scheduleSessionsCleanup() {
  cron.schedule(`*/${delayMinutes} * * * *`, async () => {
    console.log("Runnig scheduled sessions cleanup");
    try {
      await SessionsService.cleanupPossibleInactiveSessions();
      console.log("Finised scheduled sessions cleanup");
    } catch (e) {
      console.error(e);
    }
  });
}

export default scheduleSessionsCleanup;
