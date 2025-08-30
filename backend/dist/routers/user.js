"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const client_1 = require("@prisma/client");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const middlware_1 = require("../middlware");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
const types_1 = require("../types");
const DEFAULT_TITLE = "Select the most clickable thumbnail";
//@ts-ignore
const ACCESSKEYID = process.env.ACCESS_KEY_ID;
//@ts-ignore
const SECRETACCESSKEY = process.env.SECRET_ACCESS_KEY;
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: ACCESSKEYID,
        secretAccessKey: SECRETACCESSKEY,
    },
    region: "us-east-1",
});
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
router.get("/task", middlware_1.authMiddleware, async (req, res) => {
    //@ts-ignore
    const taskId = req.query.taskId;
    //@ts-ignore
    const userId = req.userId;
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
    const result = {};
    taskDetails.options.forEach((option) => {
        result[option.id] = {
            count: 0,
            option: {
                image_url: option.image_url,
            },
        };
    });
    responses.forEach((r) => {
        result[r.option_id].count++;
    });
    res.json({
        result,
    });
});
router.post("/task", middlware_1.authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parseData = types_1.createTaskInput.safeParse(body);
    if (!parseData.success) {
        return res.status(411).json({ messsage: "You've sent the wrong inputs" });
    }
    let response = await prismaClient.$transaction(async (tx) => {
        const response = await tx.task.create({
            data: {
                title: parseData.data.title ?? DEFAULT_TITLE,
                amount: "1",
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
router.get("/presignedUrl", middlware_1.authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const { url, fields } = await (0, s3_presigned_post_1.createPresignedPost)(s3Client, {
        Bucket: "decenteralised-fiverrr",
        Key: `fiver/${userId}/${Math.random()}/image.jpg`,
        Conditions: [["content-length-range", 0, 5 * 1024 * 1024]],
        Fields: {
            "Content-Type": "image/png",
        },
        Expires: 3600,
    });
    console.log({ url, fields });
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
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser.id,
        }, __1.jwtSecret);
        res.json({ token });
    }
    else {
        const user = await prismaClient.user.create({
            data: {
                address: hardCodedWalletAddress,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, __1.jwtSecret);
        res.json({ token });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map