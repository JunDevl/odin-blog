export const HEADERS: HeadersInit = {
  'authorization': `Bearer ${localStorage.getItem("jwt")}`,
  'content-type': "application/json"
}

export const loginUser = async (auth: FormData) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users/auth`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(Object.fromEntries(auth))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { jwt } = await fetched.json() as { jwt: string };

  localStorage.setItem("jwt", jwt);

  return jwt;
}

export const createUser = async (newUser: FormData) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(Object.fromEntries(newUser))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { jwt } = await fetched.json() as { jwt: string };

  localStorage.setItem("jwt", jwt);

  return jwt;
}