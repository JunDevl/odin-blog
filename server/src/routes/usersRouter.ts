import { Router } from "express";
import passport from "passport";
import { createUser } from "../controllers/usersController.ts";

const usersRouter = Router();

usersRouter.route("/")
  .post(createUser as any)
  .delete(() => {}) // delete user
  .put(() => {}) // update user

usersRouter.route("auth")
  .get(passport.authenticate(
    "jwt", 
    { // log-in
      session: false,
      failureMessage: "Failed to log-in."
    },
    (_: any, res: any) => {
      res.sendStatus(200);
    }
  ))
  .delete((req, res, next) => { // TODO: log-out
    req.logout((err) => {
      // if (err) return next(err);
      // res.redirect("/log-in");
    });
  })

export default usersRouter;