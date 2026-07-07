import type { RequestHandler } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import { handleError, PromiseError } from "@packages/utils";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../../lib/prisma.ts";

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
    user.kind = "reader"; // default

    const createdUser = await handleError(prisma.user.create({ data: user }));

    if (createdUser instanceof PromiseError) return res.status(400).send(createdUser.error);
    
    jwt.sign(createdUser, process.env["SECRET_KEY"]!, {expiresIn: "7d"}, (err, token) => {
      if (err) return res.status(400).send(err);

      res.status(201).json({
        user: createdUser,
        jwt: token
      }); // frontend will recieve jwt token so it can be stored on LocalStorage
    })
  }
]

/* 
  {
    "user": {
        "id": "1a180aa3-3a87-40bb-a52c-263e15bf5401",
        "name": "Aroldo Medina",
        "email": "aroldo.medina@gmail.com",
        "password": "$argon2id$v=19$m=65536,t=5,p=4$WKm5gDnh5ZsBxoCvofxYCg$cw8xJn8oCpwKKll+PxJGDtpReJcQPDwRIPX8e6VBZLU",
        "kind": "reader"
    },
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMTgwYWEzLTNhODctNDBiYi1hNTJjLTI2M2UxNWJmNTQwMSIsIm5hbWUiOiJBcm9sZG8gTWVkaW5hIiwiZW1haWwiOiJhcm9sZG8ubWVkaW5hQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTUscD00JFdLbTVnRG5oNVpzQnhvQ3ZvZnhZQ2ckY3c4eEpuOG9DcHdLS2xsK1B4SkdEdHBSZUpjUVBEd1JJUFg4ZTZWQlpMVSIsImtpbmQiOiJyZWFkZXIiLCJpYXQiOjE3ODMzODM2MTQsImV4cCI6MTc4Mzk4ODQxNH0.A7hKI_26k12858oRnfwvejs7dA-IvQXysZSDkPy-CQ4"
  }
*/