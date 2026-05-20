import { request } from "@/utils/request";

export const trainingProgramApi = {
  getAll: (params?: { keyword?: string; majorId?: string; departmentId?: string; academicCohortId?: string; isActive?: boolean }) => 
    request.get('/api/v1/training-programs/admin', { params }),  // ← thêm /admin
  
  getById: (id: string) => 
    request.get(`/api/v1/training-programs/admin/${id}`),  // ← thêm /admin
  
  create: (data: any) => 
    request.post('/api/v1/training-programs/admin', data),  // ← thêm /admin
  
  update: (id: string, data: any) => 
    request.put(`/api/v1/training-programs/admin/${id}`, data),  // ← thêm /admin
  
  delete: (id: string) => 
    request.delete(`/api/v1/training-programs/admin/${id}`),  // ← thêm /admin
};