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
    private String semesterCode;
    private String semesterName;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private UUID departmentId;
    private Double credits;
    private Double theoryHours;
    private Double practiceHours;
    private String roomCode;
    private String roomName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
