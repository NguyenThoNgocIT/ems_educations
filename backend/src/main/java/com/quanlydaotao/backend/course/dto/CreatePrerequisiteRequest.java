package com.quanlydaotao.backend.course.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreatePrerequisiteRequest {
    @NotNull(message = "Course ID is required")
    private UUID courseId;
    
    @NotNull(message = "Prerequisite Course ID is required")
    private UUID prerequisiteId;

    private String type; // PREREQUISITE, PARALLEL
}
