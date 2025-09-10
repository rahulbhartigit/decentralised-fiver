"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTAL_DECIMALS = exports.WORKER_JWT_SECRET = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const middlware_1 = require("../middlware");
const db_1 = require("../db");
const types_1 = require("../types");
exports.WORKER_JWT_SECRET = __1.jwtSecret + "worker";
exports.TOTAL_DECIMALS = 1000_000;
const TOTAL_SUBMISSIONS = 100;
const prismaClient = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post("/payout", middlware_1.workerMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const worker = await prismaClient.worker.findFirst({
        where: {
            id: Number(userId),
        },
    });
    if (!worker) {
        return res.status(403).json({
            message: "User not found",
        });
    }
    const address = worker.address;
    const txnId = "0x123123112";
    //Add a lock here
    await prismaClient.$transaction(async (tx) => {
        await tx.worker.update({
            where: {
                id: Number(userId),
            },
            data: {
                pending_amount: {
                    decrement: worker.pending_amount,
                },
                locked_amount: {
                    increment: worker.pending_amount,
                },
            },
        });
        await tx.payouts.create({
            data: {
                user_id: Number(userId),
                amount: worker.pending_amount,
                status: "Processing",
                payment_signature: txnId,
            },
        });
    });
    res.json({
        message: "Processing payout",
        amount: worker.pending_amount,
    });
});
router.get("/balance", middlware_1.workerMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const worker = await prismaClient.worker.findFirst({
        where: {
            id: Number(userId),
        },
    });
    res.json({
        pendingAmount: worker?.pending_amount,
        lockedAmount: worker?.pending_amount,
    });
});
router.post("/submission", middlware_1.workerMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parsedBody = types_1.createSubmissionInput.safeParse(body);
    if (parsedBody.success) {
        const task = await (0, db_1.getNextTask)(Number(userId));
        if (!task || task?.id !== Number(parsedBody.data.taskId)) {
            return res.status(411).json({ message: "Incorrect task id" });
        }
        const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();
        const submission = await prismaClient.$transaction(async (tx) => {
            const submission = await tx.submission.create({
                data: {
                    option_id: Number(parsedBody.data.selection),
                    worker_id: userId,
                    task_id: Number(parsedBody.data.taskId),
                    amount,
                },
            });
            await tx.worker.update({
                where: {
                    id: userId,
                },
                data: {
                    pending_amount: {
                        increment: Number(amount),
                    },
                },
            });
            return submission;
        });
        const nextTask = await (0, db_1.getNextTask)(Number(userId));
        res.json({
            nextTask,
            amount,
        });
    }
    else {
        res.status(411).json({ message: "Incorrect Inputs" });
    }
});
router.post("/signin", async (req, res) => {
    const hardCodedWalletAddress = "4wRWn5Hr45fQcEdG5zEoy39AEiCNURoYHqKKAiugUP4a";
    const existingUser = await prismaClient.worker.findFirst({
        where: {
            address: hardCodedWalletAddress,
        },
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser.id,
        }, exports.WORKER_JWT_SECRET);
        res.json({ token });
    }
    else {
        const user = await prismaClient.worker.create({
            data: {
                address: hardCodedWalletAddress,
                pending_amount: 0,
                locked_amount: 0,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, exports.WORKER_JWT_SECRET);
        res.json({ token });
    }
});
router.get("/nextTask", middlware_1.workerMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const task = await (0, db_1.getNextTask)(Number(userId));
    if (!task) {
        res.status(411).json({
            message: "No more tasks left for you to review",
        });
    }
    else {
        res.json({
            task,
        });
    }
});
exports.default = router;
//# sourceMappingURL=worker.js.map