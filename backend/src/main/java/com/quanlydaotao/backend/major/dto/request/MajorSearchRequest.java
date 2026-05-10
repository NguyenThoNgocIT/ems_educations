package com.quanlydaotao.backend.major.dto.request;

import lombok.Data;

@Data
public class MajorSearchRequest {
    private String code;
    private String name;
    private String departmentId;
    private Boolean isActive;
}