package com.quanlydaotao.backend.studentstatus.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StudentStatusCatalogResponse {
    private UUID studentStatusId;
    private String code;
    private String name;
    private String description;
    private String statusType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
