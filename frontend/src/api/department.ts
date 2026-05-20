import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { Department } from '@/types/lookup';

export const departmentApi = {
  getAll: async (params?: { keyword?: string; isActive?: boolean }): Promise<Department[]> => {
    const response = await request.get('/api/v1/departments/admin', { params });
    return unwrapApiResponse<Department[]>(response);
  },

  getById: async (id: string): Promise<Department> => {
    const response = await request.get(`/api/v1/departments/admin/${id}`);
    return unwrapApiResponse<Department>(response);
  },

  create: async (data: Department): Promise<Department> => {
    const response = await request.post('/api/v1/departments/admin', data);
    return unwrapApiResponse<Department>(response);
  },

  update: async (id: string, data: Department): Promise<Department> => {
    const response = await request.put(`/api/v1/departments/admin/${id}`, data);
    return unwrapApiResponse<Department>(response);
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/departments/admin/${id}`);
  },
};
