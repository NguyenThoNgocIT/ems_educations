package com.quanlydaotao.backend.role.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RolePermissionId implements Serializable {

    @Column(name = "RoleId", columnDefinition = "uniqueidentifier")
    private UUID roleId;

    @Column(name = "PermissionId", columnDefinition = "uniqueidentifier")
    private UUID permissionId;
}

