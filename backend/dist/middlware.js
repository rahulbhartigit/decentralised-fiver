"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.workerMiddleware = workerMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _1 = require(".");
const worker_1 = require("./routers/worker");
// declare module "express-serve-static-core" {
//   interface Request {
//     userId?: string;
//   }
// }
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    // Expect format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization header" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, _1.jwtSecret);
        //@ts-ignore
        if (decoded.userId) {
            //@ts-ignore
            req.userId = decoded.userId;
            return next();
        }
        else {
            return res.status(403).json({ message: "You are not logged in" });
        }
    }
    catch (e) {
        return res.status(403).json({ message: "You are not logged in" });
    }
}
function workerMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    // Expect format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization header" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, worker_1.WORKER_JWT_SECRET);
        //@ts-ignore
        if (decoded.userId) {
            //@ts-ignore
            req.userId = decoded.userId;
            return next();
        }
        else {
            return res.status(403).json({ message: "You are not logged in" });
        }
    }
    catch (e) {
        return res.status(403).json({ message: "You are not logged in" });
    }
}
//# sourceMappingURL=middlware.js.map