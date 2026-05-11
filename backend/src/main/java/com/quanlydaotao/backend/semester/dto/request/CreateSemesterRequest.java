package com.quanlydaotao.backend.semester.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateSemesterRequest {
    
    @NotBlank(message = "Mã học kỳ không được để trống")
    @Size(max = 30, message = "Mã học kỳ tối đa 30 ký tự")
    private String code;
    
    @NotBlank(message = "Tên học kỳ không được để trống")
    @Size(max = 150, message = "Tên học kỳ tối đa 150 ký tự")
    private String name;
    
    @NotNull(message = "Năm học không được để trống")
    private String schoolYearId;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate endDate;
    
    @Min(value = 0, message = "Status phải từ 0-2")
    @Max(value = 2, message = "Status phải từ 0-2")
    private Integer status = 0;
    
    private String description;
}