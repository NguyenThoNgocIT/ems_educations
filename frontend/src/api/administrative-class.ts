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
};
