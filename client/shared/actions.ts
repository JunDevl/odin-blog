export const headers: () => HeadersInit = () => ({
  'authorization': `Bearer ${localStorage.getItem("jwt")}`,
  'content-type': "application/json"
})

export const loginUser = async (auth: FormData, admin?: boolean) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users/auth`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(Object.fromEntries(auth))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { kind, jwt } = await fetched.json() as { kind: "reader" | "admin", jwt: string };

  if (admin && kind !== "admin") return { kind, jwt };

  localStorage.setItem("jwt", jwt);

  return { kind, jwt };
}

export const createUser = async (newUser: FormData) => {
  const fetched = await fetch(`${import.meta.env["VITE_API_URI"]!}/users`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(Object.fromEntries(newUser))
  })

  if (!fetched.ok) throw new Error(await fetched.json());

  const { kind, jwt } = await fetched.json() as { kind: "admin" | "reader", jwt: string };

  localStorage.setItem("jwt", jwt);

  return { kind, jwt };
}