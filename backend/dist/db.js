"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextTask = void 0;
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
const getNextTask = async (userId) => {
    const task = await prismaClient.task.findFirst({
        where: {
            done: false,
            submissions: {
                none: {
                    worker_id: userId,
                },
            },
        },
        select: {
            id: true,
            amount: true,
            title: true,
            options: true,
        },
    });
    return task;
};
exports.getNextTask = getNextTask;
//# sourceMappingURL=db.js.map