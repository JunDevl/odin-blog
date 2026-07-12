import type { RequestHandler } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import { handleError, PromiseError } from "@packages/utils";
import type { Comment, Post, User } from "../../generated/prisma/client.ts";
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

    if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

    const user = req.user as User;

    if (user.kind !== "admin") return res.status(403).send("Readers aren't allowed to create posts.");

    const post: Post = req.body;

    post.authorId = user.id;

    const createdPost = await handleError(prisma.post.create({ data: post }));

    if (createdPost instanceof PromiseError) return res.status(400).json(createdPost.error);

    return res.sendStatus(201);
  }
]

export const deletePost: RequestHandler = async (req, res, next) => {
  const user = req.user as User;

  if (user.kind !== "admin") return res.status(403).send("Readers aren't allowed to delete posts.");

  const id = Number(req.params.postID);

  const deletedPost = await handleError(prisma.post.delete({ where: { id } }));

  if (deletedPost instanceof PromiseError) return res.status(400).json(deletedPost.error);

  return res.sendStatus(200);
}

export const getPost: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.postID);

  const user = req.user as User;

  const post = await handleError(user.kind !== "admin" ? 
    prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
        createdAt: true,
        author: { 
          select: { name: true }
        }
      }
    }) :
    prisma.post.findUnique({
      where: { id },
      include: { author: true }
    })
  )

  if (post instanceof PromiseError) return res.status(400).json(post.error);

  return res.json(post);
}

export const getPosts: RequestHandler = async (req, res, next) => {
  const filter = req.query;

  const user = req.user as User;

  const posts = await handleError(user.kind !== "admin" ? 
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        content: true,
        createdAt: true,
        author: { 
          select: { name: true }
        }
      }
    }) :
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true }
    })
  )

  if (posts instanceof PromiseError) return res.status(400).json(posts.error);

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

    if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

    const user: User = req.user as User;

    const comment: Comment = req.body;

    comment.authorId = user.id;
    comment.originPostId = Number(req.params.postID);

    const createdComment = await handleError(prisma.comment.create({ data: comment }));

    if (createdComment instanceof PromiseError) return res.status(400).json(createdComment.error);

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

    if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

    const { id, content } = req.body as Comment;

    const user = req.user as User;
    const author = await handleError(prisma.comment.findUnique({ where: { id }, select: { authorId: true } }))

    if (author instanceof PromiseError) return res.status(400).json(author.error);

    if (!author) return res.sendStatus(404);

    if (user.kind !== "admin" && user.id !== author.authorId) // User isn't an admin and doesn't own resource
      return res.status(403).send("You can't update the specified comment.");

    const updatedComment = await handleError(prisma.$executeRaw`
      UPDATE "Comments"
      SET content = ${content},
          editedAt = DEFAULT
      WHERE id = ${id}
    `);

    if (updatedComment instanceof PromiseError) return res.status(400).json(updatedComment.error);

    return res.sendStatus(200);
  }
]

export const deleteComment: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.commentID);

  const user = req.user as User;
  const author = await handleError(prisma.comment.findUnique({ where: { id }, select: { authorId: true } }))

  if (author instanceof PromiseError) return res.status(400).json(author.error);

  if (!author) return res.sendStatus(404);

  if (user.kind !== "admin" && user.id !== author.authorId) // User isn't an admin and doesn't own resource
    return res.status(403).send("You can't delete the specified comment.");

  const deletedComment = await handleError(prisma.comment.delete({ where: { id } }));

  if (deletedComment instanceof PromiseError) return res.status(400).json(deletedComment.error);

  return res.sendStatus(200);
}

export const getPostComments: RequestHandler = async (req, res, next) => {
  const filter = req.query;

  const postID = Number(req.params.postID);

  const user = req.user as User;

  const comments = await handleError(user.kind !== "admin" ? 
    prisma.comment.findMany({
      where: { originPostId: postID },
      orderBy: { createdAt: "desc" },
      select: {
        content: true,
        createdAt: true,
        editedAt: true,
        author: {
          select: { id: true, name: true }
        }
      }
    }) :
    prisma.comment.findMany({
      where: { originPostId: postID },
      orderBy: { createdAt: "desc" },
      include: { author: true }
    })
  ) as PromiseError<any> | (User & { owned?: boolean, author: { id?: string, name: string } })[]

  if (comments instanceof PromiseError) return res.status(400).json(comments.error);

  comments.map((comment) => {
    const authorID = comment.author.id;

    if (user.kind !== "admin") delete comment.author.id;

    if (authorID === user.id) {
      comment.owned = true;
      return comment;
    }

    comment.owned = false;

    return comment;
  })

  return res.json(comments);
}