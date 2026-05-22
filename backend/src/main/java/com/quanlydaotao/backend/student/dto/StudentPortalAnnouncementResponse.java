package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class StudentPortalAnnouncementResponse {
    private UUID id;
    private String title;
    private String sender;
    private LocalDateTime publishedAt;
    private String type;
}
