import { request } from '@/utils/request';

export const studentApi = {
  // Lấy danh sách sinh viên
  getAll: () => request.get('/api/v1/students'),
  
  // Lấy chi tiết sinh viên theo ID
  getById: (id: string) => request.get(`/api/v1/students/${id}`),
  
  // Tạo sinh viên (cần personId có sẵn)
  create: (data: any) => request.post('/api/v1/students', data),
  
  // Nhập học sinh viên (tự động tạo Person + Student + User)
  enroll: (data: any) => request.post('/api/v1/students/enroll', data),
  
  // Cập nhật sinh viên
  update: (id: string, data: any) => request.put(`/api/v1/students/${id}`, data),
  
  // Xóa sinh viên
  delete: (id: string) => request.delete(`/api/v1/students/${id}`),
};