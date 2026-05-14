import apiClient from './auth';

export const timeSlotApi = {
  getAll: () => apiClient.get('/api/v1/time-slots'),
  getById: (id: string) => apiClient.get(`/api/v1/time-slots/${id}`),
  create: (data: any) => apiClient.post('/api/v1/time-slots', data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/time-slots/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/time-slots/${id}`),
};
