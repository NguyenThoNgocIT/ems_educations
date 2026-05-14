import apiClient from './auth';

export const buildingApi = {
  getAll: () => apiClient.get('/api/v1/buildings'),
  getById: (id: string) => apiClient.get(`/api/v1/buildings/${id}`),
  create: (data: any) => apiClient.post('/api/v1/buildings', data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/buildings/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/buildings/${id}`),
};
