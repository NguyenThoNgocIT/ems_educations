package com.quanlydaotao.backend.Instructors.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class InstructorCreateRequest {
    private UUID employeeId;
    private String instructorCode;
    private UUID departmentId;
    private UUID degreeId;
}

