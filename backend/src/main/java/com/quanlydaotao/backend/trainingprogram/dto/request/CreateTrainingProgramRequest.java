package com.quanlydaotao.backend.trainingprogram.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateTrainingProgramRequest {
    
    @NotBlank(message = "Mã chương trình không được để trống")
    @Size(max = 20, message = "Mã chương trình tối đa 20 ký tự")
    private String code;
    
    @NotBlank(message = "Tên chương trình không được để trống")
    @Size(max = 255, message = "Tên chương trình tối đa 255 ký tự")
    private String name;
    
    @Size(max = 255, message = "Tên tiếng Anh tối đa 255 ký tự")
    private String nameEn;
    
    @NotBlank(message = "Chuyên ngành không được để trống")
    private String majorId;
    
    @NotBlank(message = "Khoa không được để trống")
    private String departmentId;
    
    @NotBlank(message = "Khóa học không được để trống")
    private String academicCohortId;
    
    private String degreeLevel;
    
    private String educationType;
    
    private Integer totalCredits;
    
    private BigDecimal requiredCredits;
    
    private BigDecimal electiveCredits;
    
    private BigDecimal internshipCredits;
    
    private BigDecimal thesisCredits;
    
    private LocalDate admissionYear;
    
    private BigDecimal durationYears;
    
    private BigDecimal maxDurationYears;
    
    private LocalDate effectiveDate;
    
    private LocalDate expiryDate;
    
    private String description;
}