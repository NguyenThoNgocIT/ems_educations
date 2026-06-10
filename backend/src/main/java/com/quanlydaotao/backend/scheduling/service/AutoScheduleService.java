package com.quanlydaotao.backend.scheduling.service;

import ai.timefold.solver.core.api.solver.SolverManager;
import ai.timefold.solver.core.api.solver.SolverStatus;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.CourseClass;
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
import java.util.ArrayList;
import java.util.Arrays;
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

    private final SolverManager<SchedulePlan, UUID> solverManager;
    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
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
            int requiredPeriods = resolveTotalPeriods(courseClass);
            int scheduledPeriods = Math.toIntExact(scheduleRepository.sumActivePeriodsByCourseClass(courseClass.getCourseClassId()));
            int remainingPeriods = requiredPeriods - scheduledPeriods;
            if (remainingPeriods <= 0) {
                continue;
            }
            Employee instructor = resolveAssignedInstructor(courseClass, semesterId);
            if (instructor == null) {
                continue;
            }
            createFixedSessions(courseClass, semester, instructor, rooms, timeSlots, remainingPeriods);
            updateCourseClassDates(courseClass.getCourseClassId());
        }
    }

    private void createFixedSessions(
            CourseClass courseClass,
            Semester semester,
            Employee instructor,
            List<Room> rooms,
            List<TimeSlot> timeSlots,
            int remainingPeriods) {
        LocalDate date = resolveStartDate(courseClass, semester);
        LocalDate endDate = resolveEndDate(courseClass, semester);
        while (remainingPeriods > 0 && !date.isAfter(endDate)) {
            if (isTeachingDay(date) && !employeeLeaveRequestRepository.hasApprovedLeaveOnDate(instructor.getEmployeeId(), date)) {
                Integer periods = Math.min(3, remainingPeriods);
                Schedule session = findFirstAvailableSession(courseClass, instructor, rooms, timeSlots, date, periods);
                if (session != null) {
                    scheduleRepository.save(session);
                    remainingPeriods -= periods;
                    date = date.plusWeeks(1);
                    continue;
                }
            }
            date = date.plusDays(1);
        }
    }

    private Schedule findFirstAvailableSession(
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
                    schedule.setMode("OFFLINE");
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
        Integer dayOfWeek = toSystemDayOfWeek(date);
        if (courseClass.getMaxStudent() != null && room.getCapacity() != null && room.getCapacity() < courseClass.getMaxStudent()) {
            return false;
        }
        UUID probeId = UUID.randomUUID();
        if (scheduleRepository.existsByRoomRoomIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                room.getRoomId(), courseClass.getSemesterId(), dayOfWeek, timeSlot.getTimeSlotId(), probeId)) {
            return false;
        }
        if (scheduleRepository.existsByCourseClassCourseClassIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                courseClass.getCourseClassId(), courseClass.getSemesterId(), dayOfWeek, timeSlot.getTimeSlotId(), probeId)) {
            return false;
        }
        if (scheduleRepository.existsByInstructorEmployeeIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                instructor.getEmployeeId(), courseClass.getSemesterId(), dayOfWeek, timeSlot.getTimeSlotId(), probeId)) {
            return false;
        }
        if (scheduleRepository.hasRoomConflict(room.getRoomId(), date, timeSlot.getTimeSlotId())
                || overrideRepository.hasRoomConflict(room.getRoomId(), date, timeSlot.getTimeSlotId())) {
            return false;
        }
        if (scheduleRepository.hasInstructorConflict(instructor.getEmployeeId(), date, timeSlot.getTimeSlotId(), null)
                || overrideRepository.hasInstructorConflict(instructor.getEmployeeId(), date, timeSlot.getTimeSlotId())) {
            return false;
        }
        return !scheduleRepository.hasCourseClassConflict(courseClass.getCourseClassId(), date, timeSlot.getTimeSlotId());
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
            return (int) Math.ceil(configuredHours);
        }
        double credits = courseClass.getCourse().getCredits() == null ? 3 : courseClass.getCourse().getCredits();
        return (int) Math.ceil(credits * 15);
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
