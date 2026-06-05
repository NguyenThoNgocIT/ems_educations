package com.quanlydaotao.backend.course.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CourseClassStudentResponse {
    private UUID courseRegistrationId;
    private UUID studentId;
    private String studentCode;
    private String fullName;
    private String contactEmail;
    private String phoneNumber;
    private UUID courseClassId;
    private Integer registrationType;
    private Integer status;
    private Boolean isPaid;
    private LocalDateTime registeredAt;
}
