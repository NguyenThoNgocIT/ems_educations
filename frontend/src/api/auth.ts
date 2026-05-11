import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export async function authLogin(body: {
  username?: string;
  email?: string;
  password: string;
}) {
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
