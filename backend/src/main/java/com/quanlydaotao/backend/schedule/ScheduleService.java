package com.quanlydaotao.backend.schedule;

import com.quanlydaotao.backend.courseclass.CourseClassRepository;
import com.quanlydaotao.backend.room.RoomRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final RoomRepository roomRepository;

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findByIsActiveTrue();
    }

    public Schedule getScheduleById(UUID id) {
        return scheduleRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Schedule createSchedule(ScheduleRequest request) {
        validateScheduleRequest(request);
        checkOverlappingSchedule(request.getRoomId(), request.getSemesterId(), request.getDayOfWeek(), request.getStartPeriod(), request.getEndPeriod(), null);
        courseClassRepository.findByIdAndIsActiveTrue(request.getCourseClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        roomRepository.findByIdAndIsActiveTrue(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        Schedule schedule = Schedule.builder()
                .courseClassId(request.getCourseClassId())
                .roomId(request.getRoomId())
                .semesterId(request.getSemesterId())
                .dayOfWeek(request.getDayOfWeek())
                .startPeriod(request.getStartPeriod())
                .endPeriod(request.getEndPeriod())
                .build();
        return scheduleRepository.save(schedule);
    }

    public Schedule updateSchedule(UUID id, ScheduleRequest request) {
        validateScheduleRequest(request);
        Schedule existing = getScheduleById(id);
        checkOverlappingSchedule(request.getRoomId(), request.getSemesterId(), request.getDayOfWeek(), request.getStartPeriod(), request.getEndPeriod(), id);
        courseClassRepository.findByIdAndIsActiveTrue(request.getCourseClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        roomRepository.findByIdAndIsActiveTrue(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setCourseClassId(request.getCourseClassId());
        existing.setRoomId(request.getRoomId());
        existing.setSemesterId(request.getSemesterId());
        existing.setDayOfWeek(request.getDayOfWeek());
        existing.setStartPeriod(request.getStartPeriod());
        existing.setEndPeriod(request.getEndPeriod());
        return scheduleRepository.save(existing);
    }

    public void deleteSchedule(UUID id) {
        Schedule existing = getScheduleById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        scheduleRepository.save(existing);
    }

    public List<Schedule> getByRoom(UUID roomId) {
        return scheduleRepository.findByRoomIdAndIsActiveTrue(roomId);
    }

    public List<Schedule> getBySemester(UUID semesterId) {
        return scheduleRepository.findBySemesterIdAndIsActiveTrue(semesterId);
    }

    public List<Schedule> getByCourseClass(UUID courseClassId) {
        return scheduleRepository.findByCourseClassIdAndIsActiveTrue(courseClassId);
    }

    public List<Schedule> getByDayOfWeek(Integer dayOfWeek) {
        return scheduleRepository.findByDayOfWeekAndIsActiveTrue(dayOfWeek);
    }

    public boolean isRoomAvailable(UUID roomId, UUID semesterId, Integer dayOfWeek, Integer startPeriod, Integer endPeriod) {
        return scheduleRepository.findOverlappingSchedules(roomId, semesterId, dayOfWeek, startPeriod, endPeriod).isEmpty();
    }

    private void validateScheduleRequest(ScheduleRequest request) {
        if (request.getStartPeriod() > request.getEndPeriod()) {
            throw new RuntimeException("Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc");
        }
        if (request.getDayOfWeek() < 1 || request.getDayOfWeek() > 7) {
            throw new RuntimeException("Ngày học phải là 1 đến 7");
        }
    }

    private void checkOverlappingSchedule(UUID roomId, UUID semesterId, Integer dayOfWeek, Integer startPeriod, Integer endPeriod, UUID ignoreId) {
        scheduleRepository.findOverlappingSchedules(roomId, semesterId, dayOfWeek, startPeriod, endPeriod)
                .stream()
                .filter(schedule -> ignoreId == null || !schedule.getId().equals(ignoreId))
                .findAny()
                .ifPresent(existing -> {
                    throw new RuntimeException("Lịch học chồng giờ với phòng này");
                });
    }
}
