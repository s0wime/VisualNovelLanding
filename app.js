import express from "express";
import sessionsRouter from "./routes/sessionsRouter.js";
import visitorsRouter from "./routes/visitortsRouter.js";
import dotenv from "dotenv";

const PORT = 3000;

const app = express();

dotenv.config();

app.use(express.json());

app.use("/api/sessions", sessionsRouter);
app.use("/api/visitors", visitorsRouter);

app.use((err, req, res, next) => {
  console.log("111111111111111111");

  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: err.message });
  }

  if (err.name === "BadRequestError") {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
