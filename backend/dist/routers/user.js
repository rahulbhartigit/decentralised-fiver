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
const worker_1 = require("./worker");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const web3_js_1 = require("@solana/web3.js");
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const connection = new web3_js_1.Connection(process.env.RPC_URL ?? "");
const PARENT_WALLET_ADDRESS = "4wRWn5Hr45fQcEdG5zEoy39AEiCNURoYHqKKAiugUP4p";
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
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
                imageUrl: option.image_url,
            },
        };
    });
    responses.forEach((r) => {
        result[r.option_id].count++;
    });
    res.json({
        result,
        taskDetails,
    });
});
router.post("/task", middlware_1.authMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parseData = types_1.createTaskInput.safeParse(body);
    const user = await prismaClient.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!parseData.success) {
        return res.status(411).json({ messsage: "You've sent the wrong inputs" });
    }
    const transaction = await connection.getTransaction(parseData.data.payment_signature, {
        maxSupportedTransactionVersion: 1,
    });
    console.log(transaction);
    if ((transaction?.meta?.postBalances[1] ?? 0) -
        (transaction?.meta?.preBalances[1] ?? 0) !==
        100000000) {
        return res.status(411).json({
            message: "Transaction signature/amount incorrect",
        });
    }
    if (transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
        PARENT_WALLET_ADDRESS) {
        return res.status(411).json({
            message: "Transaction sent to wrong address",
        });
    }
    if (transaction?.transaction.message.getAccountKeys().get(0)?.toString() !==
        user?.address) {
        return res.status(411).json({
            message: "Transaction sent to wrong address",
        });
    }
    let response = await prismaClient.$transaction(async (tx) => {
        const response = await tx.task.create({
            data: {
                title: parseData.data.title ?? DEFAULT_TITLE,
                amount: 1 * worker_1.TOTAL_DECIMALS,
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
        Conditions: [["content-length-range", 0, 5 * 1024 * 1024]], //5 MB MAX
        Expires: 3600,
    });
    res.json({
        preSignedUrl: url,
        fields,
    });
});
router.post("/signin", async (req, res) => {
    const { publicKey, signature } = req.body;
    const signedString = "Sign into the matrix of labelling";
    const message = new TextEncoder().encode("Sign into the matrix of labelling");
    const result = tweetnacl_1.default.sign.detached.verify(message, new Uint8Array(signature.data), new web3_js_1.PublicKey(publicKey).toBytes());
    console.log(result);
    const existingUser = await prismaClient.user.findFirst({
        where: {
            address: publicKey,
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
                address: publicKey,
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