import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { AccountCreationResponse } from '@/types/api';
import type {
  InstructorAdminCreateRequest,
  InstructorAdminResponse,
  InstructorAdminUpdateRequest,
  LecturerListItem,
} from '@/types/instructor';

const normalizeLecturer = (lecturer: InstructorAdminResponse): LecturerListItem => ({
  ...lecturer,
  id: lecturer.employeeId,
});

export const lecturerApi = {
  getAll: async (): Promise<LecturerListItem[]> => {
    const response = await request.get('/api/v1/instructors/admin');
    return unwrapApiResponse<InstructorAdminResponse[]>(response).map(normalizeLecturer);
  },

  getById: async (id: string): Promise<LecturerListItem> => {
    const response = await request.get(`/api/v1/instructors/admin/${id}`);
    return normalizeLecturer(unwrapApiResponse<InstructorAdminResponse>(response));
  },

  create: async (data: InstructorAdminCreateRequest): Promise<AccountCreationResponse> => {
    const response = await request.post('/api/v1/instructors/admin', data);
    return unwrapApiResponse<AccountCreationResponse>(response);
  },

  update: async (id: string, data: InstructorAdminUpdateRequest): Promise<LecturerListItem> => {
    const response = await request.put(`/api/v1/instructors/admin/${id}`, data);
    return normalizeLecturer(unwrapApiResponse<InstructorAdminResponse>(response));
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/instructors/admin/${id}`);
  },
};
