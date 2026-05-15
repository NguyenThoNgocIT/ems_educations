import { request } from "@/utils/request";

export const departmentApi = {
  getAll: () => request.get('/api/departments'),
};
