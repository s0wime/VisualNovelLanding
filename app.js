import express from "express";
import sessionsRouter from "./routes/sessionsRouter.js";
import visitorsRouter from "./routes/visitortsRouter.js";
import eventsRouter from "./routes/eventsRouter.js";
import quizzesRouter from "./routes/quizzesRouter.js";
import dotenv from "dotenv";
import cors from "cors";

const PORT = 3000;

const app = express();

dotenv.config();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use("/api/sessions", sessionsRouter);
app.use("/api/visitors", visitorsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/quizzes", quizzesRouter);

app.use((err, req, res, next) => {
  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: err.message });
  }

  if (err.name === "BadRequestError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "QuizHandlingError") {
    return res.status(500).json({
      error: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
