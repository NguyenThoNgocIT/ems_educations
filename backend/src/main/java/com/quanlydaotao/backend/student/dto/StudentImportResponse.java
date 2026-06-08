package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentImportResponse {
    private Integer totalRows;
    private Integer successCount;
    private Integer failureCount;
    private List<StudentImportRowResultResponse> rows;
}
