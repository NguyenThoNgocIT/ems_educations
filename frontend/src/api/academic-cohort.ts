import { request } from "@/utils/request";

export const academicCohortApi = {
  getAll: () => request.get('/api/v1/academic-cohorts/admin'),
  getById: (id: string) => request.get(`/api/v1/academic-cohorts/admin/${id}`),
  create: (data: any) => request.post('/api/v1/academic-cohorts/admin', data),
  update: (id: string, data: any) => request.put(`/api/v1/academic-cohorts/admin/${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/academic-cohorts/admin/${id}`),
};