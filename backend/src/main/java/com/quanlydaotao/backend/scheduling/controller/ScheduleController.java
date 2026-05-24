package com.quanlydaotao.backend.scheduling.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduling.dto.FixedSessionResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleDto;
import com.quanlydaotao.backend.scheduling.dto.ScheduleCalendarDayResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleTeachingProgressReportResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleWeekItemResponse;
import com.quanlydaotao.backend.scheduling.service.ScheduleQueryService;
import com.quanlydaotao.backend.scheduling.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
@Tag(name = "Lịch học", description = "API quản lý lịch học, sắp lịch và chống trùng lịch")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleQueryService scheduleQueryService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả lịch học")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getAll()));
    }

    @GetMapping("/course-class/{id}")
    @Operation(summary = "Lấy lịch học theo lớp học phần")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getByCourseClass(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getByCourseClass(id)));
    }

    @GetMapping("/fixed-sessions")
    @Operation(summary = "Lấy danh sách buổi học cố định của lớp học phần")
    public ResponseEntity<ApiResponse<List<FixedSessionResponse>>> getFixedSessions(
            @RequestParam UUID courseClassId,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách buổi học cố định thành công",
                scheduleQueryService.getFixedSessions(courseClassId, fromDate, toDate)));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Lấy lịch giảng dạy theo tháng, đã ghép lịch gốc và lịch điều chỉnh")
    public ResponseEntity<ApiResponse<List<ScheduleCalendarDayResponse>>> getCalendar(
            @RequestParam UUID instructorId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch giảng dạy theo tháng thành công",
                scheduleQueryService.getCalendar(instructorId, month, year)));
    }

    @GetMapping("/instructor/{id}/week")
    @Operation(summary = "Lấy lịch tuần của giảng viên, đã ghép lịch gốc và lịch điều chỉnh")
    public ResponseEntity<ApiResponse<List<ScheduleWeekItemResponse>>> getInstructorWeek(
            @PathVariable UUID id,
            @RequestParam LocalDate date,
            @RequestParam(required = false) UUID semesterId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch tuần của giảng viên thành công",
                scheduleQueryService.getInstructorWeek(id, date, semesterId)));
    }

    @GetMapping("/teaching-progress")
    @Operation(summary = "Lấy báo cáo tiến độ giảng dạy theo lớp học phần")
    public ResponseEntity<ApiResponse<List<ScheduleTeachingProgressReportResponse>>> getTeachingProgress(
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) UUID instructorId,
            @RequestParam(required = false) UUID courseClassId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo tiến độ giảng dạy thành công",
                scheduleQueryService.getTeachingProgress(semesterId, instructorId, courseClassId)));
    }

    @GetMapping("/instructor/{id}")
    @Operation(summary = "Lấy lịch học theo giảng viên")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getByInstructor(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getByInstructor(id)));
    }

    @GetMapping("/room/{id}")
    @Operation(summary = "Lấy lịch học theo phòng học")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getByRoom(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getByRoom(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới lịch học (Có kiểm tra trùng lịch)")
    public ResponseEntity<ApiResponse<ScheduleDto>> create(@RequestBody ScheduleDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Sắp lịch thành công", scheduleService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật lịch học (Có kiểm tra trùng lịch)")
    public ResponseEntity<ApiResponse<ScheduleDto>> update(@PathVariable UUID id, @RequestBody ScheduleDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch thành công", scheduleService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa lịch học")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        scheduleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lịch học thành công", null));
    }
}
