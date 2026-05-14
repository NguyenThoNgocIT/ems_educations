import { request } from '@/utils/request';

export const studentApi = {
  getAll: () => request.get('/api/v1/students'),
  getById: (id: string) => request.get(`/api/v1/students/${id}`),
  create: (data: any) => request.post('/api/v1/students', data),
  enroll: (data: any) => request.post('/api/v1/students/enroll', data), // ✅ THÊM DÒNG NÀY
  update: (id: string, data: any) => request.put(`/api/v1/students/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/students/${id}`),
};