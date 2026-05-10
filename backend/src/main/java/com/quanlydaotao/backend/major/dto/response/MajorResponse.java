package com.quanlydaotao.backend.major.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MajorResponse {
    private String majorId;
    private String code;
    private String name;
    private String departmentId;
    private String departmentName;
    private String departmentCode;
    private String description;
    private Boolean isActive;
}