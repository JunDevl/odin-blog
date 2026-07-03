import { Router } from "express";
import passport from "passport";

const usersRouter = Router();

usersRouter.route("/")
  .post(() => {}) // create user
  .delete(() => {}) // delete user
  .put(() => {}) // update user

usersRouter.route("auth")
  .get(passport.authenticate("local", { // log-in
    failureMessage: "Failed to log-in."
  }))
  .delete((req, res, next) => { // log-out
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/log-in");
    });
  })

export default usersRouter;