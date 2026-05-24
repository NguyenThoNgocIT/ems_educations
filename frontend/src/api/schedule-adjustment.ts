import apiClient from './auth';

export interface ScheduleAdjustmentValidateRequest {
  courseClassId: string;
  originalScheduleId?: string;
  requestType: 'ABSENT_MAKEUP' | 'EXTRA_SESSION' | 'RESCHEDULE' | 'ROOM_CHANGE';
  absentDate?: string;
  absentTimeSlotId?: string;
  absentPeriods?: number;
  proposedDate?: string;
  proposedTimeSlotId?: string;
  proposedRoomId?: string;
  proposedPeriods?: number;
}

export interface ScheduleAdjustmentSubmitRequest extends ScheduleAdjustmentValidateRequest {
  reason: string;
}

export interface ScheduleAdjustmentReviewRequest {
  adminNote?: string;
}

export const scheduleAdjustmentApi = {
  validate: (data: ScheduleAdjustmentValidateRequest) => 
    apiClient.post('/api/v1/schedule-adjustments/validate', data),
    
  submit: (data: ScheduleAdjustmentSubmitRequest) => 
    apiClient.post('/api/v1/schedule-adjustments', data),
    
  getMine: () => 
    apiClient.get('/api/v1/schedule-adjustments/me'),
    
  getByInstructor: (instructorId: string) => 
    apiClient.get(`/api/v1/schedule-adjustments/admin/instructor/${instructorId}`),
    
  searchAdmin: (params?: { status?: string, courseClassId?: string, instructorId?: string }) => 
    apiClient.get('/api/v1/schedule-adjustments/admin', { params }),
    
  approve: (requestId: string, data: ScheduleAdjustmentReviewRequest) => 
    apiClient.post(`/api/v1/schedule-adjustments/admin/${requestId}/approve`, data),
    
  reject: (requestId: string, data: ScheduleAdjustmentReviewRequest) => 
    apiClient.post(`/api/v1/schedule-adjustments/admin/${requestId}/reject`, data),
    
  returnToInstructor: (requestId: string, data: ScheduleAdjustmentReviewRequest) => 
    apiClient.post(`/api/v1/schedule-adjustments/admin/${requestId}/return`, data),
};
