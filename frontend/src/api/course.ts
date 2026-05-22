import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';

export const courseApi = {
  getAll: () => request.get('/api/v1/courses'),
  getById: (id: string) => request.get(`/api/v1/courses/${id}`),
  getByCode: (code: string) => request.get(`/api/v1/courses/code/${code}`),
  getByDepartment: (deptId: string) => request.get(`/api/v1/courses/department/${deptId}`),
  create: (data: any) => request.post('/api/v1/courses', data),
  update: (id: string, data: any) => request.put(`/api/v1/courses/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/courses/${id}`),
  
  getTrainingPrograms: () => request.get('/api/v1/training-programs/admin'),
};

export const courseClassApi = {
  getAll: async () => unwrapApiResponse<any[]>(await request.get('/api/v1/courses/classes')),
  getById: async (id: string) => unwrapApiResponse<any>(await request.get(`/api/v1/courses/classes/${id}`)),
  getByCourse: async (courseId: string) => unwrapApiResponse<any[]>(await request.get(`/api/v1/courses/${courseId}/classes`)),
  getBySemester: async (semesterId: string) => unwrapApiResponse<any[]>(await request.get(`/api/v1/courses/classes/semester/${semesterId}`)),
  create: async (data: any) => unwrapApiResponse<any>(await request.post('/api/v1/courses/classes', data)),
  update: async (id: string, data: any) => unwrapApiResponse<any>(await request.put(`/api/v1/courses/classes/${id}`, data)),
  delete: (id: string) => request.delete(`/api/v1/courses/classes/${id}`),
};

export const coursePrerequisiteApi = {
  getByCourse: (courseId: string) => request.get(`/api/course-prerequisites/course/${courseId}`),
  add: (data: { courseId: string; prerequisiteId: string; type: string }) => request.post('/api/course-prerequisites', data),
  delete: (id: string) => request.delete(`/api/course-prerequisites/${id}`),
};
