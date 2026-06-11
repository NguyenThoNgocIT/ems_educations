package com.quanlydaotao.backend.scheduling.service;

import ai.timefold.solver.core.api.solver.SolverManager;
import ai.timefold.solver.core.api.solver.SolverStatus;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduling.domain.SchedulePlan;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employee.entity.Employee;

@Service
@RequiredArgsConstructor
public class AutoScheduleService {
    private static final int DEFAULT_PERIODS_PER_SESSION = 3;

    private final SolverManager<SchedulePlan, UUID> solverManager;
    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final EmployeeRepository employeeRepository;
    private final SemesterRepository semesterRepository;
    private final EmployeeLeaveRequestRepository employeeLeaveRequestRepository;
    private final TeachingSessionOverrideRepository overrideRepository;

    @Transactional
    public void generateScheduleForSemester(UUID semesterId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Hoc ky khong ton tai"));
        List<Room> rooms = roomRepository.findAll().stream()
                .filter(room -> Boolean.TRUE.equals(room.getIsActive()))
                .filter(this::isRoomUsable)
                .sorted(Comparator.comparing(Room::getCode, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
        List<TimeSlot> timeSlots = timeSlotRepository.findAll().stream()
                .filter(slot -> Boolean.TRUE.equals(slot.getIsActive()))
                .sorted(Comparator.comparing(TimeSlot::getStartTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
        List<CourseClass> classesInSemester = courseClassRepository.findBySemesterId(semesterId);

        for (CourseClass courseClass : classesInSemester) {
            generateScheduleForCourseClass(courseClass, semester, rooms, timeSlots, null, false);
        }
    }

    @Transactional
    public int generateScheduleForCourseClass(UUID courseClassId) {
        return generateScheduleForCourseClass(courseClassId, null);
    }

    @Transactional
    public int generateScheduleForCourseClass(UUID courseClassId, UUID instructorId) {
        CourseClass courseClass = courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Lop hoc phan khong ton tai"));
        Semester semester = semesterRepository.findById(courseClass.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Hoc ky khong ton tai"));
        List<Room> rooms = roomRepository.findAll().stream()
                .filter(room -> Boolean.TRUE.equals(room.getIsActive()))
                .filter(this::isRoomUsable)
                .sorted(Comparator.comparing(Room::getCode, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
        List<TimeSlot> timeSlots = timeSlotRepository.findAll().stream()
                .filter(slot -> Boolean.TRUE.equals(slot.getIsActive()))
                .sorted(Comparator.comparing(TimeSlot::getStartTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
        Employee selectedInstructor = instructorId == null ? null : employeeRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Giang vien khong ton tai"));
        return generateScheduleForCourseClass(courseClass, semester, rooms, timeSlots, selectedInstructor, true, true);
    }

    private int generateScheduleForCourseClass(
            CourseClass courseClass,
            Semester semester,
            List<Room> rooms,
            List<TimeSlot> timeSlots,
            Employee selectedInstructor,
            boolean strict) {
        return generateScheduleForCourseClass(courseClass, semester, rooms, timeSlots, selectedInstructor, strict, false);
    }

    private int generateScheduleForCourseClass(
            CourseClass courseClass,
            Semester semester,
            List<Room> rooms,
            List<TimeSlot> timeSlots,
            Employee selectedInstructor,
            boolean strict,
            boolean forceRegenerate) {
        if (forceRegenerate) {
            deactivateBaseSchedules(courseClass.getCourseClassId());
        } else {
            deactivateAutoGeneratedSchedules(courseClass.getCourseClassId());
        }
        int requiredPeriods = resolveTotalPeriods(courseClass);
        int scheduledPeriods = Math.toIntExact(scheduleRepository.sumActivePeriodsByCourseClass(courseClass.getCourseClassId()));
        int remainingPeriods = requiredPeriods - scheduledPeriods;
        if (remainingPeriods <= 0) {
            return 0;
        }
        Employee instructor = selectedInstructor != null ? selectedInstructor : resolveAssignedInstructor(courseClass, courseClass.getSemesterId());
        if (instructor == null) {
            if (strict) {
                throw new BusinessException("Lop hoc phan chua duoc phan cong giang vien");
            }
            return 0;
        }
        long studentCount = courseRegistrationRepository.countByCourseClassIdAndIsActiveTrue(courseClass.getCourseClassId());
        if (studentCount <= 0) {
            if (strict) {
                throw new BusinessException("Lop hoc phan chua co sinh vien");
            }
            return 0;
        }
        if (rooms.isEmpty() || timeSlots.isEmpty()) {
            if (strict) {
                throw new BusinessException("Chua co phong hoc hoac ca hoc kha dung de xep lich");
            }
            return 0;
        }
        int created = createFixedWeeklySessions(courseClass, semester, instructor, rooms, timeSlots, remainingPeriods, forceRegenerate);
        if (strict && created == 0) {
            throw new BusinessException("Khong tim thay lich phu hop de xep lich goc cho lop hoc phan");
        }
        updateCourseClassDates(courseClass.getCourseClassId());
        return created;
    }

    private int createFixedWeeklySessions(
            CourseClass courseClass,
            Semester semester,
            Employee instructor,
            List<Room> rooms,
            List<TimeSlot> timeSlots,
            int remainingPeriods,
            boolean forceRegenerate) {
        LocalDate startDate = forceRegenerate ? semester.getStartDate() : resolveStartDate(courseClass, semester);
        LocalDate endDate = forceRegenerate ? semester.getEndDate() : resolveEndDate(courseClass, semester);
        LocalDate weekStart = startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        int sessionsPerWeek = resolveSessionsPerWeek(courseClass);
        int created = 0;

        while (remainingPeriods > 0 && !weekStart.isAfter(endDate)) {
            int sessionsThisWeek = 0;
            LocalDate date = weekStart;
            LocalDate weekEnd = weekStart.plusDays(5);

            while (remainingPeriods > 0
                    && sessionsThisWeek < sessionsPerWeek
                    && !date.isAfter(weekEnd)
                    && !date.isAfter(endDate)) {
                if (!date.isBefore(startDate)
                        && isTeachingDay(date)
                        && !employeeLeaveRequestRepository.hasApprovedLeaveOnDate(instructor.getEmployeeId(), date)) {
                    Integer periods = resolveSessionPeriods(remainingPeriods);
                    Schedule session = findFirstAvailablePattern(courseClass, instructor, rooms, timeSlots, date, periods);
                    if (session != null) {
                        scheduleRepository.save(session);
                        remainingPeriods -= periods;
                        sessionsThisWeek++;
                        created++;
                    }
                }
                date = date.plusDays(1);
            }

            weekStart = weekStart.plusWeeks(1);
        }
        return created;
    }

    private Schedule findFirstAvailablePattern(
            CourseClass courseClass,
            Employee instructor,
            List<Room> rooms,
            List<TimeSlot> timeSlots,
            LocalDate date,
            Integer periods) {
        for (TimeSlot timeSlot : timeSlots) {
            for (Room room : prioritizeRooms(rooms, courseClass)) {
                if (isAvailable(courseClass, instructor, room, timeSlot, date)) {
                    Schedule schedule = new Schedule();
                    schedule.setCourseClass(courseClass);
                    schedule.setSemesterId(courseClass.getSemesterId());
                    schedule.setInstructor(instructor);
                    schedule.setRoom(room);
                    schedule.setDate(date);
                    schedule.setDayOfWeek(toSystemDayOfWeek(date));
                    schedule.setTimeSlot(timeSlot);
                    schedule.setNumberOfPeriods(periods);
                    schedule.setScheduleType("FIXED");
                    schedule.setScheduleStatus("PLANNED");
                    schedule.setStatus("AUTO_GENERATED");
                    schedule.setMode("LT");
                    schedule.setStartDate(date.atTime(timeSlot.getStartTime()));
                    schedule.setEndDate(date.atTime(timeSlot.getEndTime()));
                    schedule.setIsActive(true);
                    return schedule;
                }
            }
        }
        return null;
    }

    private boolean isAvailable(CourseClass courseClass, Employee instructor, Room room, TimeSlot timeSlot, LocalDate date) {
        if (courseClass.getMaxStudent() != null && room.getCapacity() != null && room.getCapacity() < courseClass.getMaxStudent()) {
            return false;
        }
        Integer dayOfWeek = toSystemDayOfWeek(date);
        if (scheduleRepository.hasRecurringRoomTimeOverlap(room.getRoomId(), courseClass.getSemesterId(), dayOfWeek,
                timeSlot.getStartTime(), timeSlot.getEndTime())) {
            return false;
        }
        if (scheduleRepository.hasRecurringInstructorTimeOverlap(instructor.getEmployeeId(), courseClass.getSemesterId(), dayOfWeek,
                timeSlot.getStartTime(), timeSlot.getEndTime())) {
            return false;
        }
        if (scheduleRepository.hasRecurringCourseClassTimeOverlap(courseClass.getCourseClassId(), courseClass.getSemesterId(), dayOfWeek,
                timeSlot.getStartTime(), timeSlot.getEndTime())) {
            return false;
        }
        if (scheduleRepository.hasRoomTimeOverlap(room.getRoomId(), date, timeSlot.getStartTime(), timeSlot.getEndTime())
                || overrideRepository.hasRoomTimeOverlap(room.getRoomId(), date, timeSlot.getStartTime(), timeSlot.getEndTime())) {
            return false;
        }
        if (scheduleRepository.hasInstructorTimeOverlap(instructor.getEmployeeId(), date, timeSlot.getStartTime(), timeSlot.getEndTime(), null)
                || overrideRepository.hasInstructorTimeOverlap(instructor.getEmployeeId(), date, timeSlot.getStartTime(), timeSlot.getEndTime())) {
            return false;
        }
        return !scheduleRepository.hasCourseClassTimeOverlap(courseClass.getCourseClassId(), date, timeSlot.getStartTime(), timeSlot.getEndTime())
                && !overrideRepository.hasCourseClassTimeOverlap(courseClass.getCourseClassId(), date, timeSlot.getStartTime(), timeSlot.getEndTime());
    }

    private List<Room> prioritizeRooms(List<Room> rooms, CourseClass courseClass) {
        if (courseClass.getRoomId() == null) {
            return rooms;
        }
        return rooms.stream()
                .sorted(Comparator.comparing((Room room) -> !Objects.equals(room.getRoomId(), courseClass.getRoomId()))
                        .thenComparing(Room::getCode, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
    }

    private Employee resolveAssignedInstructor(CourseClass courseClass, UUID semesterId) {
        List<TeachingAssignment> assignments = teachingAssignmentRepository.search(null, courseClass.getCourseClassId(), null, semesterId, true);
        if (assignments.isEmpty()) {
            return null;
        }
        UUID instructorId = assignments.get(0).getInstructorId();
        return employeeRepository.findById(instructorId).orElse(null);
    }

    private int resolveTotalPeriods(CourseClass courseClass) {
        if (courseClass.getCourse() == null) {
            return 45;
        }
        double theoryHours = courseClass.getCourse().getTheoryHours() == null ? 0 : courseClass.getCourse().getTheoryHours();
        double practiceHours = courseClass.getCourse().getPracticeHours() == null ? 0 : courseClass.getCourse().getPracticeHours();
        double configuredHours = theoryHours + practiceHours;
        if (configuredHours > 0) {
            return roundUpToSessionBlock((int) Math.ceil(configuredHours));
        }
        double credits = courseClass.getCourse().getCredits() == null ? 3 : courseClass.getCourse().getCredits();
        return roundUpToSessionBlock((int) Math.ceil(credits * 15));
    }

    private int resolveSessionPeriods(int ignoredRemainingPeriods) {
        return DEFAULT_PERIODS_PER_SESSION;
    }

    private int roundUpToSessionBlock(int periods) {
        if (periods <= 0) {
            return DEFAULT_PERIODS_PER_SESSION;
        }
        int remainder = periods % DEFAULT_PERIODS_PER_SESSION;
        return remainder == 0 ? periods : periods + DEFAULT_PERIODS_PER_SESSION - remainder;
    }

    private int resolveSessionsPerWeek(CourseClass courseClass) {
        if (courseClass.getCourse() == null) {
            return 2;
        }
        double credits = courseClass.getCourse().getCredits() == null ? 3 : courseClass.getCourse().getCredits();
        double theoryHours = courseClass.getCourse().getTheoryHours() == null ? 0 : courseClass.getCourse().getTheoryHours();
        double practiceHours = courseClass.getCourse().getPracticeHours() == null ? 0 : courseClass.getCourse().getPracticeHours();

        if (theoryHours > 0 && practiceHours > 0) {
            return credits >= 6 ? 3 : 2;
        }
        if (credits <= 2) {
            return 1;
        }
        if (credits <= 5) {
            return 2;
        }
        return 3;
    }

    private void deactivateAutoGeneratedSchedules(UUID courseClassId) {
        List<Schedule> generatedSchedules = scheduleRepository.findActiveAutoGeneratedByCourseClass(courseClassId);
        if (generatedSchedules.isEmpty()) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        for (Schedule schedule : generatedSchedules) {
            schedule.setIsActive(false);
            schedule.setDeletedAt(now);
            schedule.setStatus("REPLACED_BY_DATED_SCHEDULE");
            schedule.setNote("Da vo hieu hoa lich auto cu de xep lai lich goc");
        }
        scheduleRepository.saveAll(generatedSchedules);
        scheduleRepository.flush();
    }

    private void deactivateBaseSchedules(UUID courseClassId) {
        scheduleRepository.deactivateActiveSchedulesByCourseClass(courseClassId, LocalDateTime.now());
        scheduleRepository.flush();
    }

    private LocalDate resolveStartDate(CourseClass courseClass, Semester semester) {
        return courseClass.getStartDate() != null ? courseClass.getStartDate() : semester.getStartDate();
    }

    private LocalDate resolveEndDate(CourseClass courseClass, Semester semester) {
        return courseClass.getEndDate() != null ? courseClass.getEndDate() : semester.getEndDate();
    }

    private boolean isTeachingDay(LocalDate date) {
        return date.getDayOfWeek() != DayOfWeek.SUNDAY;
    }

    private boolean isRoomUsable(Room room) {
        if (!org.springframework.util.StringUtils.hasText(room.getStatus())) {
            return true;
        }
        String status = room.getStatus().trim().toUpperCase(Locale.ROOT);
        return !List.of("UNAVAILABLE", "MAINTENANCE", "CLOSED", "DISABLED").contains(status);
    }

    private int toSystemDayOfWeek(LocalDate date) {
        return date.getDayOfWeek().getValue();
    }

    public SolverStatus getSolverStatus(UUID semesterId) {
        return solverManager.getSolverStatus(semesterId);
    }

    @Transactional
    public void saveSolution(SchedulePlan solution) {
        // AI found a solution, save it to DB
        Set<UUID> classIds = new HashSet<>();
        for (Schedule schedule : solution.getScheduleList()) {
            if (schedule.getRoom() != null && schedule.getTimeSlot() != null && schedule.getDayOfWeek() != null) {
                scheduleRepository.save(schedule);
                if (schedule.getCourseClass() != null) {
                    classIds.add(schedule.getCourseClass().getCourseClassId());
                }
            }
        }
        for (UUID classId : classIds) {
            updateCourseClassDates(classId);
        }
    }

    private void updateCourseClassDates(UUID courseClassId) {
        if (courseClassId == null) {
            return;
        }
        CourseClass courseClass = courseClassRepository.findById(courseClassId).orElse(null);
        if (courseClass == null) {
            return;
        }
        List<Schedule> schedules = scheduleRepository.findByCourseClassCourseClassId(courseClassId);
        LocalDate minDate = null;
        LocalDate maxDate = null;
        for (Schedule s : schedules) {
            if (Boolean.TRUE.equals(s.getIsActive()) && s.getDate() != null
                    && (s.getScheduleStatus() == null || !s.getScheduleStatus().equals("CANCELLED"))) {
                LocalDate date = s.getDate();
                if (minDate == null || date.isBefore(minDate)) {
                    minDate = date;
                }
                if (maxDate == null || date.isAfter(maxDate)) {
                    maxDate = date;
                }
            }
        }
        courseClass.setStartDate(minDate);
        courseClass.setEndDate(maxDate);
        courseClassRepository.save(courseClass);
    }
}
