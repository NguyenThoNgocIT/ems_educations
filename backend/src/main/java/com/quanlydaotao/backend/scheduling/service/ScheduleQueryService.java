package com.quanlydaotao.backend.scheduling.service;

import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentStatisticsResponse;
import com.quanlydaotao.backend.scheduling.dto.AvailableRoomResponse;
import com.quanlydaotao.backend.scheduling.dto.FixedSessionResponse;
import com.quanlydaotao.backend.scheduling.dto.InstructorAvailabilityResponse;
import com.quanlydaotao.backend.scheduling.dto.InstructorCourseClassSummaryResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleCalendarDayResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleTeachingProgressReportResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleWeekItemResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ScheduleQueryService {
    List<InstructorCourseClassSummaryResponse> getCurrentInstructorCourseClasses(String username, UUID semesterId);

    List<FixedSessionResponse> getFixedSessions(UUID courseClassId, LocalDate fromDate, LocalDate toDate);

    InstructorAvailabilityResponse getInstructorAvailability(UUID instructorId, LocalDate date, UUID semesterId);

    List<AvailableRoomResponse> getAvailableRooms(LocalDate date, UUID timeSlotId, Integer minCapacity, UUID buildingId);

    List<ScheduleCalendarDayResponse> getCalendar(UUID instructorId, Integer month, Integer year);

    List<ScheduleWeekItemResponse> getInstructorWeek(UUID instructorId, LocalDate date, UUID semesterId);

    List<ScheduleTeachingProgressReportResponse> getTeachingProgress(UUID semesterId, UUID instructorId, UUID courseClassId);

    ScheduleAdjustmentStatisticsResponse getScheduleAdjustmentStatistics();
}
