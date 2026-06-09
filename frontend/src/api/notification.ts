import apiClient from './auth';

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
  getNotifications: () =>
    apiClient.get('/api/v1/notifications'),

  getUnreadCount: () =>
    apiClient.get('/api/v1/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.put(`/api/v1/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.post('/api/v1/notifications/mark-all-read'),
};
