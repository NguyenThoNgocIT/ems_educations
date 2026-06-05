package com.quanlydaotao.backend.course.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CourseRegistrationResponse {
    private UUID courseRegistrationId;
    private UUID studentId;
    private UUID courseClassId;
    private String courseClassCode;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private UUID semesterId;
    private UUID registrationPeriodId;
    private Integer registrationType;
    private String registrationTypeName;
    private UUID replacedGradeId;
    private LocalDateTime registeredAt;
    private Integer status;
    private Boolean isPaid;
}
