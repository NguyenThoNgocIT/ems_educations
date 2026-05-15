import { request } from "@/utils/request";

export const academicCohortApi = {
  getAll: () => request.get('/api/academic-cohorts'),
  create: (data: any) => request.post('/api/academic-cohorts', data),
};
