package com.quanlydaotao.backend.user.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "UserId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonId", nullable = false, unique = true)
    private Person person;

    @Column(name = "Username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "PasswordHash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "Email", unique = true, length = 150, updatable = false)
    private String email;

    @Column(name = "LastLoginAt")
    private LocalDateTime lastLoginAt;

    @Column(name = "AccessFailedCount", nullable = false)
    private Integer accessFailedCount = 0;

    @Column(name = "LockoutEndAt")
    private LocalDateTime lockoutEndAt;

    @Column(name = "LockReason", length = 255)
    private String lockReason;

    @Column(name = "RequirePasswordChange")
    private Boolean requirePasswordChange = true;

    @Column(name = "EmailConfirmed")
    private Boolean emailConfirmed = false;

    @Column(name = "ConfirmationToken", length = 255)
    private String confirmationToken;
}
