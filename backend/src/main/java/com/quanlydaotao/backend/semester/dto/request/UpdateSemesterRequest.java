package com.quanlydaotao.backend.semester.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateSemesterRequest {
    
    @Size(max = 30, message = "Mã học kỳ tối đa 30 ký tự")
    private String code;
    
    @Size(max = 150, message = "Tên học kỳ tối đa 150 ký tự")
    private String name;
    
    private String schoolYearId;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @Min(value = 0)
    @Max(value = 2)
    private Integer status;
    
    private String description;
    
    private Boolean isActive;
}