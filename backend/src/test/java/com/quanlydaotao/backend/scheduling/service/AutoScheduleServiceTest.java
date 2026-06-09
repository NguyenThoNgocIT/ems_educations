package com.quanlydaotao.backend.scheduling.service;

import ai.timefold.solver.core.api.solver.SolverManager;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.entity.Building;
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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutoScheduleServiceTest {
    @Mock SolverManager<SchedulePlan, UUID> solverManager;
    @Mock ScheduleRepository scheduleRepository;
    @Mock CourseClassRepository courseClassRepository;
    @Mock RoomRepository roomRepository;
    @Mock TimeSlotRepository timeSlotRepository;
    @Mock TeachingAssignmentRepository teachingAssignmentRepository;
    @Mock EmployeeRepository employeeRepository;
    @Mock SemesterRepository semesterRepository;
    @Mock EmployeeLeaveRequestRepository employeeLeaveRequestRepository;
    @Mock TeachingSessionOverrideRepository overrideRepository;

    @InjectMocks AutoScheduleService service;

    @Test
    void generateScheduleForSemester_createsFixedSessionsByCourseCredits() {
        UUID semesterId = UUID.randomUUID();
        UUID courseClassId = UUID.randomUUID();
        UUID instructorId = UUID.randomUUID();
        LocalDate startDate = LocalDate.now().plusDays(7);

        Course course = new Course();
        course.setCourseId(UUID.randomUUID());
        course.setCode("CTDL");
        course.setName("Cau truc du lieu");
        course.setCredits(2D);

        CourseClass courseClass = new CourseClass();
        courseClass.setCourseClassId(courseClassId);
        courseClass.setClassCode("CTDL.001");
        courseClass.setCourseId(course.getCourseId());
        courseClass.setCourse(course);
        courseClass.setSemesterId(semesterId);
        courseClass.setMaxStudent(40);
        courseClass.setStartDate(startDate);
        courseClass.setEndDate(startDate.plusDays(90));
        courseClass.setIsActive(true);

        Semester semester = new Semester();
        semester.setSemesterId(semesterId);
        semester.setCode("HK1");
        semester.setName("Hoc ky 1");
        semester.setStartDate(startDate);
        semester.setEndDate(startDate.plusDays(90));
        semester.setIsActive(true);

        Building building = new Building();
        building.setBuildingId(UUID.randomUUID());
        building.setCode("A");
        building.setName("Toa A");

        Room room = new Room();
        room.setRoomId(UUID.randomUUID());
        room.setCode("A201");
        room.setBuilding(building);
        room.setCapacity(60);
        room.setStatus("ACTIVE");
        room.setIsActive(true);

        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setTimeSlotId(UUID.randomUUID());
        timeSlot.setSlotCode("S1");
        timeSlot.setStartTime(LocalTime.of(7, 0));
        timeSlot.setEndTime(LocalTime.of(9, 30));
        timeSlot.setIsActive(true);

        Employee instructor = new Employee();
        instructor.setEmployeeId(instructorId);
        instructor.setEmployeeCode("GV001");
        instructor.setIsActive(true);

        TeachingAssignment assignment = new TeachingAssignment();
        assignment.setInstructorId(instructorId);
        assignment.setCourseClassId(courseClassId);
        assignment.setSemesterId(semesterId);
        assignment.setIsActive(true);

        when(semesterRepository.findById(semesterId)).thenReturn(Optional.of(semester));
        when(roomRepository.findAll()).thenReturn(List.of(room));
        when(timeSlotRepository.findAll()).thenReturn(List.of(timeSlot));
        when(courseClassRepository.findBySemesterId(semesterId)).thenReturn(List.of(courseClass));
        when(scheduleRepository.existsByCourseClassCourseClassId(courseClassId)).thenReturn(false);
        when(teachingAssignmentRepository.search(null, courseClassId, null, semesterId, true)).thenReturn(List.of(assignment));
        when(employeeRepository.findById(instructorId)).thenReturn(Optional.of(instructor));
        when(employeeLeaveRequestRepository.hasApprovedLeaveOnDate(eq(instructorId), any())).thenReturn(false);
        when(scheduleRepository.hasRoomConflict(eq(room.getRoomId()), any(), eq(timeSlot.getTimeSlotId()))).thenReturn(false);
        when(overrideRepository.hasRoomConflict(eq(room.getRoomId()), any(), eq(timeSlot.getTimeSlotId()))).thenReturn(false);
        when(scheduleRepository.hasInstructorConflict(eq(instructorId), any(), eq(timeSlot.getTimeSlotId()), eq(null))).thenReturn(false);
        when(overrideRepository.hasInstructorConflict(eq(instructorId), any(), eq(timeSlot.getTimeSlotId()))).thenReturn(false);
        when(scheduleRepository.hasCourseClassConflict(eq(courseClassId), any(), eq(timeSlot.getTimeSlotId()))).thenReturn(false);

        service.generateScheduleForSemester(semesterId);

        ArgumentCaptor<Schedule> captor = ArgumentCaptor.forClass(Schedule.class);
        verify(scheduleRepository, org.mockito.Mockito.times(10)).save(captor.capture());

        assertThat(captor.getAllValues()).allSatisfy(schedule -> {
            assertThat(schedule.getCourseClass()).isEqualTo(courseClass);
            assertThat(schedule.getInstructor()).isEqualTo(instructor);
            assertThat(schedule.getRoom()).isEqualTo(room);
            assertThat(schedule.getTimeSlot()).isEqualTo(timeSlot);
            assertThat(schedule.getNumberOfPeriods()).isEqualTo(3);
            assertThat(schedule.getScheduleType()).isEqualTo("FIXED");
            assertThat(schedule.getScheduleStatus()).isEqualTo("PLANNED");
            assertThat(schedule.getStatus()).isEqualTo("AUTO_GENERATED");
            assertThat(schedule.getDate()).isNotNull();
            assertThat(schedule.getStartDate()).isNotNull();
            assertThat(schedule.getEndDate()).isNotNull();
        });
    }
}
