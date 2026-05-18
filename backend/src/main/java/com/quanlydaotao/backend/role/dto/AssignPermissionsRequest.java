package com.quanlydaotao.backend.role.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AssignPermissionsRequest {
    private List<UUID> permissionIds;
}
