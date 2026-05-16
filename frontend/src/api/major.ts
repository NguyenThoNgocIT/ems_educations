import { request } from '@/utils/request';

export const majorApi = {
  // Lấy danh sách ngành học
  getAll: (params?: { keyword?: string; departmentId?: string; page?: number; size?: number }) =>
    request.get('/api/majors', { params }),
  
  // Lấy chi tiết ngành học
  getById: (id: string) => request.get(`/api/majors/${id}`),
  
  // Tạo mới ngành học
  create: (data: { majorCode: string; majorName: string; description?: string; departmentId?: string }) =>
    request.post('/api/majors', data),
  
  // Cập nhật ngành học
  update: (id: string, data: { majorCode: string; majorName: string; description?: string; departmentId?: string }) =>
    request.put(`/api/majors/${id}`, data),
  
  // Xóa ngành học
  delete: (id: string) => request.delete(`/api/majors/${id}`),
};