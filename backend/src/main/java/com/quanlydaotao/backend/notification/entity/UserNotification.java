package com.quanlydaotao.backend.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "UserNotifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "UserNotificationId", updatable = false, nullable = false)
    private UUID userNotificationId;

    @Column(name = "UserId", nullable = false)
    private UUID userId;

    @Column(name = "NotificationId", nullable = false)
    private UUID notificationId;

    @Builder.Default
    @Column(name = "IsRead", nullable = false)
    private Boolean isRead = false;

    @Column(name = "ReadAt")
    private LocalDateTime readAt;

    @Builder.Default
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "UpdateAt")
    private LocalDateTime updateAt;

    @Column(name = "DeletedAt")
    private LocalDateTime deletedAt;

    @Column(name = "DeletedBy")
    private UUID deletedBy;

    @Column(name = "UpdatedBy")
    private UUID updatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NotificationId", insertable = false, updatable = false)
    private Notification notification;
}
