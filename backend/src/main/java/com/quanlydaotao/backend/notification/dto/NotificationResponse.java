package com.quanlydaotao.backend.notification.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private UUID userNotificationId;
    private UUID notificationId;
    private String title;
    private String content;
    private String typeId;
    private String priority;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
