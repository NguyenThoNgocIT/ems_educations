package com.quanlydaotao.backend.schoolyear.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateSchoolYearRequest {
    
    @Size(max = 50, message = "Mã năm học tối đa 50 ký tự")
    private String code;
    
    @Size(max = 100, message = "Tên năm học tối đa 100 ký tự")
    private String name;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
    private String description;
    
    private Boolean isActive;
}