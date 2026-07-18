import { Router, type RequestHandler } from "express";

import passport from "passport";
import { JWTProtectedRoute } from "../auth.ts";

import { createComment, createPost, deleteComment, deletePost, getPost, getPostComments, getPosts, updateComment, updatePost } from "../controllers/postsController.ts";

const postsRouter = Router();

postsRouter.use(JWTProtectedRoute);

postsRouter.route("/")
  .get(getPosts)
  .post(createPost as RequestHandler[]);

postsRouter.route("/:postID")
  .get(getPost)
  .delete(deletePost)
  .put(updatePost as RequestHandler[]);

postsRouter.route("/:postID/comments")
  .get(getPostComments)
  .post(createComment as RequestHandler[]);

postsRouter.route("/:postID/comments/:commentID")
  //.get(() => {}) // get post comment
  .delete(deleteComment) // delete post comment
  .put(updateComment as RequestHandler[]); // update post comment

export default postsRouter;