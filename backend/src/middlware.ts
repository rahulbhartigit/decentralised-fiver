import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";
import { jwtSecret } from ".";
import { WORKER_JWT_SECRET } from "./routers/worker";

// declare module "express-serve-static-core" {
//   interface Request {
//     userId?: string;
//   }
// }

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      address: string;
    };
    //@ts-ignore

    if (decoded.userId) {
      //@ts-ignore
      req.userId = decoded.userId;
      return next();
    } else {
      return res.status(403).json({ message: "You are not logged in" });
    }
  } catch (e) {
    return res.status(403).json({ message: "You are not logged in" });
  }
}

export function workerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    const decoded = jwt.verify(token, WORKER_JWT_SECRET) as {
      id: string;
      address: string;
    };
    //@ts-ignore

    if (decoded.userId) {
      //@ts-ignore
      req.userId = decoded.userId;
      return next();
    } else {
      return res.status(403).json({ message: "You are not logged in" });
    }
  } catch (e) {
    return res.status(403).json({ message: "You are not logged in" });
  }
}
