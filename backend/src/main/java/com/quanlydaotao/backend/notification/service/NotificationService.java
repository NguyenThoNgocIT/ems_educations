package com.quanlydaotao.backend.notification.service;

import com.quanlydaotao.backend.notification.dto.NotificationResponse;
import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponse> getNotificationsForUser(String username);
    long getUnreadCountForUser(String username);
    void markAsRead(String username, UUID userNotificationId);
    void markAllAsRead(String username);
    void createNotificationForRole(String roleCode, String title, String content, String typeId, String priority);
    void createNotificationForUser(UUID userId, String title, String content, String typeId, String priority);
}
