"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTAL_DECIMALS = exports.WORKER_JWT_SECRET = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET ?? "rahul123";
exports.WORKER_JWT_SECRET = exports.JWT_SECRET + "worker";
exports.TOTAL_DECIMALS = 1000_000;
// 1/1000_000_000_000_000_000
//# sourceMappingURL=config.js.map