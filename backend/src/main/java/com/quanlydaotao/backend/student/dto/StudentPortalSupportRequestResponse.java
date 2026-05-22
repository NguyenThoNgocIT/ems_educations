package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class StudentPortalSupportRequestResponse {
    private UUID id;
    private String title;
    private String content;
    private String status;
    private LocalDateTime createdAt;
}
