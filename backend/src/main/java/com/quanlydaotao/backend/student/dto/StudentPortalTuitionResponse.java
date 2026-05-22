package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class StudentPortalTuitionResponse {
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private Double registeredCredits;
    private Integer unpaidRegistrations;
}
