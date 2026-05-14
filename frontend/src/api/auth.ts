import { request } from "@/utils/request";

export async function authLogin(body: {
  username?: string;
  email?: string;
  password: string;
}) {
  return request.post('/api/auth/login', body);
}

export default request;
