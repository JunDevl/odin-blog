import type { Comment, Post, User } from "@types";

export type PostResponse = Omit<Post, "createdAt"> & 
  { createdAt: string, author: { name: string } }

export type CommentResponse = Omit<Comment, "createdAt" | "editedAt"> & 
  { createdAt: string, editedAt: string | null, author: { name: string }, owned: boolean }

export type UserResponse = Pick<User, "email" | "name">