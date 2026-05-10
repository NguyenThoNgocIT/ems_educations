package com.quanlydaotao.backend.major.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MajorDetailResponse {
    private String majorId;
    private String code;
    private String name;
    private String departmentId;
    private String departmentName;
    private String departmentCode;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}