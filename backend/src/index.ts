import express from "express";
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
import dotenv from "dotenv";
import cors from "cors";
const app = express();

dotenv.config();
app.use(express.json());
// const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"];
app.use(cors());

export const jwtSecret = process.env.JWT_SECRET || "default";

app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

app.listen(3000);
