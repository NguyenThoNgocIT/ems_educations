import { request } from '@/utils/request';

export const semesterApi = {
  getAll: (params?: { keyword?: string; schoolYearId?: string; isActive?: boolean }) =>
    request.get('/api/v1/semesters/admin', { params }),
  getById: (id: string) => request.get(`/api/v1/semesters/admin/${id}`),
  create: (data: any) => request.post('/api/v1/semesters/admin', data),
  update: (id: string, data: any) => request.put(`/api/v1/semesters/admin/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/semesters/admin/${id}`),
};