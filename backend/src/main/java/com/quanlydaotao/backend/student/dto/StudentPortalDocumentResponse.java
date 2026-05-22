package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class StudentPortalDocumentResponse {
    private UUID id;
    private String title;
    private String courseCode;
    private String fileType;
    private LocalDateTime updatedAt;
    private String downloadUrl;
}
