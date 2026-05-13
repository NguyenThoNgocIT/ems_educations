package com.quanlydaotao.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateMajorRequest {
    @NotBlank(message = "Major code is required")
    private String majorCode;
    
    @NotBlank(message = "Major name is required")
    private String majorName;
    
    private String description;
    private UUID departmentId;
}
