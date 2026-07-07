import type { RequestHandler } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import { handleError, PromiseError } from "@packages/utils";
import type { Comment, User } from "../../generated/prisma/client.ts";
import prisma from "../../lib/prisma.ts";

const createPostValidator: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty(),
  body("content")
    .trim()
    .notEmpty(),
  body("visibility")
    .trim()
    .notEmpty()
]

export const createPost: (RequestHandler | ValidationChain[])[] = [
  createPostValidator,
  async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) return res.status(400).send(validationErrors.array());

    const user = req.user as User;

    if (user.kind !== "admin") return res.status(403).send("Readers aren't allowed to create posts.");

    const post = req.body;

    const createdPost = await handleError(prisma.post.create({ data: post }));

    if (createdPost instanceof PromiseError) return res.status(400).send(createdPost.error);

    return res.sendStatus(201);
  }
]

export const deletePost: RequestHandler = async (req, res, next) => {
  const user = req.user as User;

  if (user.kind !== "admin") return res.status(403).send("Readers aren't allowed to delete posts.");

  const id = String(req.params.postID);

  const deletedPost = await handleError(prisma.post.delete({ where: { id } }));

  if (deletedPost instanceof PromiseError) return res.status(400).send(deletedPost.error);

  return res.sendStatus(200);
}

export const getPost: RequestHandler = async (req, res, next) => {
  const id = String(req.params.postID);

  const post = await handleError(prisma.post.findUnique({
    where: { id }
  }))

  if (post instanceof PromiseError) return res.status(400).send(post.error);

  return res.json(post);
}

export const getPosts: RequestHandler = async (req, res, next) => {
  const filter = req.query;

  const posts = await prisma.post.findMany({
    orderBy: {
      title: "asc"
    }
  })

  if (posts instanceof PromiseError) return res.status(400).send(posts.error);

  return res.json(posts);
}

const createCommentValidator: ValidationChain[] = [
  body("content")
    .trim()
    .notEmpty()
]

export const createComment: (RequestHandler | ValidationChain[])[] = [
  createCommentValidator,
  async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) return res.status(400).send(validationErrors.array());

    const comment = req.body;

    const createdComment = await handleError(prisma.comment.create({ data: comment }));

    if (createdComment instanceof PromiseError) return res.status(400).send(createdComment.error);

    return res.sendStatus(201);
  }
]

const updateCommentValidator: ValidationChain[] = [
  ...createCommentValidator,
  body("id")
    .trim()
    .isUUID()
    .notEmpty()
]

export const updateComment: (RequestHandler | ValidationChain[])[] = [
  updateCommentValidator,
  async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) return res.status(400).send(validationErrors.array());

    const { id, content } = req.body as Comment;

    const user = req.user as User;
    const author = await handleError(prisma.comment.findUnique({ where: { id }, select: { authorId: true } }))

    if (author instanceof PromiseError) return res.status(400).send(author.error);

    if (!author) return res.sendStatus(404);

    if (user.kind !== "admin" && user.id !== author.authorId) // User isn't an admin and doesn't own resource
      return res.status(403).send("You can't update the specified comment.");

    const updatedComment = await handleError(prisma.$executeRaw`
      UPDATE "Comments"
      SET content = ${content},
          editedAt = DEFAULT
      WHERE id = ${id}
    `);

    if (updatedComment instanceof PromiseError) return res.status(400).send(updatedComment.error);

    return res.sendStatus(200);
  }
]

export const deleteComment: RequestHandler = async (req, res, next) => {
  const id = String(req.params.commentID);

  const user = req.user as User;
  const author = await handleError(prisma.comment.findUnique({ where: { id }, select: { authorId: true } }))

  if (author instanceof PromiseError) return res.status(400).send(author.error);

  if (!author) return res.sendStatus(404);

  if (user.kind !== "admin" && user.id !== author.authorId) // User isn't an admin and doesn't own resource
    return res.status(403).send("You can't delete the specified comment.");

  const deletedComment = await handleError(prisma.comment.delete({ where: { id } }));

  if (deletedComment instanceof PromiseError) return res.status(400).send(deletedComment.error);

  return res.sendStatus(200);
}

export const getPostComments: RequestHandler = async (req, res, next) => {
  const filter = req.query;
  const postID = String(req.params.postID);

  const comments = await prisma.comment.findMany({
    where: {
      originPostId: postID
    },
    orderBy: {
      createdAt: "asc"
    }
  })

  if (comments instanceof PromiseError) return res.status(400).send(comments.error);

  return res.json(comments);
}