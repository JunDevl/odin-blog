import type { RequestHandler } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import { handleError, PromiseError } from "@packages/utils";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../prisma.ts";

const createUserValidator: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty(),
  body("email")
    .trim()
    .isEmail()
    .notEmpty(),
  body("password")
    .trim()
    .notEmpty()
]

export const createUser: (RequestHandler | ValidationChain[])[] = [
  createUserValidator,
  async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) return res.status(400).send(validationErrors.array());

    const user = req.body;

    const hashedPassword = await argon2.hash(user.password, {
      memoryCost: 65536,
      parallelism: 4,
      timeCost: 5
    })

    user.password = hashedPassword;

    const createdUser = await handleError(prisma.user.create({
      data: user
    }));

    if (createdUser instanceof PromiseError) return res.status(400).send(createdUser.error);
    
    jwt.sign(createdUser, process.env["SECRET_KEY"]!, {expiresIn: "7d"}, (err, token) => {
      if (err) return res.status(400).send(err);

      res.json({jwt: token}); // frontend will recieve jwt token so it can be stored on LocalStorage
    })
  }
]