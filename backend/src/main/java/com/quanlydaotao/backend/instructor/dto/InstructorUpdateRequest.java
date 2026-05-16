package com.quanlydaotao.backend.instructor.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class InstructorUpdateRequest {
    private String instructorCode;
    private UUID departmentId;
    private UUID degreeId;
    private Boolean isActive;
}

