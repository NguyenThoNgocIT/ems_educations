package com.quanlydaotao.backend.course.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PrerequisiteDto {
    private UUID courseId;
    private UUID prerequisiteCourseId;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
