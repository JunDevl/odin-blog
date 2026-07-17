import type { PostResponse } from "./utils";
import type { User } from "@types";
import { headers } from "@shared/actions";

export const fetchUserPosts = async () => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts?owned=true`, {
    headers: headers()
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const posts: PostResponse[] = await fetched.json();

  return posts;
}

export const createPost = async (newPost: FormData) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(Object.fromEntries(newPost))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  return ok;
}

export const updatePost = async (updatedPost: FormData, postID: number) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/posts/${postID}`, {
    headers: headers(),
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(updatedPost))
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  return ok;
}

export const deletePosts = async (postsID: number[]) => {
  const fetched = await fetch(`${
    import.meta.env["VITE_API_URI"]!}/posts?${postsID.reduce((prev, acc) => `${prev && `${prev}&`}id=${acc}`, "")}`, {
    headers: headers(),
    method: "DELETE"
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const ok = await fetched.text();

  return ok;
}

export const fetchUser = async () => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users/auth`, {
    headers: headers()
  });

  if (!fetched.ok) throw new Error(await fetched.json());

  const user: User = await fetched.json();

  return user;
}