package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class StudentPortalExamResponse {
    private UUID id;
    private String courseCode;
    private String courseName;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomCode;
    private String format;
}
