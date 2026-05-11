package com.quanlydaotao.backend.schoolyear.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateSchoolYearRequest {
    
    @NotBlank(message = "Mã năm học không được để trống")
    @Size(max = 50, message = "Mã năm học tối đa 50 ký tự")
    private String code;
    
    @NotBlank(message = "Tên năm học không được để trống")
    @Size(max = 100, message = "Tên năm học tối đa 100 ký tự")
    private String name;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate endDate;
    
    @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
    private String description;
}