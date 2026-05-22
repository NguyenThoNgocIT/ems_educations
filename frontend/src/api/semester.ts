import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { Semester } from '@/api/admin-resources';

export const semesterApi = {
  getAll: async (params?: { keyword?: string; schoolYearId?: string; isActive?: boolean }): Promise<Semester[]> => {
    const response = await request.get('/api/v1/semesters/admin', { params });
    return unwrapApiResponse<Semester[]>(response);
  },
  getById: (id: string) => request.get(`/api/v1/semesters/admin/${id}`),
  create: (data: any) => request.post('/api/v1/semesters/admin', data),
  update: (id: string, data: any) => request.put(`/api/v1/semesters/admin/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/semesters/admin/${id}`),
};