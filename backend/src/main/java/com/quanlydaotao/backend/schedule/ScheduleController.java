package com.quanlydaotao.backend.schedule;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/schedules")
@RequiredArgsConstructor
@Tag(name = "schedule-controller")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable UUID id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.createSchedule(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable UUID id, @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Schedule>> getByRoom(@PathVariable UUID roomId) {
        return ResponseEntity.ok(scheduleService.getByRoom(roomId));
    }

    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<Schedule>> getBySemester(@PathVariable UUID semesterId) {
        return ResponseEntity.ok(scheduleService.getBySemester(semesterId));
    }

    @GetMapping("/course-class/{courseClassId}")
    public ResponseEntity<List<Schedule>> getByCourseClass(@PathVariable UUID courseClassId) {
        return ResponseEntity.ok(scheduleService.getByCourseClass(courseClassId));
    }

    @GetMapping("/day/{dayOfWeek}")
    public ResponseEntity<List<Schedule>> getByDayOfWeek(@PathVariable Integer dayOfWeek) {
        return ResponseEntity.ok(scheduleService.getByDayOfWeek(dayOfWeek));
    }

    @GetMapping("/check-available")
    public ResponseEntity<Boolean> checkRoomAvailable(
            @RequestParam UUID roomId,
            @RequestParam UUID semesterId,
            @RequestParam Integer dayOfWeek,
            @RequestParam Integer startPeriod,
            @RequestParam Integer endPeriod
    ) {
        return ResponseEntity.ok(scheduleService.isRoomAvailable(roomId, semesterId, dayOfWeek, startPeriod, endPeriod));
    }
}
