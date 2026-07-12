import type { Comment, Post, User } from "@types";

export type PostResponse = Omit<Post, "createdAt"> & 
  { createdAt: string, author: { name: string } }

export type CommentResponse = Omit<Comment, "createdAt" | "editedAt"> & 
  { createdAt: string, editedAt: string, author: { name: string } }

export type UserResponse = Pick<User, "email" | "name">