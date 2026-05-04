const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Lỗi khi gọi API");
  }

  return response.json();
};