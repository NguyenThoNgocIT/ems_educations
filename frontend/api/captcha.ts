import axios from "axios";

export async function getCaptchaImg(baseUrl: string) {
  const res = await axios.get(`${baseUrl}/api/auth/captcha/img`);
  return res.data; 
}
