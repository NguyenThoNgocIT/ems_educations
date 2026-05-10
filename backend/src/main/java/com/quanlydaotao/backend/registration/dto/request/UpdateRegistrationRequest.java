package com.quanlydaotao.backend.registration.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class UpdateRegistrationRequest {
    
    private UUID registrationPeriodId;
    
    private Integer registrationType;
    
    private Integer status;
    
    private Boolean isPaid;
}