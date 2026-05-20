import { request } from '@/utils/request';

export const timeSlotApi = {
  // Lấy danh sách ca học
  getAll: (params?: { keyword?: string; isActive?: boolean }) =>
    request.get('/api/v1/time-slots', { params }),
  
  // Lấy chi tiết ca học theo ID
  getById: (id: string) =>
    request.get(`/api/v1/time-slots/${id}`),
  
  // Tạo mới ca học
  create: (data: {
    slotCode: string;      // ← sửa: code → slotCode
    startTime: string;     // ← giữ nguyên
    endTime: string;       // ← giữ nguyên
    isActive?: boolean;
  }) =>
    request.post('/api/v1/time-slots', data),
  
  // Cập nhật ca học
  update: (id: string, data: {
    slotCode: string;      // ← sửa: code → slotCode
    startTime: string;     // ← giữ nguyên
    endTime: string;       // ← giữ nguyên
    isActive?: boolean;
  }) =>
    request.put(`/api/v1/time-slots/${id}`, data),
  
  // Xóa ca học
  delete: (id: string) =>
    request.delete(`/api/v1/time-slots/${id}`),
};