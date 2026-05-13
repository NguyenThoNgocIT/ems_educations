package com.quanlydaotao.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateCourseRequest {
    private UUID departmentId;
    
    @NotBlank(message = "Mã môn học là bắt buộc")
    private String code;
    
    @NotBlank(message = "Tên môn học là bắt buộc")
    private String name;
    
    private String nameEn;
    private String courseType;
    
    @NotNull(message = "Số tín chỉ là bắt buộc")
    private Double credits;
    
    private Double theoryHours;
    private Double practiceHours;
    private Double selfStudyHours;
    private Double internshipCredits;
    private String description;
}
