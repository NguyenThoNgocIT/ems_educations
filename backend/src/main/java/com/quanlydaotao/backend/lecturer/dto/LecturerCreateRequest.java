package com.quanlydaotao.backend.lecturer.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class LecturerCreateRequest {
    private UUID employeeId;
    private String instructorCode;
    private UUID departmentId;
    private UUID degreeId;
}

