import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';

export interface TeachingAssignmentRequest {
  instructorId: string;
  courseClassId: string;
  classId?: string | null;
  semesterId: string;
  note?: string;
  isActive?: boolean;
}

export interface TeachingAssignmentResponse extends TeachingAssignmentRequest {
  assignmentId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const teachingAssignmentApi = {
  search: async (params?: {
    instructorId?: string;
    courseClassId?: string;
    classId?: string;
    semesterId?: string;
    isActive?: boolean;
  }): Promise<TeachingAssignmentResponse[]> => {
    const response = await request.get('/api/v1/teaching-assignments/admin', { params });
    return unwrapApiResponse<TeachingAssignmentResponse[]>(response);
  },

  assign: async (data: TeachingAssignmentRequest): Promise<TeachingAssignmentResponse> => {
    const response = await request.post('/api/v1/teaching-assignments/admin', data);
    return unwrapApiResponse<TeachingAssignmentResponse>(response);
  },

  update: async (assignmentId: string, data: TeachingAssignmentRequest): Promise<TeachingAssignmentResponse> => {
    const response = await request.put(`/api/v1/teaching-assignments/admin/${assignmentId}`, data);
    return unwrapApiResponse<TeachingAssignmentResponse>(response);
  },

  delete: async (assignmentId: string): Promise<void> => {
    await request.delete(`/api/v1/teaching-assignments/admin/${assignmentId}`);
  },
};
