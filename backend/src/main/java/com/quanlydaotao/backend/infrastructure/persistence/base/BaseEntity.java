package com.quanlydaotao.backend.infrastructure.persistence.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;
/**
 * Base Entity class - tất cả entities đều inherit từ đây
 * Chứa các common fields: Id, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {


    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @CreatedBy
    @Column(name = "CreatedBy", columnDefinition = "uniqueidentifier", updatable = false)
    private UUID createdBy;

    @LastModifiedDate
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @LastModifiedBy
    @Column(name = "UpdatedBy", columnDefinition = "uniqueidentifier")
    private UUID updatedBy;
}

