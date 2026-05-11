package com.quanlydaotao.backend.lecturer.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class LecturerUpdateRequest {
    private String instructorCode;
    private UUID departmentId;
    private UUID degreeId;
    private Boolean isActive;
}

