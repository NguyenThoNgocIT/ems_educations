import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { AcademicCohort } from '@/types/lookup';

export const academicCohortApi = {
  getAll: async (params?: { keyword?: string; isActive?: boolean }): Promise<AcademicCohort[]> => {
    const response = await request.get('/api/v1/academic-cohorts/admin', { params });
    return unwrapApiResponse<AcademicCohort[]>(response);
  },

  getById: async (id: string): Promise<AcademicCohort> => {
    const response = await request.get(`/api/v1/academic-cohorts/admin/${id}`);
    return unwrapApiResponse<AcademicCohort>(response);
  },

  create: async (data: AcademicCohort): Promise<AcademicCohort> => {
    const response = await request.post('/api/v1/academic-cohorts/admin', data);
    return unwrapApiResponse<AcademicCohort>(response);
  },
};
