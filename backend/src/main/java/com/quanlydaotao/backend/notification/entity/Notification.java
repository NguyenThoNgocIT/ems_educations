package com.quanlydaotao.backend.notification.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@AttributeOverrides({
    @AttributeOverride(name = "updatedAt", column = @Column(name = "UpdateAt"))
})
public class Notification extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "NotificationId", updatable = false, nullable = false)
    private UUID notificationId;

    @Column(name = "Title", nullable = false, length = 255)
    private String title;

    @Column(name = "Content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "TypeId", length = 50)
    private String typeId;

    @Column(name = "Priority", length = 20)
    private String priority;

    @Column(name = "TargetRoleId")
    private UUID targetRoleId;
}
