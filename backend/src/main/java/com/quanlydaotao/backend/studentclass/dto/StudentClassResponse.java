package com.quanlydaotao.backend.studentclass.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StudentClassResponse {
    private UUID studentClassId;
    private UUID studentId;
    private UUID classId;
    private UUID semesterId;
    private String roleInClass;
    private String status;
    private String note;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
