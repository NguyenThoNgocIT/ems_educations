package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class StudentPortalSemesterResponse {
    private UUID semesterId;
    private String label;
}
