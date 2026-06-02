package com.quanlydaotao.backend.scheduleadjustment.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionCheckResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionItemResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionResponse;
import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import com.quanlydaotao.backend.scheduleadjustment.repository.ScheduleAdjustmentRequestRepository;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduleadjustment.service.ScheduleAdjustmentSuggestionService;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleAdjustmentSuggestionServiceImpl implements ScheduleAdjustmentSuggestionService {
    private static final List<String> VALID_TYPES = List.of("ABSENT_MAKEUP", "EXTRA_SESSION", "RESCHEDULE", "ROOM_CHANGE");
    private static final int DEFAULT_MAX_SUGGESTIONS = 10;
    private static final int DEFAULT_PERIODS_PER_SESSION = 3;

    private final CourseClassRepository courseClassRepository;
    private final SemesterRepository semesterRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final EmployeeLeaveRequestRepository leaveRequestRepository;
    private final ScheduleRepository scheduleRepository;
    private final TeachingSessionOverrideRepository overrideRepository;
    private final ScheduleAdjustmentRequestRepository requestRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final RoomRepository roomRepository;
    private final CourseRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentSuggestionResponse suggestForCurrentInstructor(String username, ScheduleAdjustmentSuggestionRequest request) {
        request.setRequestedByInstructorId(resolveCurrentInstructorId(username));
        return suggest(request);
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentSuggestionResponse suggest(ScheduleAdjustmentSuggestionRequest request) {
        String requestType = requireValidType(request.getRequestType());
        CourseClass courseClass = requireCourseClass(request.getCourseClassId());
        Semester semester = requireSemester(courseClass.getSemesterId());
        UUID instructorId = requireInstructor(request, courseClass);
        Schedule originalSchedule = resolveOriginalSchedule(request, requestType);
        int proposedPeriods = resolveProposedPeriods(request, originalSchedule);
        DateRange range = resolveRange(request, courseClass, semester);

        Map<UUID, TimeSlot> timeSlotsById = activeTimeSlots().stream()
                .collect(Collectors.toMap(TimeSlot::getTimeSlotId, Function.identity()));
        List<TimeSlot> timeSlots = filterTimeSlots(new ArrayList<>(timeSlotsById.values()), request);
        List<Room> rooms = filterRooms(activeRooms(), request, originalSchedule);

        List<ScheduleAdjustmentSuggestionItemResponse> validSuggestions = new ArrayList<>();
        int totalCandidates = 0;
        for (LocalDate date = range.fromDate(); !date.isAfter(range.toDate()); date = date.plusDays(1)) {
            if (!isPreferredDay(date, request)) {
                continue;
            }
            for (TimeSlot slot : timeSlots) {
                for (Room room : rooms) {
                    totalCandidates++;
                    CandidateResult result = evaluateCandidate(request, requestType, courseClass, semester, instructorId,
                            originalSchedule, date, slot, room, proposedPeriods, timeSlotsById);
                    if (result.valid()) {
                        validSuggestions.add(toSuggestion(result));
                    }
                }
            }
        }

        int limit = request.getMaxSuggestions() == null || request.getMaxSuggestions() < 1
                ? DEFAULT_MAX_SUGGESTIONS
                : Math.min(request.getMaxSuggestions(), 50);
        List<ScheduleAdjustmentSuggestionItemResponse> suggestions = validSuggestions.stream()
                .sorted(Comparator.comparing(ScheduleAdjustmentSuggestionItemResponse::getScore).reversed()
                        .thenComparing(ScheduleAdjustmentSuggestionItemResponse::getDate)
                        .thenComparing(ScheduleAdjustmentSuggestionItemResponse::getStartTime,
                                Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(limit)
                .toList();

        return ScheduleAdjustmentSuggestionResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .instructorId(instructorId)
                .requestType(requestType)
                .fromDate(range.fromDate())
                .toDate(range.toDate())
                .proposedPeriods(proposedPeriods)
                .totalCandidates(totalCandidates)
                .validCandidates(validSuggestions.size())
                .suggestions(suggestions)
                .build();
    }

    private CandidateResult evaluateCandidate(
            ScheduleAdjustmentSuggestionRequest request,
            String requestType,
            CourseClass courseClass,
            Semester semester,
            UUID instructorId,
            Schedule originalSchedule,
            LocalDate date,
            TimeSlot slot,
            Room room,
            int proposedPeriods,
            Map<UUID, TimeSlot> timeSlotsById) {
        List<ScheduleAdjustmentSuggestionCheckResponse> checks = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        int score = 100;

        boolean inRange = isDateInRange(date, courseClass, semester);
        add(checks, "R1_SEMESTER_RANGE", inRange ? "OK" : "ERROR",
                inRange ? "Ngay de xuat nam trong hoc ky/lop hoc phan" : "Ngay de xuat nam ngoai hoc ky/lop hoc phan");

        boolean sameOriginalSession = originalSchedule != null
                && Objects.equals(originalSchedule.getDate(), date)
                && originalSchedule.getTimeSlot() != null
                && Objects.equals(originalSchedule.getTimeSlot().getTimeSlotId(), slot.getTimeSlotId());
        if (sameOriginalSession && !"ROOM_CHANGE".equals(requestType)) {
            add(checks, "R2_ORIGINAL_SESSION", "ERROR", "Khong the goi y dung lai buoi nghi goc");
        } else {
            add(checks, "R2_ORIGINAL_SESSION", "OK", "Khong trung buoi nghi goc");
        }

        boolean instructorBusy = hasInstructorConflict(instructorId, date, slot, originalSchedule, timeSlotsById);
        add(checks, "R3_INSTRUCTOR_BUSY", instructorBusy ? "ERROR" : "OK",
                instructorBusy ? "Giang vien bi trung lich o ngay/tiet nay" : "Giang vien ranh o ngay/tiet nay");

        boolean onLeave = leaveRequestRepository.hasApprovedLeaveOnDate(instructorId, date);
        add(checks, "R4_INSTRUCTOR_LEAVE", onLeave ? "ERROR" : "OK",
                onLeave ? "Giang vien co don nghi da duyet trong ngay nay" : "Giang vien khong co don nghi da duyet trong ngay nay");

        boolean roomBusy = hasRoomConflict(room.getRoomId(), date, slot, originalSchedule, timeSlotsById)
                || requestRepository.hasRoomHold(room.getRoomId(), date, slot.getTimeSlotId(), null);
        add(checks, "R5_ROOM_BUSY", roomBusy ? "ERROR" : "OK",
                roomBusy ? "Phong da co lich hoac dang duoc giu boi yeu cau khac" : "Phong con trong");

        boolean capacityOk = courseClass.getMaxStudent() == null || room.getCapacity() == null
                || room.getCapacity() >= courseClass.getMaxStudent();
        add(checks, "R6_ROOM_CAPACITY", capacityOk ? "OK" : "ERROR",
                capacityOk ? "Phong du suc chua" : "Suc chua phong nho hon si so toi da cua lop hoc phan");

        boolean roomAvailable = isRoomAvailable(room);
        add(checks, "R7_ROOM_STATUS", roomAvailable ? "OK" : "ERROR",
                roomAvailable ? "Phong dang kha dung" : "Phong dang dong, bao tri hoac khong kha dung");

        boolean classBusy = hasCourseClassConflict(courseClass.getCourseClassId(), date, slot, originalSchedule, timeSlotsById);
        add(checks, "R8_COURSE_CLASS_BUSY", classBusy ? "ERROR" : "OK",
                classBusy ? "Lop hoc phan bi trung lich o ngay/tiet nay" : "Lop hoc phan khong trung lich");

        boolean studentBusy = hasRegisteredStudentConflict(courseClass.getCourseClassId(), date, slot, timeSlotsById);
        add(checks, "R9_STUDENT_BUSY", studentBusy ? "ERROR" : "OK",
                studentBusy ? "Co sinh vien trong lop bi trung lich hoc phan khac" : "Sinh vien trong lop khong bi trung lich hoc phan khac");

        if (!date.isBefore(semester.getEndDate().minusDays(7))) {
            warnings.add("Ngay de xuat gan cuoi hoc ky, nen thong bao som cho sinh vien");
            score -= 20;
        }
        score += scorePreferences(request, originalSchedule, date, slot, room);
        score -= Math.min(20, Math.max(0, daysFromAbsent(request, date)));
        if (slot.getStartTime() != null && !slot.getStartTime().isBefore(LocalTime.of(17, 0))) {
            warnings.add("Khung gio muon, can can nhac suc hoc cua sinh vien");
            score -= 10;
        }

        boolean valid = checks.stream().noneMatch(check -> "ERROR".equals(check.getStatus()));
        return new CandidateResult(valid, date, slot, room, proposedPeriods, Math.max(score, 0), checks, warnings);
    }

    private ScheduleAdjustmentSuggestionItemResponse toSuggestion(CandidateResult result) {
        Room room = result.room();
        TimeSlot slot = result.slot();
        return ScheduleAdjustmentSuggestionItemResponse.builder()
                .date(result.date())
                .dayOfWeek(toSystemDayOfWeek(result.date()))
                .dayLabel(toDayLabel(result.date()))
                .timeSlotId(slot.getTimeSlotId())
                .slotCode(slot.getSlotCode())
                .timeSlotLabel(buildTimeSlotLabel(slot))
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .roomId(room.getRoomId())
                .roomCode(room.getCode())
                .roomName(room.getName())
                .buildingId(room.getBuilding() != null ? room.getBuilding().getBuildingId() : null)
                .buildingName(room.getBuilding() != null ? room.getBuilding().getName() : null)
                .floorNumber(room.getFloorNumber())
                .capacity(room.getCapacity())
                .proposedPeriods(result.proposedPeriods())
                .score(result.score())
                .checks(result.checks())
                .warnings(result.warnings())
                .build();
    }

    private List<TimeSlot> activeTimeSlots() {
        return timeSlotRepository.findAll().stream()
                .filter(slot -> Boolean.TRUE.equals(slot.getIsActive()))
                .sorted(Comparator.comparing(TimeSlot::getStartTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    private List<Room> activeRooms() {
        return roomRepository.findAll().stream()
                .filter(room -> Boolean.TRUE.equals(room.getIsActive()))
                .sorted(Comparator.comparing(Room::getCode, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
    }

    private List<TimeSlot> filterTimeSlots(List<TimeSlot> timeSlots, ScheduleAdjustmentSuggestionRequest request) {
        if (request.getPreferredTimeSlotIds() == null || request.getPreferredTimeSlotIds().isEmpty()) {
            return timeSlots;
        }
        Set<UUID> preferredIds = new HashSet<>(request.getPreferredTimeSlotIds());
        return timeSlots.stream()
                .filter(slot -> preferredIds.contains(slot.getTimeSlotId()))
                .toList();
    }

    private List<Room> filterRooms(List<Room> rooms, ScheduleAdjustmentSuggestionRequest request, Schedule originalSchedule) {
        return rooms.stream()
                .filter(room -> request.getPreferredRoomId() == null || Objects.equals(room.getRoomId(), request.getPreferredRoomId()))
                .filter(room -> request.getPreferredBuildingId() == null
                        || (room.getBuilding() != null && Objects.equals(room.getBuilding().getBuildingId(), request.getPreferredBuildingId())))
                .filter(room -> !Boolean.TRUE.equals(request.getPreferSameRoom())
                        || originalSchedule == null
                        || originalSchedule.getRoom() == null
                        || Objects.equals(room.getRoomId(), originalSchedule.getRoom().getRoomId()))
                .toList();
    }

    private boolean hasInstructorConflict(UUID instructorId, LocalDate date, TimeSlot slot, Schedule originalSchedule, Map<UUID, TimeSlot> timeSlotsById) {
        boolean fixedConflict = scheduleRepository.findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(instructorId, date, date)
                .stream()
                .filter(schedule -> originalSchedule == null || !Objects.equals(schedule.getScheduleId(), originalSchedule.getScheduleId()))
                .filter(schedule -> !"CANCELLED".equals(schedule.getScheduleStatus()))
                .anyMatch(schedule -> overlaps(slot, schedule.getTimeSlot()));
        if (fixedConflict) {
            return true;
        }
        return overrideRepository.findVisibleByInstructorAndDate(instructorId, date).stream()
                .anyMatch(override -> overlaps(slot, timeSlotsById.get(override.getTimeSlotId())));
    }

    private boolean hasRoomConflict(UUID roomId, LocalDate date, TimeSlot slot, Schedule originalSchedule, Map<UUID, TimeSlot> timeSlotsById) {
        boolean fixedConflict = scheduleRepository.findByRoomRoomId(roomId).stream()
                .filter(schedule -> Objects.equals(schedule.getDate(), date))
                .filter(schedule -> originalSchedule == null || !Objects.equals(schedule.getScheduleId(), originalSchedule.getScheduleId()))
                .filter(schedule -> !"CANCELLED".equals(schedule.getScheduleStatus()))
                .anyMatch(schedule -> overlaps(slot, schedule.getTimeSlot()));
        if (fixedConflict) {
            return true;
        }
        return overrideRepository.findVisibleByRoomAndDate(roomId, date).stream()
                .anyMatch(override -> overlaps(slot, timeSlotsById.get(override.getTimeSlotId())));
    }

    private boolean hasCourseClassConflict(UUID courseClassId, LocalDate date, TimeSlot slot, Schedule originalSchedule, Map<UUID, TimeSlot> timeSlotsById) {
        boolean fixedConflict = scheduleRepository.findByCourseClassCourseClassIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(courseClassId, date, date)
                .stream()
                .filter(schedule -> originalSchedule == null || !Objects.equals(schedule.getScheduleId(), originalSchedule.getScheduleId()))
                .filter(schedule -> !"CANCELLED".equals(schedule.getScheduleStatus()))
                .anyMatch(schedule -> overlaps(slot, schedule.getTimeSlot()));
        if (fixedConflict) {
            return true;
        }
        return overrideRepository.findVisibleByCourseClassAndDate(courseClassId, date).stream()
                .anyMatch(override -> overlaps(slot, timeSlotsById.get(override.getTimeSlotId())));
    }

    private boolean hasRegisteredStudentConflict(UUID targetCourseClassId, LocalDate date, TimeSlot slot, Map<UUID, TimeSlot> timeSlotsById) {
        List<UUID> studentIds = registrationRepository.findByCourseClassIdAndIsActiveTrue(targetCourseClassId).stream()
                .map(CourseRegistration::getStudentId)
                .filter(Objects::nonNull)
                .toList();
        if (studentIds.isEmpty()) {
            return false;
        }
        Set<UUID> checkedCourseClassIds = new HashSet<>();
        for (UUID studentId : studentIds) {
            for (CourseRegistration registration : registrationRepository.findByStudentIdAndIsActiveTrue(studentId)) {
                UUID otherCourseClassId = registration.getCourseClassId();
                if (otherCourseClassId == null || Objects.equals(otherCourseClassId, targetCourseClassId)
                        || !checkedCourseClassIds.add(otherCourseClassId)) {
                    continue;
                }
                if (hasCourseClassConflict(otherCourseClassId, date, slot, null, timeSlotsById)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean overlaps(TimeSlot target, TimeSlot existing) {
        if (target == null || existing == null) {
            return false;
        }
        if (target.getStartTime() == null || target.getEndTime() == null
                || existing.getStartTime() == null || existing.getEndTime() == null) {
            return Objects.equals(target.getTimeSlotId(), existing.getTimeSlotId());
        }
        return target.getStartTime().isBefore(existing.getEndTime())
                && existing.getStartTime().isBefore(target.getEndTime());
    }

    private int scorePreferences(ScheduleAdjustmentSuggestionRequest request, Schedule originalSchedule, LocalDate date, TimeSlot slot, Room room) {
        int score = 0;
        if (request.getPreferredTimeSlotIds() != null && request.getPreferredTimeSlotIds().contains(slot.getTimeSlotId())) {
            score += 8;
        }
        if (request.getPreferredDayOfWeeks() != null && request.getPreferredDayOfWeeks().contains(toSystemDayOfWeek(date))) {
            score += 6;
        }
        if (request.getPreferredRoomId() != null && Objects.equals(request.getPreferredRoomId(), room.getRoomId())) {
            score += 10;
        }
        if (request.getPreferredBuildingId() != null && room.getBuilding() != null
                && Objects.equals(request.getPreferredBuildingId(), room.getBuilding().getBuildingId())) {
            score += 5;
        }
        if (originalSchedule != null && originalSchedule.getRoom() != null
                && Objects.equals(originalSchedule.getRoom().getRoomId(), room.getRoomId())) {
            score += 12;
        }
        return score;
    }

    private int daysFromAbsent(ScheduleAdjustmentSuggestionRequest request, LocalDate date) {
        if (request.getAbsentDate() == null) {
            return 0;
        }
        return (int) Math.abs(ChronoUnit.DAYS.between(request.getAbsentDate(), date));
    }

    private boolean isPreferredDay(LocalDate date, ScheduleAdjustmentSuggestionRequest request) {
        Integer dayOfWeek = toSystemDayOfWeek(date);
        if (dayOfWeek == 1) {
            return false;
        }
        return request.getPreferredDayOfWeeks() == null
                || request.getPreferredDayOfWeeks().isEmpty()
                || request.getPreferredDayOfWeeks().contains(dayOfWeek);
    }

    private boolean isDateInRange(LocalDate date, CourseClass courseClass, Semester semester) {
        LocalDate start = courseClass.getStartDate() != null ? courseClass.getStartDate() : semester.getStartDate();
        LocalDate end = courseClass.getEndDate() != null ? courseClass.getEndDate() : semester.getEndDate();
        return !date.isBefore(start) && !date.isAfter(end);
    }

    private boolean isRoomAvailable(Room room) {
        if (!Boolean.TRUE.equals(room.getIsActive())) {
            return false;
        }
        if (!StringUtils.hasText(room.getStatus())) {
            return true;
        }
        String status = room.getStatus().trim().toUpperCase(Locale.ROOT);
        return !List.of("UNAVAILABLE", "MAINTENANCE", "CLOSED", "DISABLED").contains(status);
    }

    private String requireValidType(String requestType) {
        String normalized = StringUtils.hasText(requestType) ? requestType.trim().toUpperCase(Locale.ROOT) : "";
        if (!VALID_TYPES.contains(normalized)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Loai yeu cau dieu chinh lich khong hop le");
        }
        return normalized;
    }

    private CourseClass requireCourseClass(UUID courseClassId) {
        return courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Lop hoc phan khong ton tai"));
    }

    private Semester requireSemester(UUID semesterId) {
        return semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Hoc ky khong ton tai"));
    }

    private UUID requireInstructor(ScheduleAdjustmentSuggestionRequest request, CourseClass courseClass) {
        if (request.getRequestedByInstructorId() == null) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Giang vien yeu cau khong duoc de trong");
        }
        if (!teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                request.getRequestedByInstructorId(), courseClass.getCourseClassId(), courseClass.getSemesterId())) {
            throw new BusinessException(ErrorCode.SCHEDULE_INSTRUCTOR_NOT_ASSIGNED,
                    "Giang vien chua duoc phan cong phu trach lop hoc phan nay");
        }
        return request.getRequestedByInstructorId();
    }

    private Schedule resolveOriginalSchedule(ScheduleAdjustmentSuggestionRequest request, String requestType) {
        if ("EXTRA_SESSION".equals(requestType)) {
            return null;
        }
        Schedule originalSchedule = null;
        if (request.getOriginalScheduleId() != null) {
            originalSchedule = scheduleRepository.findById(request.getOriginalScheduleId()).orElse(null);
        } else if (request.getAbsentDate() != null && request.getAbsentTimeSlotId() != null) {
            originalSchedule = scheduleRepository.findFixedSession(request.getCourseClassId(),
                    request.getAbsentDate(), request.getAbsentTimeSlotId()).orElse(null);
        }
        if (originalSchedule == null) {
            throw new ResourceNotFoundException(ErrorCode.SCHEDULE_ORIGINAL_NOT_FOUND, "Khong tim thay lich goc can dieu chinh");
        }
        return originalSchedule;
    }

    private int resolveProposedPeriods(ScheduleAdjustmentSuggestionRequest request, Schedule originalSchedule) {
        Integer periods = request.getProposedPeriods();
        if (periods == null) {
            periods = request.getAbsentPeriods();
        }
        if (periods == null && originalSchedule != null) {
            periods = originalSchedule.getNumberOfPeriods();
        }
        if (periods == null) {
            periods = DEFAULT_PERIODS_PER_SESSION;
        }
        if (periods < 1 || periods > 10) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "So tiet de xuat phai tu 1 den 10");
        }
        if ("ABSENT_MAKEUP".equals(requireValidType(request.getRequestType()))
                && request.getAbsentPeriods() != null
                && !Objects.equals(request.getAbsentPeriods(), periods)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "So tiet bu phai bang so tiet nghi");
        }
        return periods;
    }

    private DateRange resolveRange(ScheduleAdjustmentSuggestionRequest request, CourseClass courseClass, Semester semester) {
        LocalDate minStart = courseClass.getStartDate() != null ? courseClass.getStartDate() : semester.getStartDate();
        LocalDate maxEnd = courseClass.getEndDate() != null ? courseClass.getEndDate() : semester.getEndDate();
        LocalDate fromDate = request.getFromDate();
        if (fromDate == null) {
            fromDate = request.getAbsentDate() != null ? request.getAbsentDate().plusDays(1) : LocalDate.now();
        }
        if (fromDate.isBefore(LocalDate.now())) {
            fromDate = LocalDate.now();
        }
        if (fromDate.isBefore(minStart)) {
            fromDate = minStart;
        }
        LocalDate toDate = request.getToDate() != null ? request.getToDate() : maxEnd;
        if (toDate.isAfter(maxEnd)) {
            toDate = maxEnd;
        }
        if (toDate.isBefore(fromDate)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Khoang ngay goi y khong hop le");
        }
        return new DateRange(fromDate, toDate);
    }

    private UUID resolveCurrentInstructorId(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Khong tim thay tai khoan"));
        Employee employee = employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Tai khoan hien tai khong co ho so nhan vien"));
        return instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FORBIDDEN,
                        "Tai khoan hien tai khong phai giang vien"))
                .getEmployee()
                .getEmployeeId();
    }

    private int toSystemDayOfWeek(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        return day == DayOfWeek.SUNDAY ? 1 : day.getValue() + 1;
    }

    private String toDayLabel(LocalDate date) {
        return switch (toSystemDayOfWeek(date)) {
            case 1 -> "Chu nhat";
            case 2 -> "Thu 2";
            case 3 -> "Thu 3";
            case 4 -> "Thu 4";
            case 5 -> "Thu 5";
            case 6 -> "Thu 6";
            case 7 -> "Thu 7";
            default -> "";
        };
    }

    private String buildTimeSlotLabel(TimeSlot slot) {
        return slot.getSlotCode() + " (" + formatTime(slot.getStartTime()) + "-" + formatTime(slot.getEndTime()) + ")";
    }

    private String formatTime(LocalTime time) {
        return time != null ? time.toString() : "";
    }

    private void add(List<ScheduleAdjustmentSuggestionCheckResponse> checks, String rule, String status, String message) {
        checks.add(ScheduleAdjustmentSuggestionCheckResponse.builder()
                .rule(rule)
                .status(status)
                .message(message)
                .build());
    }

    private record DateRange(LocalDate fromDate, LocalDate toDate) {
    }

    private record CandidateResult(
            boolean valid,
            LocalDate date,
            TimeSlot slot,
            Room room,
            int proposedPeriods,
            int score,
            List<ScheduleAdjustmentSuggestionCheckResponse> checks,
            List<String> warnings) {
    }
}
