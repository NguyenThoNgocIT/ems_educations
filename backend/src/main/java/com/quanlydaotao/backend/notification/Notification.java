package com.quanlydaotao.backend.notification;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @NotBlank
    @Column(nullable = false)
    private String priority;

    @NotNull
    @Column(name = "sender_id", nullable = false)
    private UUID senderId;

    @Column(name = "receiver_id")
    private UUID receiverId;

    @Column(name = "target_role")
    private String targetRole;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "send_channel")
    private String sendChannel;

    @Column(nullable = false)
    private String status;

    @Column(name = "related_type")
    private String relatedType;

    @Column(name = "related_id")
    private UUID relatedId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
        this.status = this.status == null ? "ACTIVE" : this.status;
        this.isActive = true;
    }

    @PreUpdate
    public void preUpdate() {
        if (this.isRead != null && this.isRead && this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }
}
