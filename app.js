import express from "express";
import sessionsRouter from "./routes/sessionsRouter.js";
import visitorsRouter from "./routes/visitortsRouter.js";
import useragent from "useragent";
import dotenv from "dotenv";

const PORT = 3000;

const app = express();

dotenv.config();

app.use(express.json());

app.use((err, req, res, next) => {
  console.log(err.message);

  if (err.name === "NotFoundError") {
    return res.status(404).send(err.message);
  }

  if (err.name === "BadRequestError") {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error." });
});

app.use("/api/sessions", sessionsRouter);
app.use("/api/visitors", visitorsRouter);

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
