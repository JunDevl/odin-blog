import { Router } from "express";

const postsRouter = Router();
const commentsRouter = Router();

postsRouter.route("/")
  .get(() => {}) // get all posts
  .post(() => {}) // create post

postsRouter.route("/:postID")
  .get(() => {}) // get post
  .delete(() => {}) // delete post
  .put(() => {}) // update post

postsRouter.use("/:postID/comments", commentsRouter);

postsRouter.route("/")
  .get(() => {}) // get all post comments
  .post(() => {}) // create post comment

postsRouter.route("/:commentID")
  .get(() => {}) // get post comment
  .delete(() => {}) // delete post comment
  .put(() => {}) // update post comment

export default postsRouter;