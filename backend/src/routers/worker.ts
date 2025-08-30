import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "..";
import { workerMiddleware } from "../middlware";
export const WORKER_JWT_SECRET = jwtSecret + "worker";
const prismaClient = new PrismaClient();
const router = Router();

router.post("/signin", async (req, res) => {
  const hardCodedWalletAddress = "4wRWn5Hr45fQcEdG5zEoy39AEiCNURoYHqKKAiugUP4a";

  const existingUser = await prismaClient.worker.findFirst({
    where: {
      address: hardCodedWalletAddress,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      WORKER_JWT_SECRET
    );
    res.json({ token });
  } else {
    const user = await prismaClient.worker.create({
      data: {
        address: hardCodedWalletAddress,
        pending_amount: 0,
        locked_amount: 0,
      },
    });
    const token = jwt.sign(
      {
        userId: user.id,
      },
      WORKER_JWT_SECRET
    );
    res.json({ token });
  }
});

router.get("/nextTask", workerMiddleware, (req, res) => {
  //@ts-ignore
  const userId = req.userId;
});

export default router;
