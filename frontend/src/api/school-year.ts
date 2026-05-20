import { request } from '@/utils/request';

export const schoolYearApi = {
  getAll: (params?: { keyword?: string; isActive?: boolean }) =>
    request.get('/api/v1/school-years/admin', { params }),
  
  getById: (id: string) =>
    request.get(`/api/v1/school-years/admin/${id}`),
  
  create: (data: any) =>
    request.post('/api/v1/school-years/admin', data),
  
  update: (id: string, data: any) =>
    request.put(`/api/v1/school-years/admin/${id}`, data),
  
  delete: (id: string) =>
    request.delete(`/api/v1/school-years/admin/${id}`),
};