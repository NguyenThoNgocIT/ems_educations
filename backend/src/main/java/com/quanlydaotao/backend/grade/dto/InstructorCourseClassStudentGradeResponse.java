package com.quanlydaotao.backend.grade.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class InstructorCourseClassStudentGradeResponse {
    private UUID studentId;
    private String studentCode;
    private String fullName;
    private UUID courseRegistrationId;
    private Integer registrationStatus;
    private Boolean isFinalized;
    private BigDecimal totalScore;
    private String letterGrade;
    private BigDecimal gpaValue;
    private String result;
    private List<StudentComponentGradeResponse> componentScores;
}
