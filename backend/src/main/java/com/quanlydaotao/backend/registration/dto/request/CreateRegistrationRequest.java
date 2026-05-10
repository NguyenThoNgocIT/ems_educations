package com.quanlydaotao.backend.registration.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateRegistrationRequest {
    
    @NotNull(message = "StudentId không được để trống")
    private UUID studentId;
    
    @NotNull(message = "CourseClassId không được để trống")
    private UUID courseClassId;
    
    private UUID registrationPeriodId;
    
    private Integer registrationType;
}