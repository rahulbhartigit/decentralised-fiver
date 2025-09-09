import express from "express";
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
import dotenv from "dotenv";
import cors from "cors";
const app = express();

dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

export const jwtSecret = process.env.JWT_SECRET || "default";

app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

app.listen(3000);
