package com.quanlydaotao.backend.course.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CourseClassDto {
    private UUID id;
    private String classCode;
    private Integer maxStudent;
    private Integer currentStudent;
    private UUID roomId;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private UUID semesterId;
    private UUID courseId;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
