import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import { withCache, clearCache } from '@/utils/cache';
import type { Semester } from '@/api/admin-resources';

const CACHE_PREFIX = 'semesters';

export const semesterApi = {
  getAll: async (params?: { keyword?: string; schoolYearId?: string; isActive?: boolean }): Promise<Semester[]> => {
    const response = await request.get('/api/v1/semesters/admin', { params });
    return unwrapApiResponse<Semester[]>(response);
  },
  getById: (id: string) => request.get(`/api/v1/semesters/admin/${id}`),
  create: async (data: any) => {
    const response = await request.post('/api/v1/semesters/admin', data);
    clearCache(CACHE_PREFIX);
    return response;
  },
  update: async (id: string, data: any) => {
    const response = await request.put(`/api/v1/semesters/admin/${id}`, data);
    clearCache(CACHE_PREFIX);
    return response;
  },
  delete: async (id: string) => {
    const response = await request.delete(`/api/v1/semesters/admin/${id}`);
    clearCache(CACHE_PREFIX);
    return response;
  },
};