package com.quanlydaotao.backend.scheduling.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDto {
    private UUID scheduleId;
    private UUID courseClassId;
    private String courseClassName; // Hiển thị tên lớp cho tiện
    private String courseName;      // Hiển thị tên môn học
    private UUID instructorId;
    private String instructorName;
    private UUID semesterId;
    private UUID roomId;
    private String roomCode;
    private Integer dayOfWeek;
    private LocalDate date;
    private String shift;
    private UUID timeSlotId;
    private String slotCode;
    private Integer numberOfPeriods;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String mode;
    private String status;
    private String scheduleStatus;
    private String note;
}
