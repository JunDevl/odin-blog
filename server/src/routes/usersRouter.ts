import { Router, type RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { createUser } from "../controllers/usersController.ts";
import type { User } from "../generated/prisma/client.ts";

const usersRouter = Router();

usersRouter.route("/")
  .post(createUser as RequestHandler[])
  //.delete(() => {}) // delete user
  //.put(() => {}) // update user

usersRouter.route("/auth")
  .get((req, res, next) => {
    passport.authenticate(
      "local", 
      { session: false }, 
      (err: string, user: User, info: any, status: string) => {
        if (err) return res.status(400).send(info);

        if (!user) return res.status(404).send(info);

        jwt.sign(user, process.env["SECRET_KEY"]!, {expiresIn: "7d"}, (err, token) => {
          if (err) return res.status(400).send(err);
    
          res.status(201).json({
            user: user,
            jwt: token
          }); // frontend will recieve jwt token so it can be stored on LocalStorage
        })
      }
    )(req, res, next)
  })

export default usersRouter;