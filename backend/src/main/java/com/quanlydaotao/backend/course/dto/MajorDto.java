package com.quanlydaotao.backend.course.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class MajorDto {
    private UUID majorId;
    private String majorCode;
    private String majorName;
    private String description;
    private UUID departmentId;
    private Boolean isActive;
}
