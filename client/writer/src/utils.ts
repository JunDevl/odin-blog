import type { Post, User } from "@types";

export type PostResponse = Omit<Post, "createdAt"> & 
  { createdAt: string, author: User }