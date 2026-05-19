package com.quanlydaotao.backend.contract.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class ContractDto {
    private UUID contractId;
    private UUID employeeId;
    private String contractNo;
    private String contractType;
    private LocalDate signedDate;
    private LocalDate effectiveDate;
    private LocalDate expiredDate;
    private BigDecimal baseSalary;
    private Integer status;
    private String note;
    private BigDecimal allowance;
    private String signedBy;
    private Integer annualLeave;
    private Boolean isActive;
}
