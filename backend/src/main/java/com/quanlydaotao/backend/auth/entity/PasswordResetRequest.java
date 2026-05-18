package com.quanlydaotao.backend.auth.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "PasswordResetRequests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PasswordResetRequestId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID passwordResetRequestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Column(name = "RequesterCode", nullable = false, length = 50)
    private String requesterCode;

    @Column(name = "EmailEdu", nullable = false, length = 150)
    private String emailEdu;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Column(name = "FullName", nullable = false, length = 150)
    private String fullName;

    @Column(name = "Status", nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "AdminNote", length = 255)
    private String adminNote;

    @Column(name = "ProcessedAt")
    private LocalDateTime processedAt;

    @Column(name = "ProcessedBy", columnDefinition = "uniqueidentifier")
    private UUID processedBy;
}
