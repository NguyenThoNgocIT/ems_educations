package com.quanlydaotao.backend.grade.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class InstructorGradeCourseClassResponse {
    private UUID courseClassId;
    private String classCode;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private UUID semesterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxStudent;
    private Integer currentStudent;
    private Integer totalStudents;
    private Integer gradedStudents;
    private Integer finalizedStudents;
}
