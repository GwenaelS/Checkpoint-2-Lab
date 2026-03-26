import argon2 from "argon2";
import dotenv from "dotenv";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

dotenv.config();

const login: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      res.status(400).json({ information: "Informations incomplete" });
      return;
    }

    const doesUserExist = await userRepository.readEmail(req.body.email);
    if (!doesUserExist) {
      res.status(404).json({ information: "User not found" });
      return;
    }

    const userPassword = argon2.verify(
      doesUserExist.password,
      req.body.password,
    );
    if (!userPassword) {
      res.status(400).json({ information: "Credentials incorrect" });
      return;
    }

    const secret = process.env.APP_SECRET;
    if (!secret) {
      res.status(500).json({ information: "Server error" });
      return;
    }

    const token = jwt.sign(
      {
        user_id: doesUserExist.id,
        user_email: doesUserExist.email,
        role: "user",
      },
      secret,
    );
    if (!token) {
      res.status(500).json({ information: "Server error" });
      return;
    }

    res.cookie("token", token);
    res.status(200).json({ information: "Login successfull" });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { login };
