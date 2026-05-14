import apiClient from './auth';

export const lecturerApi = {
  getAll: () => apiClient.get('/api/v1/lecturers'),
  getById: (id: string) => apiClient.get(`/api/v1/lecturers/${id}`),
  create: (data: any) => apiClient.post('/api/v1/lecturers', data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/lecturers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/lecturers/${id}`),
};
