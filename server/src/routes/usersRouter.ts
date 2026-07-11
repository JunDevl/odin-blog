import { Router, type RequestHandler } from "express";

import passport from "passport";
import jwt from "jsonwebtoken";
import { JWTProtectedRoute } from "../auth.ts";

import { createUser, deleteUser, getUser, updateUser } from "../controllers/usersController.ts";

import type { User } from "../generated/prisma/client.ts";

const usersRouter = Router();

usersRouter.route("/")
  .post(createUser as RequestHandler[]);

usersRouter.route("/:userId")
  .all(JWTProtectedRoute)
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser as RequestHandler[]);

usersRouter.route("/auth")
  .get((req, res) => {
    const token = String(req.headers.authorization).split(" ")[1]!;

    jwt.verify(token, process.env["SECRET_KEY"]!, (err, payload) => {
      if (err) return res.status(400).send(err);

      if (!payload) return res.status(404).sendStatus(404);

      const { id } = payload as User;

      res.redirect(`users/${id}`);
    })
  })
  .post((req, res, next) => { // log-in and create new JWT
    passport.authenticate(
      "local", 
      { session: false }, 
      (err: string, user: User, info: any, status: string) => {
        if (err) return res.status(400).send(info);

        if (!user) return res.status(404).send(info);

        jwt.sign(user, process.env["SECRET_KEY"]!, {expiresIn: "7d"}, (err, token) => {
          if (err) return res.status(400).send(err);
    
          res.status(201).json({
            jwt: token
          }); // frontend will recieve jwt token so it can be stored on LocalStorage
        })
      }
    )(req, res, next)
  })

export default usersRouter;