package com.quanlydaotao.backend.department.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {
    private String departmentId;
    private String code;
    private String name;
    private String description;
    private Boolean isActive;
}