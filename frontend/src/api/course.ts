import apiClient from './auth';

export const courseApi = {
  getAll: () => apiClient.get('/api/v1/courses'),
  getById: (id: string) => apiClient.get(`/api/v1/courses/${id}`),
  getByCode: (code: string) => apiClient.get(`/api/v1/courses/code/${code}`),
  getByDepartment: (deptId: string) => apiClient.get(`/api/v1/courses/department/${deptId}`),
  create: (data: any) => apiClient.post('/api/v1/courses', data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/courses/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/courses/${id}`),
};

export const courseClassApi = {
  getAll: () => apiClient.get('/api/v1/courses/classes'),
  getById: (id: string) => apiClient.get(`/api/v1/courses/classes/${id}`),
  getByCourse: (courseId: string) => apiClient.get(`/api/v1/courses/${courseId}/classes`),
  getBySemester: (semesterId: string) => apiClient.get(`/api/v1/courses/classes/semester/${semesterId}`),
  create: (data: any) => apiClient.post('/api/v1/courses/classes', data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/courses/classes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/courses/classes/${id}`),
};
