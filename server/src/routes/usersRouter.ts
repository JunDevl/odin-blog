import { Router, type RequestHandler } from "express";
import { createUser } from "../controllers/usersController.ts";

const usersRouter = Router();

usersRouter.route("/")
  .post(createUser as RequestHandler[])
  //.delete(() => {}) // delete user
  //.put(() => {}) // update user

export default usersRouter;