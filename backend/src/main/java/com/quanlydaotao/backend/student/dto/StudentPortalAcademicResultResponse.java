package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentPortalAcademicResultResponse {
    private String semesterLabel;
    private Double cumulativeGpa;
    private Double semesterGpa;
    private Double accumulatedCredits;
    private Integer programCredits;
    private List<StudentPortalSemesterResponse> semesters;
    private List<StudentPortalGradeResponse> grades;
}
