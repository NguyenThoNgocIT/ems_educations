package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ScheduleCalendarDayResponse {
    private LocalDate date;
    private String dayLabel;
    private String status;
    private List<ScheduleCalendarItemDto> items;
}
