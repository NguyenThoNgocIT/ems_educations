package com.quanlydaotao.backend.infrastructure.persistence.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public abstract class SoftDeleteEntity extends BaseEntity {

    @Column(name = "DeletedAt")
    private LocalDateTime deletedAt;

    @Column(name = "DeletedBy", columnDefinition = "uniqueidentifier")
    private UUID deletedBy;
}

