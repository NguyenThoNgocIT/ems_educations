import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import { clearCache } from '@/utils/cache';
import type { AccountCreationResponse } from '@/types/api';
import type {
  InstructorAdminCreateRequest,
  InstructorAdminResponse,
  InstructorAdminUpdateRequest,
  LecturerListItem,
} from '@/types/instructor';

const CACHE_PREFIX = 'instructors';

const normalizeLecturer = (lecturer: InstructorAdminResponse): LecturerListItem => ({
  ...lecturer,
  id: lecturer.employeeId,
});

export const lecturerApi = {
  getAll: async (): Promise<LecturerListItem[]> => {
    const response = await request.get('/api/v1/instructors/admin', { params: { size: 500 } });
    const data = unwrapApiResponse<InstructorAdminResponse[] | { content?: InstructorAdminResponse[] }>(response);
    const rows = Array.isArray(data) ? data : data.content || [];
    return rows.map(normalizeLecturer);
  },

  getById: async (id: string): Promise<LecturerListItem> => {
    const response = await request.get(`/api/v1/instructors/admin/${id}`);
    return normalizeLecturer(unwrapApiResponse<InstructorAdminResponse>(response));
  },

  create: async (data: InstructorAdminCreateRequest): Promise<AccountCreationResponse> => {
    const response = await request.post('/api/v1/instructors/admin', data);
    clearCache(CACHE_PREFIX);
    return unwrapApiResponse<AccountCreationResponse>(response);
  },

  update: async (id: string, data: InstructorAdminUpdateRequest): Promise<LecturerListItem> => {
    const response = await request.put(`/api/v1/instructors/admin/${id}`, data);
    clearCache(CACHE_PREFIX);
    return normalizeLecturer(unwrapApiResponse<InstructorAdminResponse>(response));
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/instructors/admin/${id}`);
    clearCache(CACHE_PREFIX);
  },
};
