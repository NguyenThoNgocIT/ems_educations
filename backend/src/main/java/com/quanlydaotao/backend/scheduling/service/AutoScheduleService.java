package com.quanlydaotao.backend.scheduling.service;

import ai.timefold.solver.core.api.solver.SolverManager;
import ai.timefold.solver.core.api.solver.SolverStatus;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.scheduling.domain.SchedulePlan;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Transactional
    public void generateScheduleForSemester(UUID semesterId) {
        // 1. Gather all required data
        var rooms = roomRepository.findAll();
        var timeSlots = timeSlotRepository.findAll();
        var daysOfWeek = Arrays.asList(2, 3, 4, 5, 6, 7); // Monday to Saturday

        // Delete existing un-locked schedules for this semester if needed
        // For now, let's just create schedules for CourseClasses that don't have one yet.
        var classesInSemester = courseClassRepository.findBySemesterId(semesterId); // Need to make sure this method exists
        
        List<Schedule> unassignedSchedules = new ArrayList<>();
        
        for (CourseClass courseClass : classesInSemester) {
            // Assume 1 lesson per week for simplicity for now.
            if (!scheduleRepository.existsByCourseClassCourseClassId(courseClass.getCourseClassId())) {
                Schedule schedule = new Schedule();
                schedule.setScheduleId(UUID.randomUUID());
                schedule.setCourseClass(courseClass);
                schedule.setSemesterId(semesterId);
                schedule.setStatus("AUTO_DRAFT");
                
                // Find instructor if assigned
                List<TeachingAssignment> assignments = teachingAssignmentRepository.search(null, courseClass.getCourseClassId(), null, semesterId, true);
                if (!assignments.isEmpty()) {
                    UUID instructorId = assignments.get(0).getInstructorId();
                    Employee instructor = employeeRepository.findById(instructorId).orElse(null);
                    schedule.setInstructor(instructor);
                }

                unassignedSchedules.add(schedule);
            }
        }

        if (unassignedSchedules.isEmpty()) return;

        SchedulePlan problem = new SchedulePlan(rooms, timeSlots, daysOfWeek, unassignedSchedules);

        // 2. Submit to SolverManager (runs asynchronously)
        solverManager.solveAndListen(semesterId,
                id -> problem,
                this::saveSolution);
    }

    public SolverStatus getSolverStatus(UUID semesterId) {
        return solverManager.getSolverStatus(semesterId);
    }

    @Transactional
    public void saveSolution(SchedulePlan solution) {
        // AI found a solution, save it to DB
        for (Schedule schedule : solution.getScheduleList()) {
            if (schedule.getRoom() != null && schedule.getTimeSlot() != null && schedule.getDayOfWeek() != null) {
                scheduleRepository.save(schedule);
            }
        }
    }
}
