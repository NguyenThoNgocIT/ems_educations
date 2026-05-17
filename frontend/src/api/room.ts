import apiClient from './auth';

export const roomApi = {
  getAll: async () => {
    const response = await apiClient.get('/api/v1/rooms');
    return response?.data || [];
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/v1/rooms/${id}`);
    return response?.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/v1/rooms', data);
    return response?.data;
  },
  update: async (id: string, data: any) => {
    // Loại bỏ roomId khỏi payload nếu có
    const { roomId, ...cleanData } = data;
    const response = await apiClient.put(`/api/v1/rooms/${id}`, cleanData);
    return response?.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/v1/rooms/${id}`);
    return response;
  },
};