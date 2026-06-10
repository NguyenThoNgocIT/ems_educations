import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import { withCache, clearCache } from '@/utils/cache';
import type { TrainingProgram } from '@/types/lookup';

const CACHE_PREFIX = 'training_programs';

export const trainingProgramApi = {
  getAll: async (params?: { keyword?: string; majorId?: string; departmentId?: string; academicCohortId?: string; isActive?: boolean; size?: number }): Promise<TrainingProgram[]> => {
    const cacheKey = `${CACHE_PREFIX}_${JSON.stringify(params || {})}`;
    return withCache(cacheKey, async () => {
      const response = await request.get('/api/v1/training-programs/admin', { params });
      return unwrapApiResponse<TrainingProgram[]>(response);
    });
  },

  getById: async (id: string): Promise<TrainingProgram> => {
    const response = await request.get(`/api/v1/training-programs/admin/${id}`);
    return unwrapApiResponse<TrainingProgram>(response);
  },

  create: async (data: Partial<TrainingProgram>): Promise<TrainingProgram> => {
    const response = await request.post('/api/v1/training-programs/admin', data);
    clearCache(CACHE_PREFIX);
    return unwrapApiResponse<TrainingProgram>(response);
  },

  update: async (id: string, data: Partial<TrainingProgram>): Promise<TrainingProgram> => {
    const response = await request.put(`/api/v1/training-programs/admin/${id}`, data);
    clearCache(CACHE_PREFIX);
    return unwrapApiResponse<TrainingProgram>(response);
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/training-programs/admin/${id}`);
    clearCache(CACHE_PREFIX);
  },
};

export interface TrainingProgramCourseRequest {
  trainingProgramId: string;
  courseId: string;
  semesterId?: string;
  isRequired?: boolean;
  groupCode?: string;
  credits?: number;
  prerequisiteCourseId?: string;
  isPrerequisiteRequired?: boolean;
  note?: string;
  sortOrder?: number;
  status?: string;
  coursePhase?: string;
  isActive?: boolean;
}

export const trainingProgramCourseApi = {
  search: async (params?: {
    trainingProgramId?: string;
    semesterId?: string;
    coursePhase?: string;
    isRequired?: boolean;
    isActive?: boolean;
  }) => {
    const response = await request.get('/api/v1/training-program-courses/admin', { params, timeout: 10000 });
    return unwrapApiResponse<any[]>(response);
  },

  create: async (data: TrainingProgramCourseRequest) => {
    const response = await request.post('/api/v1/training-program-courses/admin', data);
    return unwrapApiResponse<any>(response);
  },

  update: async (trainingProgramId: string, courseId: string, data: TrainingProgramCourseRequest) => {
    const response = await request.put(`/api/v1/training-program-courses/admin/${trainingProgramId}/${courseId}`, data);
    return unwrapApiResponse<any>(response);
  },

  delete: async (trainingProgramId: string, courseId: string) => {
    await request.delete(`/api/v1/training-program-courses/admin/${trainingProgramId}/${courseId}`);
  },

  getByStudent: async (studentId: string, semesterId?: string) => {
    const response = await request.get(`/api/v1/training-program-courses/admin/by-student/${studentId}`, {
      params: { semesterId },
    });
    return unwrapApiResponse<any[]>(response);
  },
};
