console.log("app.js file start running run")
import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import cors from "cors";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

import connectDB from "./db/connection.js";
import authRouter from "./routes/authRoute.js";
import jobRouter from "./routes/jobRoute.js";

//Env File Config
dotenv.config();
const PORT = process.env.PORT || 5500;
const MONGO_DB_URL = process.env.MONGO_DB_URL || "";

const corsOptions = { origin: "http://localhost:5173" };
app.use(cors(corsOptions));

//MiddleWares
import notFoundMiddleware from "./middlewares/NotFound.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import morgan from "morgan";
import authenticateUser from "./middlewares/auth.js";

app.use(morgan("dev"));
if (process.env.NODE_ENV !== "production") {
  app.use(express.json());
}

app.get("/api/v1", (req, res) => {
  res.json({ data: "API version 1.0" });
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./client/dist")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

async function start() {
  try {
    await connectDB(MONGO_DB_URL).then(() => console.log("DB connected."));
    app.listen(PORT, function () {
      console.log(`server running at ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
