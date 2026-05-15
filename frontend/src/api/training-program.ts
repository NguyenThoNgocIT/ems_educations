import { request } from "@/utils/request";

export const trainingProgramApi = {
  getAll: (params?: { keyword?: string; majorId?: string; page?: number; size?: number }) => 
    request.get('/api/training-programs', { params }),
  getById: (id: string) => 
    request.get(`/api/training-programs/${id}`),
  create: (data: any) => 
    request.post('/api/training-programs', data),
  update: (id: string, data: any) => 
    request.put(`/api/training-programs/${id}`, data),
  delete: (id: string) => 
    request.delete(`/api/training-programs/${id}`),
};
