import { request } from '@/utils/request';

export const personApi = {
  create: (data: { 
    fullName: string; 
    contactEmail: string; 
    phoneNumber?: string; 
    isActive?: boolean 
  }) => request.post('/api/persons', data),
};