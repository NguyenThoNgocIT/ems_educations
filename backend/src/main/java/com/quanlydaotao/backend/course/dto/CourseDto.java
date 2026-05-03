package com.quanlydaotao.backend.course.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CourseDto {
    private UUID id;
    private UUID departmentId;
    private String code;
    private String name;
    private String nameEn;
    private String courseType;
    private BigDecimal credits;
    private BigDecimal theoryHours;
    private BigDecimal practiceHours;
    private BigDecimal selfStudyHours;
    private BigDecimal internshipCredits;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
