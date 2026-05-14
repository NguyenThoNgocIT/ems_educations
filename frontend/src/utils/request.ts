import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // ✅ Thêm dòng này
});

// ✅ THÊM INTERCEPTOR ĐỂ GẮN TOKEN
request.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');
    
    console.log('🔑 Token từ localStorage:', token); // Kiểm tra xem có token không
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response.data as any,
  (error) => {
    // Xử lý lỗi 401 - Unauthorized
    if (error.response?.status === 401) {
      console.error('⚠️ Token hết hạn hoặc không hợp lệ');
      // Có thể redirect về login
      // window.location.href = '/dashboard/admin/signin';
    }
    return Promise.reject(error);
  },
);

export type RequestOptions = AxiosRequestConfig;
export { request };