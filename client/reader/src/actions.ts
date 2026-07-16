import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { PostResponse, CommentResponse, UserResponse } from "./utils";
import { HEADERS } from "../../shared/actions";

// const QUERIES: Record<string, UseSuspenseQueryOptions> = {
//   posts: {
//     queryKey: ["posts"],
//     queryFn: () => fetchPosts(),
//   },
//   comments: {
//     queryKey: ["comments"],
//     queryFn: () => fetchPostComments(),
//   }
// }

export const fetchPosts = async () => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts`, {
    headers: HEADERS
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const posts: PostResponse[] = await fetched.json();

  return posts;
}

export const fetchPostComments = async (postId: number) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts/${postId}/comments`, {
    headers: HEADERS
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const comments: CommentResponse[] = await fetched.json();

  return comments;
}

export const createPostComment = async (newComment: FormData, postId: number) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts/${postId}/comments`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(Object.fromEntries(newComment))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  return ok;
}

export const updatePostComment = async (updatedComment: FormData, postId: number, commentId: number) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(Object.fromEntries(updatedComment))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  return ok;
}

export const deletePostComment = async (postId: number, commentId: number) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: HEADERS
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  return ok;
}

export const fetchUser = async () => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users/auth`, {
    headers: HEADERS
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const user: UserResponse = await fetched.json();

  return user;
}

export const updateUser = async (updatedUser: FormData, userId: string) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users/${userId}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(Object.fromEntries(updatedUser))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { jwt } = await fetched.json() as { jwt: string };

  localStorage.setItem("jwt", jwt);

  return jwt;
}

export const deleteUser = async (userId: string) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users/${userId}`, {
    method: "DELETE",
    headers: HEADERS
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  localStorage.removeItem("jwt");

  return ok;
}