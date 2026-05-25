package com.quanlydaotao.backend.course.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class RetakeImprovementOptionResponse {
    private UUID courseClassId;
    private String courseClassCode;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private UUID semesterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxStudent;
    private Integer currentStudent;
    private Integer availableSeats;
    private Integer registrationType;
    private String registrationTypeName;
    private UUID previousCourseRegistrationId;
    private BigDecimal previousTotalScore;
    private String previousLetterGrade;
    private String previousResult;
    private Boolean canRegister;
    private String blockedReason;
}
