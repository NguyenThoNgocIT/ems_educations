package com.quanlydaotao.backend.registration.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class RegistrationSearchRequest {
    private UUID studentId;
    private UUID courseClassId;
    private Integer registrationType;
    private Integer status;
    private Boolean isPaid;
}