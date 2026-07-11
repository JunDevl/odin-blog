import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { Comment, Post, User } from "@types";

const HEADERS: HeadersInit = {
  'authorization': `Bearer ${localStorage.getItem("jwt")}`,
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
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts`, {
    headers: HEADERS
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const posts: (Post & { author: User })[] = await fetched.json();

  return posts;
}

export const fetchPostComments = async (postId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments`, {
    headers: HEADERS
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const comments: (Comment & { author: User })[] = await fetched.json();

  return comments;
}

export const createPostComment = async (data: FormData, postId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments`, {
    method: "POST",
    headers: HEADERS,
    body: data
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  return ok;
}

export const updatePostComment = async (data: FormData, postId: number, commentId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: HEADERS,
    body: data
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  return ok;
}

export const deletePostComment = async (postId: string, commentId: number) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: HEADERS
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  return ok;
}

export const fetchUser = async () => {
  const token = localStorage.getItem("jwt")!;

  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/users/auth?token=${token}`, {
    headers: HEADERS
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const user: User = await fetched.json();

  return user;
}

export const createUser = async (data: FormData) => {
  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/users`, {
    method: "POST",
    headers: HEADERS,
    body: data
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { jwt } = await fetched.json() as { jwt: string };

  localStorage.setItem("jwt", jwt);

  return jwt;
}

export const updateUser = async (data: FormData) => {
  const { id } = await fetchUser();

  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/users/${id}`, {
    method: "PUT",
    headers: HEADERS,
    body: data
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { jwt } = await fetched.json() as { jwt: string };

  localStorage.setItem("jwt", jwt);

  return jwt;
}

export const deleteUser = async () => {
  const { id } = await fetchUser();

  const fetched = await fetch(`${process.env["VITE_API_URL"]!}/users/${id}`, {
    method: "DELETE",
    headers: HEADERS
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.json();

  localStorage.removeItem("jwt");

  return ok;
}