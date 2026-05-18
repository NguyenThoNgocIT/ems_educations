package com.quanlydaotao.backend.user.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AssignUserRolesRequest {
    private List<UUID> roleIds;
}
