import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { Degree } from '@/types/lookup';

export const degreeApi = {
  getAll: async (params?: { keyword?: string; majorId?: string; isActive?: boolean }): Promise<Degree[]> => {
    const response = await request.get('/api/v1/degrees/admin', { params });
    return unwrapApiResponse<Degree[]>(response);
  },

  getById: async (id: string): Promise<Degree> => {
    const response = await request.get(`/api/v1/degrees/admin/${id}`);
    return unwrapApiResponse<Degree>(response);
  },

  create: async (data: Degree): Promise<Degree> => {
    const response = await request.post('/api/v1/degrees/admin', data);
    return unwrapApiResponse<Degree>(response);
  },

  update: async (id: string, data: Degree): Promise<Degree> => {
    const response = await request.put(`/api/v1/degrees/admin/${id}`, data);
    return unwrapApiResponse<Degree>(response);
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/degrees/admin/${id}`);
  },
};
