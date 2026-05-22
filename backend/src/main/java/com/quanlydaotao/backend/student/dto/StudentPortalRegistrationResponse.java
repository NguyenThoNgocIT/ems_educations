package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class StudentPortalRegistrationResponse {
    private UUID registrationId;
    private UUID courseClassId;
    private String courseCode;
    private String courseName;
    private String classCode;
    private Double credits;
    private String semesterLabel;
    private String registrationPeriodName;
    private LocalDateTime registeredAt;
    private Integer status;
    private Boolean paid;
}
