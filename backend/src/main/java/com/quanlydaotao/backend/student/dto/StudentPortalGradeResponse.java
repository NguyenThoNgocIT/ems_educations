package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class StudentPortalGradeResponse {
    private UUID gradeId;
    private UUID semesterId;
    private String semesterLabel;
    private String courseCode;
    private String courseName;
    private Double credits;
    private Double finalScore;
    private Double gradePoint;
    private String letterGrade;
    private String status;
}
