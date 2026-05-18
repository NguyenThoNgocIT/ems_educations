import apiClient from './auth';

export const roomApi = {
  getAll: () => apiClient.get('/api/v1/rooms'),
  getById: (id: string) => apiClient.get(`/api/v1/rooms/${id}`),
  create: (data: any) => apiClient.post('/api/v1/rooms', data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/rooms/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/rooms/${id}`),
};
