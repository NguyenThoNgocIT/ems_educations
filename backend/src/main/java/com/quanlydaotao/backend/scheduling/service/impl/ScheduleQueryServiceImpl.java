package com.quanlydaotao.backend.scheduling.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentStatisticsResponse;
import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import com.quanlydaotao.backend.scheduleadjustment.repository.ScheduleAdjustmentRequestRepository;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduling.dto.AvailabilitySlotDto;
import com.quanlydaotao.backend.scheduling.dto.AvailableRoomResponse;
import com.quanlydaotao.backend.scheduling.dto.FixedSessionResponse;
import com.quanlydaotao.backend.scheduling.dto.InstructorAvailabilityResponse;
import com.quanlydaotao.backend.scheduling.dto.InstructorCourseClassSummaryResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleCalendarDayResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleCalendarItemDto;
import com.quanlydaotao.backend.scheduling.dto.ScheduleTeachingProgressReportResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleWeekItemResponse;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.scheduling.service.ScheduleQueryService;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingprogress.repository.TeachingProgressLogRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleQueryServiceImpl implements ScheduleQueryService {
    private final ScheduleRepository scheduleRepository;
    private final TeachingSessionOverrideRepository overrideRepository;
    private final ScheduleAdjustmentRequestRepository adjustmentRequestRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final RoomRepository roomRepository;
    private final CourseClassRepository courseClassRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final TeachingProgressLogRepository progressLogRepository;
    private final EmployeeLeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InstructorCourseClassSummaryResponse> getCurrentInstructorCourseClasses(String username, UUID semesterId) {
        UUID instructorId = resolveCurrentInstructorId(username);
        UUID targetSemesterId = semesterId != null ? semesterId : resolveCurrentSemesterId();
        Map<UUID, List<Schedule>> schedulesByClass = scheduleRepository.findFixedByInstructorAndSemester(instructorId, targetSemesterId).stream()
                .collect(Collectors.groupingBy(schedule -> schedule.getCourseClass().getCourseClassId(), LinkedHashMap::new, Collectors.toList()));
        return schedulesByClass.values().stream()
                .map(schedules -> buildCourseClassSummary(schedules.get(0).getCourseClass(), schedules))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FixedSessionResponse> getFixedSessions(UUID courseClassId, LocalDate fromDate, LocalDate toDate) {
        return scheduleRepository.findFixedSessions(courseClassId, fromDate, toDate).stream()
                .map(this::toFixedSession)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InstructorAvailabilityResponse getInstructorAvailability(UUID instructorId, LocalDate date, UUID semesterId) {
        List<TimeSlot> slots = activeTimeSlots();
        List<TeachingSessionOverride> allOverrides = overrideRepository.findByInstructorAndDateBetween(instructorId, date, date);
        Set<UUID> cancelledOriginalScheduleIds = cancelledOriginalScheduleIds(allOverrides);
        List<Schedule> fixedSchedules = scheduleRepository.findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(instructorId, date, date).stream()
                .filter(schedule -> !cancelledOriginalScheduleIds.contains(schedule.getScheduleId()))
                .toList();
        List<TeachingSessionOverride> overrides = overrideRepository.findVisibleByInstructorAndDate(instructorId, date);
        boolean hasLeave = leaveRequestRepository.hasApprovedLeaveOnDate(instructorId, date);

        List<AvailabilitySlotDto> busySlots = new ArrayList<>();
        if (hasLeave) {
            busySlots.addAll(slots.stream()
                    .map(slot -> availability(slot, "LEAVE", null, null))
                    .toList());
        } else {
            busySlots.addAll(fixedSchedules.stream()
                    .filter(schedule -> schedule.getTimeSlot() != null)
                    .map(schedule -> availability(schedule.getTimeSlot(), "FIXED_SCHEDULE",
                            schedule.getCourseClass().getCourseClassId(), schedule.getCourseClass().getClassCode()))
                    .toList());
            busySlots.addAll(overrides.stream()
                    .map(override -> availability(slotById(override.getTimeSlotId()), "APPROVED_ADJUSTMENT",
                            override.getCourseClassId(), courseClassCode(override.getCourseClassId())))
                    .filter(slot -> slot.getTimeSlotId() != null)
                    .toList());
        }

        List<UUID> busyIds = busySlots.stream().map(AvailabilitySlotDto::getTimeSlotId).filter(Objects::nonNull).toList();
        List<AvailabilitySlotDto> freeSlots = slots.stream()
                .filter(slot -> !busyIds.contains(slot.getTimeSlotId()))
                .map(slot -> availability(slot, null, null, null))
                .toList();
        return InstructorAvailabilityResponse.builder()
                .instructorId(instructorId)
                .date(date)
                .hasLeave(hasLeave)
                .busySlots(busySlots)
                .freeSlots(freeSlots)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableRoomResponse> getAvailableRooms(LocalDate date, UUID timeSlotId, Integer minCapacity, UUID buildingId) {
        return roomRepository.findAll().stream()
                .filter(room -> Boolean.TRUE.equals(room.getIsActive()))
                .filter(room -> buildingId == null || (room.getBuilding() != null && buildingId.equals(room.getBuilding().getBuildingId())))
                .filter(room -> minCapacity == null || room.getCapacity() == null || room.getCapacity() >= minCapacity)
                .filter(room -> !scheduleRepository.hasRoomConflict(room.getRoomId(), date, timeSlotId))
                .filter(room -> !overrideRepository.hasRoomConflict(room.getRoomId(), date, timeSlotId))
                .filter(room -> !adjustmentRequestRepository.hasRoomHold(room.getRoomId(), date, timeSlotId, null))
                .map(this::toAvailableRoom)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleCalendarDayResponse> getCalendar(UUID instructorId, Integer month, Integer year) {
        LocalDate fromDate = LocalDate.of(year, month, 1);
        LocalDate toDate = fromDate.with(TemporalAdjusters.lastDayOfMonth());
        Map<LocalDate, List<ScheduleCalendarItemDto>> itemsByDate = new LinkedHashMap<>();
        Set<UUID> cancelledOriginalScheduleIds = cancelledOriginalScheduleIds(overrideRepository.findByInstructorAndDateBetween(instructorId, fromDate, toDate));
        scheduleRepository.findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(instructorId, fromDate, toDate)
                .stream()
                .filter(schedule -> !cancelledOriginalScheduleIds.contains(schedule.getScheduleId()))
                .forEach(schedule -> itemsByDate.computeIfAbsent(schedule.getDate(), key -> new ArrayList<>()).add(toCalendarItem(schedule)));
        overrideRepository.findByInstructorAndDateBetween(instructorId, fromDate, toDate)
                .forEach(override -> itemsByDate.computeIfAbsent(override.getTeachingDate(), key -> new ArrayList<>()).add(toCalendarItem(override)));

        List<ScheduleCalendarDayResponse> days = new ArrayList<>();
        for (LocalDate date = fromDate; !date.isAfter(toDate); date = date.plusDays(1)) {
            List<ScheduleCalendarItemDto> items = itemsByDate.getOrDefault(date, List.of());
            days.add(ScheduleCalendarDayResponse.builder()
                    .date(date)
                    .dayLabel(dayLabel(date.getDayOfWeek().getValue()))
                    .status(resolveDayStatus(items))
                    .items(items)
                    .build());
        }
        return days;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleWeekItemResponse> getInstructorWeek(UUID instructorId, LocalDate date, UUID semesterId) {
        LocalDate fromDate = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate toDate = fromDate.plusDays(6);
        List<ScheduleWeekItemResponse> items = new ArrayList<>();
        Set<UUID> cancelledOriginalScheduleIds = cancelledOriginalScheduleIds(overrideRepository.findByInstructorAndDateBetween(instructorId, fromDate, toDate));
        scheduleRepository.findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(instructorId, fromDate, toDate).stream()
                .filter(schedule -> !cancelledOriginalScheduleIds.contains(schedule.getScheduleId()))
                .filter(schedule -> semesterId == null || semesterId.equals(schedule.getSemesterId()))
                .map(this::toWeekItem)
                .forEach(items::add);
        overrideRepository.findByInstructorAndDateBetween(instructorId, fromDate, toDate).stream()
                .map(this::toWeekItem)
                .forEach(items::add);
        return items.stream()
                .sorted(Comparator.comparing(ScheduleWeekItemResponse::getDate)
                        .thenComparing(item -> item.getTimeSlotLabel() == null ? "" : item.getTimeSlotLabel()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleTeachingProgressReportResponse> getTeachingProgress(UUID semesterId, UUID instructorId, UUID courseClassId) {
        List<CourseClass> courseClasses = resolveCourseClassesForProgress(semesterId, courseClassId);
        return courseClasses.stream()
                .filter(courseClass -> instructorId == null || hasInstructorSchedule(courseClass.getCourseClassId(), instructorId))
                .map(this::buildProgress)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentStatisticsResponse getScheduleAdjustmentStatistics() {
        long total = nullToZero(adjustmentRequestRepository.countByIsActiveTrue());
        long approved = nullToZero(adjustmentRequestRepository.countByStatusAndIsActiveTrue("APPROVED"));
        return ScheduleAdjustmentStatisticsResponse.builder()
                .totalRequests(total)
                .pendingRequests(nullToZero(adjustmentRequestRepository.countByStatusAndIsActiveTrue("PENDING")))
                .approvedRequests(approved)
                .rejectedRequests(nullToZero(adjustmentRequestRepository.countByStatusAndIsActiveTrue("REJECTED")))
                .returnedRequests(nullToZero(adjustmentRequestRepository.countByStatusAndIsActiveTrue("RETURNED")))
                .conflictDetectedRequests(nullToZero(adjustmentRequestRepository.countByStatusAndIsActiveTrue("CONFLICT_DETECTED")))
                .approvalRate(total == 0 ? 0D : (approved * 100D / total))
                .build();
    }

    private InstructorCourseClassSummaryResponse buildCourseClassSummary(CourseClass courseClass, List<Schedule> schedules) {
        Course course = course(courseClass.getCourseId());
        int requiredPeriods = requiredPeriods(course);
        int taughtPeriods = defaultInt(progressLogRepository.sumTaughtPeriods(courseClass.getCourseClassId()));
        return InstructorCourseClassSummaryResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .courseId(course.getCourseId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .credits(course.getCredits())
                .semesterId(courseClass.getSemesterId())
                .startDate(courseClass.getStartDate())
                .endDate(courseClass.getEndDate())
                .requiredPeriods(requiredPeriods)
                .taughtPeriods(taughtPeriods)
                .remainingPeriods(Math.max(requiredPeriods - taughtPeriods, 0))
                .fixedScheduleText(buildFixedScheduleText(schedules))
                .build();
    }

    private FixedSessionResponse toFixedSession(Schedule schedule) {
        return FixedSessionResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .courseClassId(schedule.getCourseClass().getCourseClassId())
                .date(schedule.getDate())
                .dayOfWeek(schedule.getDayOfWeek())
                .dayLabel(dayLabel(schedule.getDayOfWeek()))
                .timeSlotId(schedule.getTimeSlot().getTimeSlotId())
                .slotCode(schedule.getTimeSlot().getSlotCode())
                .timeSlotLabel(timeSlotLabel(schedule.getTimeSlot()))
                .roomId(schedule.getRoom().getRoomId())
                .roomCode(schedule.getRoom().getCode())
                .numberOfPeriods(schedule.getNumberOfPeriods())
                .status(schedule.getScheduleStatus() == null ? "PLANNED" : schedule.getScheduleStatus())
                .build();
    }

    private AvailableRoomResponse toAvailableRoom(Room room) {
        return AvailableRoomResponse.builder()
                .roomId(room.getRoomId())
                .roomCode(room.getCode())
                .roomName(room.getName())
                .buildingId(room.getBuilding() != null ? room.getBuilding().getBuildingId() : null)
                .buildingName(room.getBuilding() != null ? room.getBuilding().getName() : null)
                .floorNumber(room.getFloorNumber())
                .capacity(room.getCapacity())
                .type(room.getType())
                .status(room.getStatus())
                .build();
    }

    private ScheduleCalendarItemDto toCalendarItem(Schedule schedule) {
        return ScheduleCalendarItemDto.builder()
                .id(schedule.getScheduleId())
                .courseClassId(schedule.getCourseClass().getCourseClassId())
                .courseClassCode(schedule.getCourseClass().getClassCode())
                .timeSlotId(schedule.getTimeSlot().getTimeSlotId())
                .timeSlotLabel(timeSlotLabel(schedule.getTimeSlot()))
                .roomId(schedule.getRoom().getRoomId())
                .roomCode(schedule.getRoom().getCode())
                .status(schedule.getScheduleStatus() == null ? "FIXED" : schedule.getScheduleStatus())
                .note(schedule.getNote())
                .build();
    }

    private ScheduleCalendarItemDto toCalendarItem(TeachingSessionOverride override) {
        return ScheduleCalendarItemDto.builder()
                .id(override.getOverrideId())
                .courseClassId(override.getCourseClassId())
                .courseClassCode(courseClassCode(override.getCourseClassId()))
                .timeSlotId(override.getTimeSlotId())
                .timeSlotLabel(timeSlotLabel(slotById(override.getTimeSlotId())))
                .roomId(override.getRoomId())
                .roomCode(roomCode(override.getRoomId()))
                .status(resolveOverrideStatus(override))
                .note(override.getNote())
                .build();
    }

    private ScheduleWeekItemResponse toWeekItem(Schedule schedule) {
        Course course = course(schedule.getCourseClass().getCourseId());
        return ScheduleWeekItemResponse.builder()
                .date(schedule.getDate())
                .dayLabel(dayLabel(schedule.getDayOfWeek()))
                .courseClassId(schedule.getCourseClass().getCourseClassId())
                .courseClassCode(schedule.getCourseClass().getClassCode())
                .courseName(course.getName())
                .timeSlotId(schedule.getTimeSlot().getTimeSlotId())
                .timeSlotLabel(timeSlotLabel(schedule.getTimeSlot()))
                .roomId(schedule.getRoom().getRoomId())
                .roomCode(schedule.getRoom().getCode())
                .status(schedule.getScheduleStatus() == null ? "PLANNED" : schedule.getScheduleStatus())
                .note(schedule.getNote())
                .build();
    }

    private ScheduleWeekItemResponse toWeekItem(TeachingSessionOverride override) {
        CourseClass courseClass = courseClass(override.getCourseClassId());
        Course course = course(courseClass.getCourseId());
        TimeSlot slot = slotById(override.getTimeSlotId());
        return ScheduleWeekItemResponse.builder()
                .date(override.getTeachingDate())
                .dayLabel(dayLabel(override.getTeachingDate().getDayOfWeek().getValue()))
                .courseClassId(override.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .courseName(course.getName())
                .timeSlotId(override.getTimeSlotId())
                .timeSlotLabel(timeSlotLabel(slot))
                .roomId(override.getRoomId())
                .roomCode(roomCode(override.getRoomId()))
                .status(resolveOverrideStatus(override))
                .note(override.getNote())
                .build();
    }

    private ScheduleTeachingProgressReportResponse buildProgress(CourseClass courseClass) {
        Course course = course(courseClass.getCourseId());
        int requiredPeriods = requiredPeriods(course);
        int taughtPeriods = defaultInt(progressLogRepository.sumTaughtPeriods(courseClass.getCourseClassId()));
        int remaining = Math.max(requiredPeriods - taughtPeriods, 0);
        return ScheduleTeachingProgressReportResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .courseName(course.getName())
                .credits(course.getCredits())
                .startDate(courseClass.getStartDate())
                .endDate(courseClass.getEndDate())
                .requiredPeriods(requiredPeriods)
                .instructorAbsentSessions(progressLogRepository.countInstructorAbsentSessions(courseClass.getCourseClassId()))
                .taughtPeriods(taughtPeriods)
                .remainingPeriods(remaining)
                .alertStatus(resolveProgressAlert(requiredPeriods, taughtPeriods, courseClass.getEndDate()))
                .build();
    }

    private List<CourseClass> resolveCourseClassesForProgress(UUID semesterId, UUID courseClassId) {
        if (courseClassId != null) {
            return List.of(courseClass(courseClassId));
        }
        UUID targetSemesterId = semesterId != null ? semesterId : resolveCurrentSemesterId();
        return courseClassRepository.findBySemesterId(targetSemesterId);
    }

    private boolean hasInstructorSchedule(UUID courseClassId, UUID instructorId) {
        return scheduleRepository.findByCourseClassCourseClassId(courseClassId).stream()
                .anyMatch(schedule -> schedule.getInstructor() != null && instructorId.equals(schedule.getInstructor().getEmployeeId()));
    }

    private String buildFixedScheduleText(List<Schedule> schedules) {
        return schedules.stream()
                .sorted(Comparator.comparing(Schedule::getDayOfWeek, Comparator.nullsLast(Integer::compareTo)))
                .map(schedule -> dayLabel(schedule.getDayOfWeek()) + " | " + timeSlotLabel(schedule.getTimeSlot()) + " | "
                        + (schedule.getRoom() == null ? "" : schedule.getRoom().getCode()))
                .distinct()
                .collect(Collectors.joining("; "));
    }

    private String resolveDayStatus(List<ScheduleCalendarItemDto> items) {
        if (items.isEmpty()) {
            return "EMPTY";
        }
        if (items.stream().anyMatch(item -> "MAKEUP".equals(item.getStatus()) || "EXTRA".equals(item.getStatus()))) {
            return "MAKEUP";
        }
        if (items.stream().anyMatch(item -> "ABSENT".equals(item.getStatus()))) {
            return "ABSENT";
        }
        return "FIXED";
    }

    private String resolveOverrideStatus(TeachingSessionOverride override) {
        if ("CANCELLED".equals(override.getOverrideType())) {
            return "ABSENT";
        }
        return override.getOverrideType() == null ? "MAKEUP" : override.getOverrideType();
    }

    private Set<UUID> cancelledOriginalScheduleIds(List<TeachingSessionOverride> overrides) {
        return overrides.stream()
                .filter(override -> "CANCELLED".equals(override.getOverrideType()))
                .map(TeachingSessionOverride::getOriginalScheduleId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private String resolveProgressAlert(int requiredPeriods, int taughtPeriods, LocalDate endDate) {
        if (requiredPeriods <= 0 || taughtPeriods >= requiredPeriods) {
            return "ON_TRACK";
        }
        if (endDate != null && !LocalDate.now().isBefore(endDate.minusDays(14))) {
            return "CRITICAL";
        }
        double ratio = taughtPeriods * 1D / requiredPeriods;
        return ratio < 0.7D ? "BEHIND" : "ON_TRACK";
    }

    private UUID resolveCurrentInstructorId(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        Employee employee = employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không có hồ sơ nhân viên"));
        InstructorProfile instructor = instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không phải giảng viên"));
        return instructor.getEmployee().getEmployeeId();
    }

    private UUID resolveCurrentSemesterId() {
        return semesterRepository.findAll().stream()
                .filter(semester -> Boolean.TRUE.equals(semester.getStatus()))
                .max(Comparator.comparing(Semester::getStartDate))
                .or(() -> semesterRepository.findAll().stream().max(Comparator.comparing(Semester::getStartDate)))
                .map(Semester::getSemesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ"));
    }

    private List<TimeSlot> activeTimeSlots() {
        return timeSlotRepository.findAll().stream()
                .filter(slot -> Boolean.TRUE.equals(slot.getIsActive()))
                .sorted(Comparator.comparing(TimeSlot::getStartTime, Comparator.nullsLast(LocalTime::compareTo)))
                .toList();
    }

    private AvailabilitySlotDto availability(TimeSlot slot, String reason, UUID courseClassId, String courseClassCode) {
        return AvailabilitySlotDto.builder()
                .timeSlotId(slot == null ? null : slot.getTimeSlotId())
                .slotCode(slot == null ? null : slot.getSlotCode())
                .label(timeSlotLabel(slot))
                .reason(reason)
                .courseClassId(courseClassId)
                .courseClassCode(courseClassCode)
                .build();
    }

    private TimeSlot slotById(UUID timeSlotId) {
        if (timeSlotId == null) {
            return null;
        }
        return timeSlotRepository.findById(timeSlotId).orElse(null);
    }

    private CourseClass courseClass(UUID courseClassId) {
        return courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
    }

    private Course course(UUID courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học phần"));
    }

    private String courseClassCode(UUID courseClassId) {
        if (courseClassId == null) {
            return null;
        }
        return courseClassRepository.findById(courseClassId).map(CourseClass::getClassCode).orElse(null);
    }

    private String roomCode(UUID roomId) {
        if (roomId == null) {
            return null;
        }
        return roomRepository.findById(roomId).map(Room::getCode).orElse(null);
    }

    private int requiredPeriods(Course course) {
        if (course.getTheoryHours() != null && course.getTheoryHours() > 0) {
            return course.getTheoryHours().intValue();
        }
        if (course.getPracticeHours() != null && course.getPracticeHours() > 0) {
            return course.getPracticeHours().intValue();
        }
        if (course.getInternshipCredits() != null && course.getInternshipCredits() > 0) {
            return (int) Math.round(course.getInternshipCredits() * 45);
        }
        double credits = course.getCredits() == null ? 0 : course.getCredits();
        return (int) Math.round(credits * 15);
    }

    private String timeSlotLabel(TimeSlot slot) {
        if (slot == null) {
            return null;
        }
        return slot.getSlotCode() + " (" + slot.getStartTime() + "-" + slot.getEndTime() + ")";
    }

    private String dayLabel(Integer dayOfWeek) {
        if (dayOfWeek == null) {
            return null;
        }
        return dayOfWeek == 7 ? "CN" : "T" + (dayOfWeek + 1);
    }

    private int defaultInt(Integer value) {
        return value == null ? 0 : value;
    }

    private long nullToZero(Long value) {
        return value == null ? 0L : value;
    }
}
