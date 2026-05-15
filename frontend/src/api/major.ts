import { request } from "@/utils/request";

export const majorApi = {
  getAll: (params?: { keyword?: string; departmentId?: string; page?: number; size?: number }) => 
    request.get('/api/majors', { params }),
  getById: (id: string) => 
    request.get(`/api/majors/${id}`),
  create: (data: any) => 
    request.post('/api/majors', data),
  update: (id: string, data: any) => 
    request.put(`/api/majors/${id}`, data),
  delete: (id: string) => 
    request.delete(`/api/majors/${id}`),
};
