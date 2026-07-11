import { Router, type RequestHandler } from "express";

import passport from "passport";
import { JWTProtectedRoute } from "../auth.ts";

import { createComment, createPost, deleteComment, deletePost, getPost, getPostComments, getPosts, updateComment } from "../controllers/postsController.ts";

const postsRouter = Router();
const commentsRouter = Router();

postsRouter.use(JWTProtectedRoute);

postsRouter.route("/")
  .get(getPosts)
  .post(createPost as RequestHandler[])

postsRouter.route("/:postID")
  .get(getPost)
  .delete(deletePost)

postsRouter.use("/:postID/comments", commentsRouter);

commentsRouter.route("/")
  .get(getPostComments)
  .post(createComment as RequestHandler[])

commentsRouter.route("/:commentID")
  //.get(() => {}) // get post comment
  .delete(deleteComment) // delete post comment
  .put(updateComment as RequestHandler[]) // update post comment

export default postsRouter;