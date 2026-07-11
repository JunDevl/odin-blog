import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { Comment, Post, User } from "@types";

const POST_HEADERS: HeadersInit = {
  'content-type': "application/json"
}

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
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts`);

  if (!fetched.ok) throw new Error(await fetched.json());

  const posts: (Post & { author: User })[] = await fetched.json();

  return posts;
}

export const fetchPostComments = async (postId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments`);

  if (!fetched.ok) throw new Error(await fetched.json());

  const comments: (Comment & { author: User })[] = await fetched.json();

  return comments;
}

export const createPostComment = async (data: FormData, postId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments`, {
    method: "POST",
    headers: POST_HEADERS,
    body: data
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  return ok;
}

export const updatePostComment = async (data: FormData, postId: number, commentId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: POST_HEADERS,
    body: data
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  return ok;
}

export const deletePostComment = async (postId: string, commentId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: POST_HEADERS
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  return ok;
}