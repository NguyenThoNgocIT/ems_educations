package com.quanlydaotao.backend.studentstatus.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StudentStatusHistoryResponse {
    private UUID studentStatusHistoryId;
    private UUID studentId;
    private UUID studentStatusId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
    private String reason;
    private String decisionNo;
    private LocalDate decisionDate;
    private String decidedBy;
    private Integer warningLevel;
    private Boolean allowRegister;
    private Boolean allowExam;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
