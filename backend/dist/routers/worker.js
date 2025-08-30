"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKER_JWT_SECRET = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const middlware_1 = require("../middlware");
exports.WORKER_JWT_SECRET = __1.jwtSecret + "worker";
const prismaClient = new client_1.PrismaClient();
const router = (0, express_1.Router)();
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
router.get("/nextTask", middlware_1.workerMiddleware, (req, res) => {
    //@ts-ignore
    const userId = req.userId;
});
exports.default = router;
//# sourceMappingURL=worker.js.map