import apiClient from './auth';
import { unwrapApiResponse } from './response';

export interface NotificationItem {
  userNotificationId: string;
  notificationId: string;
  title: string;
  content: string;
  typeId?: string;
  priority?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await apiClient.get('/api/v1/notifications', { timeout: 8000 });
    return unwrapApiResponse<NotificationItem[]>(response);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get('/api/v1/notifications/unread-count', { timeout: 5000 });
    return unwrapApiResponse<{ count: number }>(response);
  },

  markAsRead: async (id: string): Promise<void> => {
    const response = await apiClient.put(`/api/v1/notifications/${id}/read`, undefined, { timeout: 8000 });
    return unwrapApiResponse<void>(response);
  },

  markAllAsRead: async (): Promise<void> => {
    const response = await apiClient.post('/api/v1/notifications/mark-all-read', undefined, { timeout: 8000 });
    return unwrapApiResponse<void>(response);
  },
};
