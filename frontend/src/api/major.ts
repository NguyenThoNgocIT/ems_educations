import { request } from '@/utils/request';

export const majorApi = {
  // Lấy danh sách ngành học
  getAll: (params?: { keyword?: string; departmentId?: string; isActive?: boolean }) =>
    request.get('/api/v1/majors/admin', { params }),  // ← thêm /admin
  
  // Lấy chi tiết ngành học
  getById: (id: string) => 
    request.get(`/api/v1/majors/admin/${id}`),  // ← thêm /admin
  
  // Tạo mới ngành học
  create: (data: { code: string; name: string; description?: string; departmentId?: string; isActive?: boolean }) =>
    request.post('/api/v1/majors/admin', data),  // ← thêm /admin
  
  // Cập nhật ngành học
  update: (id: string, data: { code: string; name: string; description?: string; departmentId?: string; isActive?: boolean }) =>
    request.put(`/api/v1/majors/admin/${id}`, data),  // ← thêm /admin
  
  // Xóa ngành học
  delete: (id: string) => 
    request.delete(`/api/v1/majors/admin/${id}`),  // ← thêm /admin
};