package com.quanlydaotao.backend.studentstatus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentStatusHistoryRequest {
    @NotNull(message = "Sinh viên không được để trống")
    private UUID studentId;

    @NotNull(message = "Trạng thái sinh viên không được để trống")
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
}
