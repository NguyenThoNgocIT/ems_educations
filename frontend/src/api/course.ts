import { request } from '@/utils/request';

export const courseApi = {
  getAll: () => request.get('/api/v1/courses'),
  getById: (id: string) => request.get(`/api/v1/courses/${id}`),
  getByCode: (code: string) => request.get(`/api/v1/courses/code/${code}`),
  getByDepartment: (deptId: string) => request.get(`/api/v1/courses/department/${deptId}`),
  create: (data: any) => request.post('/api/v1/courses', data),
  update: (id: string, data: any) => request.put(`/api/v1/courses/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/courses/${id}`),
  
  // ✅ Lấy danh sách chương trình đào tạo (chỉ 1 method)
  getTrainingPrograms: () => request.get('/api/training-programs/all'),
};

export const courseClassApi = {
  getAll: () => request.get('/api/v1/courses/classes'),
  getById: (id: string) => request.get(`/api/v1/courses/classes/${id}`),
  getByCourse: (courseId: string) => request.get(`/api/v1/courses/${courseId}/classes`),
  getBySemester: (semesterId: string) => request.get(`/api/v1/courses/classes/semester/${semesterId}`),
  create: (data: any) => request.post('/api/v1/courses/classes', data),
  update: (id: string, data: any) => request.put(`/api/v1/courses/classes/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/courses/classes/${id}`),
};