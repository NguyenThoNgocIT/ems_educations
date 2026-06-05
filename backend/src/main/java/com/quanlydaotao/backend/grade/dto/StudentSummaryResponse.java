package com.quanlydaotao.backend.grade.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StudentSummaryResponse {
    private UUID courseRegistrationId;
    private UUID studentId;
    private UUID courseClassId;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private UUID semesterId;
    private BigDecimal totalScore;
    private UUID gradeScaleId;
    private String letterGrade;
    private BigDecimal gpaValue;
    private String result;
    private Boolean isFinalized;
}
