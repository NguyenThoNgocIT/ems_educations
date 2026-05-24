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
public class PermissionApiId implements Serializable {

    @Column(name = "PermissionId")
    private UUID permissionId;

    @Column(name = "ApiPath", length = 255)
    private String apiPath;

    @Column(name = "HttpMethod", length = 10)
    private String httpMethod;
}

