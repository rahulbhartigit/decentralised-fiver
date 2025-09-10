"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecret = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routers/user"));
const worker_1 = __importDefault(require("./routers/worker"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
// const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"];
app.use((0, cors_1.default)());
exports.jwtSecret = process.env.JWT_SECRET || "default";
app.use("/v1/user", user_1.default);
app.use("/v1/worker", worker_1.default);
app.listen(3000);
//# sourceMappingURL=index.js.map