import express from "express";
import sessionsRouter from "./routes/sessionsRouter.js";
import useragent from "useragent";

const PORT = 3000;

const app = express();

app.use("/api/sessions", sessionsRouter);

app.get("/api", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const uaString = req.headers["user-agent"];
  const agent = useragent.parse(uaString);

  res.send(
    JSON.stringify({
      ip: ip,
      device: agent.device.toString(),
      os: agent.os.toString(),
      browser: agent.toAgent(),
    })
  );
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
