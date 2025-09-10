import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "..";
import { authMiddleware } from "../middlware";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { createTaskInput } from "../types";
import { TOTAL_DECIMALS } from "./worker";

const DEFAULT_TITLE = "Select the most clickable thumbnail";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
  },
  region: "us-east-1",
});

const router = Router();

const prismaClient = new PrismaClient();

router.get("/task", authMiddleware, async (req, res) => {
  //@ts-ignore
  const taskId: string = req.query.taskId;

  //@ts-ignore
  const userId: string = req.userId;

  const taskDetails = await prismaClient.task.findFirst({
    where: {
      user_id: Number(userId),
      id: Number(taskId),
    },
    include: {
      options: true,
    },
  });
  if (!taskDetails) {
    return res.status(411).json({
      message: "You don't have access to this task",
    });
  }

  //Todo: Can u make this faster?
  const responses = await prismaClient.submission.findMany({
    where: {
      task_id: Number(taskId),
    },
    include: {
      option: true,
    },
  });
  const result: Record<
    string,
    {
      count: number;
      option: {
        imageUrl: string;
      };
    }
  > = {};

  taskDetails.options.forEach((option) => {
    result[option.id] = {
      count: 0,
      option: {
        imageUrl: option.image_url,
      },
    };
  });
  responses.forEach((r) => {
    result[r.option_id]!.count++;
  });
  res.json({
    result,
    taskDetails,
  });
});

router.post("/task", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const body = req.body;

  const parseData = createTaskInput.safeParse(body);

  if (!parseData.success) {
    return res.status(411).json({ messsage: "You've sent the wrong inputs" });
  }

  let response = await prismaClient.$transaction(async (tx) => {
    const response = await tx.task.create({
      data: {
        title: parseData.data.title ?? DEFAULT_TITLE,
        amount: 1 * TOTAL_DECIMALS,
        payment_signature: parseData.data.payment_signature,
        user_id: userId,
      },
    });
    await tx.option.createMany({
      data: parseData.data.options.map((x) => ({
        image_url: x.imageUrl,
        task_id: response.id,
      })),
    });
    return response;
  });
  res.json({
    id: response.id,
  });
});

router.get("/presignedUrl", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: "decenteralised-fiverrr",
    Key: `fiver/${userId}/${Math.random()}/image.jpg`,
    Conditions: [["content-length-range", 0, 5 * 1024 * 1024]], //5 MB MAX
    Expires: 3600,
  });

  res.json({
    preSignedUrl: url,
    fields,
  });
});

router.post("/signin", async (req, res) => {
  const hardCodedWalletAddress = "4wRWn5Hr45fQcEdG5zEoy39AEiCNURoYHqKKAiugUP4p";

  const existingUser = await prismaClient.user.findFirst({
    where: {
      address: hardCodedWalletAddress,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      jwtSecret
    );
    res.json({ token });
  } else {
    const user = await prismaClient.user.create({
      data: {
        address: hardCodedWalletAddress,
      },
    });
    const token = jwt.sign(
      {
        userId: user.id,
      },

      jwtSecret
    );
    res.json({ token });
  }
});

export default router;
