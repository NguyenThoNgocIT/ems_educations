import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { TrainingProgram } from '@/types/lookup';

export const trainingProgramApi = {
  getAll: async (params?: { keyword?: string; majorId?: string; departmentId?: string; academicCohortId?: string; isActive?: boolean; size?: number }): Promise<TrainingProgram[]> => {
    const response = await request.get('/api/v1/training-programs/admin', { params });
    return unwrapApiResponse<TrainingProgram[]>(response);
  },

  getById: async (id: string): Promise<TrainingProgram> => {
    const response = await request.get(`/api/v1/training-programs/admin/${id}`);
    return unwrapApiResponse<TrainingProgram>(response);
  },

  create: async (data: Partial<TrainingProgram>): Promise<TrainingProgram> => {
    const response = await request.post('/api/v1/training-programs/admin', data);
    return unwrapApiResponse<TrainingProgram>(response);
  },

  update: async (id: string, data: Partial<TrainingProgram>): Promise<TrainingProgram> => {
    const response = await request.put(`/api/v1/training-programs/admin/${id}`, data);
    return unwrapApiResponse<TrainingProgram>(response);
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/training-programs/admin/${id}`);
  },
};
