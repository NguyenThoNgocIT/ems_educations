package com.quanlydaotao.backend.department.dto.request;

import lombok.Data;

@Data
public class DepartmentSearchRequest {
    private String code;
    private String name;
    private Boolean isActive;
}