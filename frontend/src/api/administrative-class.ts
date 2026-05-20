import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { AdministrativeClass } from '@/types/lookup';

export const administrativeClassApi = {
  getAll: async (params?: { keyword?: string; departmentId?: string; academicCohortId?: string; isActive?: boolean }): Promise<AdministrativeClass[]> => {
    const response = await request.get('/api/v1/classes/admin', { params });
    return unwrapApiResponse<AdministrativeClass[]>(response);
  },

  getById: async (id: string): Promise<AdministrativeClass> => {
    const response = await request.get(`/api/v1/classes/admin/${id}`);
    return unwrapApiResponse<AdministrativeClass>(response);
  },

  create: async (data: AdministrativeClass): Promise<AdministrativeClass> => {
    const response = await request.post('/api/v1/classes/admin', data);
    return unwrapApiResponse<AdministrativeClass>(response);
  },

  update: async (id: string, data: AdministrativeClass): Promise<AdministrativeClass> => {
    const response = await request.put(`/api/v1/classes/admin/${id}`, data);
    return unwrapApiResponse<AdministrativeClass>(response);
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/classes/admin/${id}`);
  },
};
