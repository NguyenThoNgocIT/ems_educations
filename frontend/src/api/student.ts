import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import type { AccountCreationResponse } from '@/types/api';
import type {
  StudentAdminCreateRequest,
  StudentAdminResponse,
  StudentAdminUpdateRequest,
  StudentListItem,
} from '@/types/student';

const normalizeStudent = (student: StudentAdminResponse): StudentListItem => ({
  ...student,
  id: student.studentId,
});

export const studentApi = {
  getAll: async (): Promise<StudentListItem[]> => {
    const response = await request.get('/api/v1/students/admin');
    return unwrapApiResponse<StudentAdminResponse[]>(response).map(normalizeStudent);
  },

  getById: async (id: string): Promise<StudentListItem> => {
    const response = await request.get(`/api/v1/students/admin/${id}`);
    return normalizeStudent(unwrapApiResponse<StudentAdminResponse>(response));
  },

  createAdmin: async (data: StudentAdminCreateRequest): Promise<AccountCreationResponse> => {
    const response = await request.post('/api/v1/students/admin', data);
    return unwrapApiResponse<AccountCreationResponse>(response);
  },

  create: async (data: StudentAdminCreateRequest | Record<string, unknown>): Promise<AccountCreationResponse> => {
    return studentApi.createAdmin(data as StudentAdminCreateRequest);
  },

  enroll: async (data: StudentAdminCreateRequest | Record<string, unknown>): Promise<AccountCreationResponse> => {
    return studentApi.createAdmin(data as StudentAdminCreateRequest);
  },

  update: async (id: string, data: StudentAdminUpdateRequest): Promise<StudentListItem> => {
    const response = await request.put(`/api/v1/students/admin/${id}`, data);
    return normalizeStudent(unwrapApiResponse<StudentAdminResponse>(response));
  },

  delete: async (id: string): Promise<void> => {
    await request.delete(`/api/v1/students/admin/${id}`);
  },
};
