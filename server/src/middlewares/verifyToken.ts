import dotenv from "dotenv";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../modules/user/userRepository";
import type { TUser } from "../types/TUser";

dotenv.config();

export interface AuthRequest extends Request {
  user?: TUser;
}

export const verifyToken: RequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(404).json({ information: "Token not found" });
      return;
    }

    const secret = process.env.APP_SECRET;
    if (!secret) {
      res.status(500).json({ information: "Server error" });
      return;
    }

    const tokenDecode = jwt.verify(token, secret) as {
      user_id: string;
      user_email: string;
      role: string;
    };
    if (!tokenDecode) {
      res.status(400).json({ information: "Token error" });
      return;
    }

    const doesUserExist = await userRepository.readEmail(
      tokenDecode.user_email,
    );
    if (!doesUserExist) {
      res.status(400).json({ information: "User not found" });
    }

    req.user = doesUserExist;
    next();
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
