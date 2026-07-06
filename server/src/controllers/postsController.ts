import type { RequestHandler } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import { handleError, PromiseError } from "@packages/utils";
import prisma from "../prisma.ts";

export const createPost: (RequestHandler | ValidationChain[])[] = [
  async (req, res, next) => {


    return res.send();
  }
]

export const getAllPosts: RequestHandler = async (req, res, next) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      title: "asc"
    }
  })

  return res.json();
}