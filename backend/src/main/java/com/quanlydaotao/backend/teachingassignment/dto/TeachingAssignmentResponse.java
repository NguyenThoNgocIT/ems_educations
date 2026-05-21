package com.quanlydaotao.backend.teachingassignment.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TeachingAssignmentResponse {
    private UUID assignmentId;
    private UUID instructorId;
    private UUID courseClassId;
    private UUID classId;
    private UUID semesterId;
    private String note;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
