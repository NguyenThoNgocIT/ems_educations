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
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.teachingprogress.repository.TeachingProgressLogRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
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
import java.util.Optional;
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
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final EmployeeLeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InstructorCourseClassSummaryResponse> getCurrentInstructorCourseClasses(String username, UUID semesterId) {
        UUID instructorId = resolveCurrentInstructorId(username);
        UUID targetSemesterId = semesterId != null ? semesterId : resolveCurrentSemesterId();

        Map<UUID, CourseClass> assignedCourseClasses = teachingAssignmentRepository
                .findByInstructorIdAndIsActiveTrue(instructorId)
                .stream()
                .filter(assignment -> targetSemesterId.equals(assignment.getSemesterId()))
                .map(TeachingAssignment::getCourseClassId)
                .distinct()
                .map(courseClassRepository::findById)
                .flatMap(Optional::stream)
                .filter(courseClass -> targetSemesterId.equals(courseClass.getSemesterId()))
                .collect(Collectors.toMap(
                        CourseClass::getCourseClassId,
                        courseClass -> courseClass,
                        (first, ignored) -> first,
                        LinkedHashMap::new));

        List<TeachingSessionOverride> overrides = overrideRepository.findAll().stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsActive()) && instructorId.equals(o.getInstructorId()))
                .toList();

        for (TeachingSessionOverride override : overrides) {
            CourseClass cc = courseClassRepository.findById(override.getCourseClassId()).orElse(null);
            if (cc != null && targetSemesterId.equals(cc.getSemesterId())) {
                assignedCourseClasses.putIfAbsent(cc.getCourseClassId(), cc);
            }
        }

        List<InstructorCourseClassSummaryResponse> summaries = new ArrayList<>();
        for (CourseClass courseClass : assignedCourseClasses.values()) {
            List<Schedule> classSchedules = scheduleRepository.findByCourseClassCourseClassId(courseClass.getCourseClassId())
                    .stream()
                    .filter(this::isVisibleBaseSchedule)
                    .filter(schedule -> schedule.getInstructor() != null
                            && instructorId.equals(schedule.getInstructor().getEmployeeId()))
                    .toList();
            summaries.add(buildCourseClassSummary(courseClass, classSchedules));
        }

        return summaries.stream()
                .sorted(Comparator.comparing(InstructorCourseClassSummaryResponse::getCourseClassCode))
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

    private boolean isSessionCancelled(UUID scheduleId, LocalDate date, List<TeachingSessionOverride> overrides) {
        return overrides.stream()
                .anyMatch(override -> "CANCELLED".equals(override.getOverrideType())
                        && Objects.equals(override.getOriginalScheduleId(), scheduleId)
                        && (override.getOriginalDate() == null || Objects.equals(override.getOriginalDate(), date)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleCalendarDayResponse> getCalendar(UUID instructorId, Integer month, Integer year) {
        LocalDate fromDate = LocalDate.of(year, month, 1);
        LocalDate toDate = fromDate.with(TemporalAdjusters.lastDayOfMonth());
        Map<LocalDate, List<ScheduleCalendarItemDto>> itemsByDate = new LinkedHashMap<>();

        List<TeachingSessionOverride> allOverrides = overrideRepository.findByInstructorAndDateBetween(instructorId, fromDate, toDate);

        List<Schedule> schedules = scheduleRepository.findByInstructorEmployeeId(instructorId).stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .toList();

        for (Schedule schedule : schedules) {
            if (schedule.getDate() != null) {
                LocalDate date = schedule.getDate();
                if (!date.isBefore(fromDate) && !date.isAfter(toDate)) {
                    if (!isSessionCancelled(schedule.getScheduleId(), date, allOverrides)) {
                        itemsByDate.computeIfAbsent(date, key -> new ArrayList<>()).add(toCalendarItem(schedule));
                    }
                }
            } else {
                Semester semester = semesterRepository.findById(schedule.getSemesterId()).orElse(null);
                if (semester != null) {
                    LocalDate recStart = schedule.getCourseClass().getStartDate() != null ? schedule.getCourseClass().getStartDate() : semester.getStartDate();
                    LocalDate recEnd = schedule.getCourseClass().getEndDate() != null ? schedule.getCourseClass().getEndDate() : semester.getEndDate();
                    if (recStart != null && recEnd != null) {
                        LocalDate searchStart = recStart.isAfter(fromDate) ? recStart : fromDate;
                        LocalDate searchEnd = recEnd.isBefore(toDate) ? recEnd : toDate;
                        for (LocalDate date = searchStart; !date.isAfter(searchEnd); date = date.plusDays(1)) {
                            if (date.getDayOfWeek().getValue() == schedule.getDayOfWeek()) {
                                if (!isSessionCancelled(schedule.getScheduleId(), date, allOverrides)) {
                                    itemsByDate.computeIfAbsent(date, key -> new ArrayList<>()).add(toCalendarItem(schedule));
                                }
                            }
                        }
                    }
                }
            }
        }

        // Add override items (makeup, extra, etc.)
        allOverrides.stream()
                .filter(override -> !"CANCELLED".equals(override.getOverrideType()))
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

        List<TeachingSessionOverride> allOverrides = overrideRepository.findByInstructorAndDateBetween(instructorId, fromDate, toDate);

        List<Schedule> schedules = scheduleRepository.findByInstructorEmployeeId(instructorId).stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .filter(s -> semesterId == null || semesterId.equals(s.getSemesterId()))
                .toList();

        for (Schedule schedule : schedules) {
            if (schedule.getDate() != null) {
                LocalDate d = schedule.getDate();
                if (!d.isBefore(fromDate) && !d.isAfter(toDate)) {
                    if (!isSessionCancelled(schedule.getScheduleId(), d, allOverrides)) {
                        items.add(toWeekItem(schedule, d));
                    }
                }
            } else {
                Semester semester = semesterRepository.findById(schedule.getSemesterId()).orElse(null);
                if (semester != null) {
                    LocalDate recStart = schedule.getCourseClass().getStartDate() != null ? schedule.getCourseClass().getStartDate() : semester.getStartDate();
                    LocalDate recEnd = schedule.getCourseClass().getEndDate() != null ? schedule.getCourseClass().getEndDate() : semester.getEndDate();
                    if (recStart != null && recEnd != null) {
                        LocalDate searchStart = recStart.isAfter(fromDate) ? recStart : fromDate;
                        LocalDate searchEnd = recEnd.isBefore(toDate) ? recEnd : toDate;
                        for (LocalDate d = searchStart; !d.isAfter(searchEnd); d = d.plusDays(1)) {
                            if (d.getDayOfWeek().getValue() == schedule.getDayOfWeek()) {
                                if (!isSessionCancelled(schedule.getScheduleId(), d, allOverrides)) {
                                    items.add(toWeekItem(schedule, d));
                                }
                            }
                        }
                    }
                }
            }
        }

        allOverrides.stream()
                .filter(override -> !"CANCELLED".equals(override.getOverrideType()))
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
        List<CourseClass> courseClasses = resolveCourseClassesForProgress(semesterId, instructorId, courseClassId);
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
        Semester semester = semesterRepository.findById(courseClass.getSemesterId()).orElse(null);
        int requiredPeriods = requiredPeriods(course);
        int taughtPeriods = defaultInt(progressLogRepository.sumTaughtPeriods(courseClass.getCourseClassId()));
        int scheduledPeriods = schedules.stream()
                .map(Schedule::getNumberOfPeriods)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();
        int totalStudents = (int) courseRegistrationRepository.countByCourseClassIdAndIsActiveTrue(courseClass.getCourseClassId());
        return InstructorCourseClassSummaryResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .courseId(course.getCourseId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .credits(course.getCredits())
                .semesterId(courseClass.getSemesterId())
                .semesterCode(semester == null ? null : semester.getCode())
                .semesterName(semester == null ? null : semester.getName())
                .semesterStartDate(semester == null ? null : semester.getStartDate())
                .semesterEndDate(semester == null ? null : semester.getEndDate())
                .startDate(courseClass.getStartDate())
                .endDate(courseClass.getEndDate())
                .maxStudent(courseClass.getMaxStudent())
                .currentStudent(courseClass.getCurrentStudent())
                .totalStudents(totalStudents)
                .requiredPeriods(requiredPeriods)
                .taughtPeriods(taughtPeriods)
                .remainingPeriods(Math.max(requiredPeriods - taughtPeriods, 0))
                .scheduledPeriods(scheduledPeriods)
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
        Course course = course(schedule.getCourseClass().getCourseId());
        return ScheduleCalendarItemDto.builder()
                .id(schedule.getScheduleId())
                .courseClassId(schedule.getCourseClass().getCourseClassId())
                .courseClassCode(schedule.getCourseClass().getClassCode())
                .courseClassName(schedule.getCourseClass().getClassCode())
                .courseName(course.getName())
                .timeSlotId(schedule.getTimeSlot().getTimeSlotId())
                .timeSlotLabel(timeSlotLabel(schedule.getTimeSlot()))
                .startTime(schedule.getTimeSlot().getStartTime())
                .endTime(schedule.getTimeSlot().getEndTime())
                .numberOfPeriods(schedule.getNumberOfPeriods())
                .roomId(schedule.getRoom().getRoomId())
                .roomCode(schedule.getRoom().getCode())
                .mode(schedule.getMode())
                .status(schedule.getScheduleStatus() == null ? "FIXED" : schedule.getScheduleStatus())
                .note(schedule.getNote())
                .build();
    }

    private ScheduleCalendarItemDto toCalendarItem(TeachingSessionOverride override) {
        TimeSlot slot = slotById(override.getTimeSlotId());
        return ScheduleCalendarItemDto.builder()
                .id(override.getOverrideId())
                .courseClassId(override.getCourseClassId())
                .courseClassCode(courseClassCode(override.getCourseClassId()))
                .courseClassName(courseClassCode(override.getCourseClassId()))
                .courseName(course(courseClass(override.getCourseClassId()).getCourseId()).getName())
                .timeSlotId(override.getTimeSlotId())
                .timeSlotLabel(slot != null ? timeSlotLabel(slot) : "")
                .startTime(slot != null ? slot.getStartTime() : null)
                .endTime(slot != null ? slot.getEndTime() : null)
                .numberOfPeriods(override.getNumberOfPeriods())
                .roomId(override.getRoomId())
                .roomCode(roomCode(override.getRoomId()))
                .status(resolveOverrideStatus(override))
                .note(override.getNote())
                .build();
    }

    private ScheduleWeekItemResponse toWeekItem(Schedule schedule, LocalDate date) {
        Course course = course(schedule.getCourseClass().getCourseId());
        return ScheduleWeekItemResponse.builder()
                .date(date != null ? date : schedule.getDate())
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
        Semester semester = semesterRepository.findById(courseClass.getSemesterId()).orElse(null);
        int requiredPeriods = requiredPeriods(course);
        int taughtPeriods = defaultInt(progressLogRepository.sumTaughtPeriods(courseClass.getCourseClassId()));
        int remaining = Math.max(requiredPeriods - taughtPeriods, 0);
        return ScheduleTeachingProgressReportResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .semesterId(courseClass.getSemesterId())
                .semesterCode(semester == null ? null : semester.getCode())
                .semesterName(semester == null ? null : semester.getName())
                .semesterStartDate(semester == null ? null : semester.getStartDate())
                .semesterEndDate(semester == null ? null : semester.getEndDate())
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

    private List<CourseClass> resolveCourseClassesForProgress(UUID semesterId, UUID instructorId, UUID courseClassId) {
        if (courseClassId != null) {
            return List.of(courseClass(courseClassId));
        }
        if (semesterId == null && instructorId != null) {
            return teachingAssignmentRepository.findByInstructorIdAndIsActiveTrue(instructorId).stream()
                    .map(TeachingAssignment::getCourseClassId)
                    .distinct()
                    .map(courseClassRepository::findById)
                    .flatMap(Optional::stream)
                    .collect(Collectors.toMap(
                            CourseClass::getCourseClassId,
                            courseClass -> courseClass,
                            (first, ignored) -> first))
                    .values()
                    .stream()
                    .sorted(Comparator.comparing(CourseClass::getStartDate, Comparator.nullsLast(Comparator.reverseOrder())))
                    .toList();
        }
        UUID targetSemesterId = semesterId != null ? semesterId : resolveCurrentSemesterId();
        if (instructorId != null) {
            return teachingAssignmentRepository.findByInstructorIdAndIsActiveTrue(instructorId).stream()
                    .filter(assignment -> targetSemesterId.equals(assignment.getSemesterId()))
                    .map(TeachingAssignment::getCourseClassId)
                    .distinct()
                    .map(courseClassRepository::findById)
                    .flatMap(Optional::stream)
                    .filter(courseClass -> targetSemesterId.equals(courseClass.getSemesterId()))
                    .sorted(Comparator.comparing(CourseClass::getStartDate, Comparator.nullsLast(Comparator.reverseOrder())))
                    .toList();
        }
        return courseClassRepository.findBySemesterId(targetSemesterId);
    }

    private boolean hasInstructorSchedule(UUID courseClassId, UUID instructorId) {
        CourseClass courseClass = courseClass(courseClassId);
        return teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                instructorId,
                courseClassId,
                courseClass.getSemesterId());
    }

    private boolean isVisibleBaseSchedule(Schedule schedule) {
        return Boolean.TRUE.equals(schedule.getIsActive())
                && schedule.getDeletedAt() == null
                && (schedule.getScheduleStatus() == null
                || !List.of("CANCELLED", "ABSENT").contains(schedule.getScheduleStatus()));
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
        LocalDate today = LocalDate.now();
        return semesterRepository.findAll().stream()
                .filter(semester -> Boolean.TRUE.equals(semester.getStatus()))
                .filter(semester -> !today.isBefore(semester.getStartDate()) && !today.isAfter(semester.getEndDate()))
                .findFirst()
                .or(() -> semesterRepository.findAll().stream()
                        .filter(semester -> Boolean.TRUE.equals(semester.getStatus()))
                        .max(Comparator.comparing(Semester::getStartDate)))
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
