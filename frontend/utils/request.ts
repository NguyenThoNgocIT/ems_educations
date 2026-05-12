import axios, { AxiosRequestConfig } from "axios";

// 1. Lấy URL từ file .env.local (mình sẽ tạo ở bước 2)
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api";

const request = axios.create({
  baseURL,
  timeout: 10000, // Hủy request nếu server 7001 không phản hồi sau 10s
});

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi hệ thống (mất mạng, server sập...)
    return Promise.reject(error);
  },
);

export type RequestOptions = AxiosRequestConfig;
export { request };
