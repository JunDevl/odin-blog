import type { RequestHandler } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import { handleError, PromiseError } from "@packages/utils";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../../lib/prisma.ts";
import type { User } from "../generated/prisma/client.ts";

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

    if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

    const newUser = req.body;

    const hashedPassword = await argon2.hash(newUser.password, {
      memoryCost: 65536,
      parallelism: 4,
      timeCost: 5
    })

    newUser.password = hashedPassword;
    newUser.kind = "reader"; // default

    const createdUser = await handleError(prisma.user.create({ data: newUser }));

    if (createdUser instanceof PromiseError) return res.status(400).json(createdUser.error);
    
    jwt.sign(createdUser, process.env["SECRET_KEY"]!, {expiresIn: "7d"}, (err, token) => {
      if (err) return res.status(400).send(err);

      res.status(201).json({
        jwt: token
      }); // frontend will recieve jwt token so it can be stored on LocalStorage
    })
  }
]

export const getUser: RequestHandler = async (req, res) => {
  res.json(req.user);
}

const updateUserValidator: ValidationChain[] = [
  body("name")
    .trim(),
  body("email")
    .trim()
    .isEmail(),
  body("password")
    .trim()
]


export const updateUser: (RequestHandler | ValidationChain[])[] = [
  updateUserValidator,
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

    const updateUser = req.body;

    if (updateUser.password) {
      const hashedPassword = await argon2.hash(updateUser.password, {
        memoryCost: 65536,
        parallelism: 4,
        timeCost: 5
      })

      updateUser.password = hashedPassword;
    }

    const id = String(req.params.userId);

    const updatedUser = await prisma.user.update({
      data: updateUser,
      where: { id }
    })

    if (updatedUser instanceof PromiseError) return res.status(400).json(updatedUser.error);

    jwt.sign(updatedUser, process.env["SECRET_KEY"]!, {expiresIn: "7d"}, (err, token) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({
        jwt: token
      }); // frontend will recieve jwt token so it can be stored on LocalStorage
    })
  }
]

export const deleteUser: RequestHandler = async (req, res) => {
  const id = String(req.params.userId);

  const deletedUser = await prisma.user.delete({
    where: { id }
  })

  if (deletedUser instanceof PromiseError) return res.status(400).json(deletedUser.error);

  return res.sendStatus(200);
}

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



  {
    "user": {
        "id": "62880c91-a3db-457c-b19c-32c7f221cddb",
        "name": "Juninho Pedone",
        "email": "juninhoplay.pedone@gmail.com",
        "password": "$argon2id$v=19$m=65536,t=5,p=4$L2/dwP/tyeDFclz4v7IZ0A$Ak1wztmxBCz7lqW//6ctDMJwjVz61usFWzmILVF9M8I",
        "kind": "admin"
    },
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODgwYzkxLWEzZGItNDU3Yy1iMTljLTMyYzdmMjIxY2RkYiIsIm5hbWUiOiJKdW5pbmhvIFBlZG9uZSIsImVtYWlsIjoianVuaW5ob3BsYXkucGVkb25lQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTUscD00JEwyL2R3UC90eWVERmNsejR2N0laMEEkQWsxd3p0bXhCQ3o3bHFXLy82Y3RETUp3alZ6NjF1c0ZXem1JTFZGOU04SSIsImtpbmQiOiJyZWFkZXIiLCJpYXQiOjE3ODM0NjUzMjEsImV4cCI6MTc4NDA3MDEyMX0.tGp9yoN_yXRz5X3IapZAaiuRYKrTuUixC-chO61MT5Q"
  }
*/