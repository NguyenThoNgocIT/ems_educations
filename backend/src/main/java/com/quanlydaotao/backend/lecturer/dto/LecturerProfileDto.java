package com.quanlydaotao.backend.lecturer.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class LecturerProfileDto {
    private UUID id;
    private UUID employeeId;
    private String instructorCode;
    private UUID departmentId;
    private UUID degreeId;
    private String employeeCode;
    private UUID personId;
    private Boolean isActive;
}

