import { request } from "@/utils/request";

export const departmentApi = {
  getAll: () => request.get('/api/departments'),
  create: (data: any) => request.post('/api/departments', data),
};
