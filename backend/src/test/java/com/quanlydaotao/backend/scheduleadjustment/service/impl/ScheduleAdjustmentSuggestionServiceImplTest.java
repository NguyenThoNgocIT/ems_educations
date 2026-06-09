package com.quanlydaotao.backend.scheduleadjustment.service.impl;

import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.entity.Building;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionResponse;
import com.quanlydaotao.backend.scheduleadjustment.repository.ScheduleAdjustmentRequestRepository;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScheduleAdjustmentSuggestionServiceImplTest {
    @Mock CourseClassRepository courseClassRepository;
    @Mock SemesterRepository semesterRepository;
    @Mock TeachingAssignmentRepository teachingAssignmentRepository;
    @Mock EmployeeLeaveRequestRepository leaveRequestRepository;
    @Mock ScheduleRepository scheduleRepository;
    @Mock TeachingSessionOverrideRepository overrideRepository;
    @Mock ScheduleAdjustmentRequestRepository requestRepository;
    @Mock TimeSlotRepository timeSlotRepository;
    @Mock RoomRepository roomRepository;
    @Mock CourseRegistrationRepository registrationRepository;
    @Mock UserRepository userRepository;
    @Mock EmployeeRepository employeeRepository;
    @Mock InstructorProfileRepository instructorProfileRepository;

    @InjectMocks ScheduleAdjustmentSuggestionServiceImpl service;

    @Test
    void suggestMakeupSession_returnsOnlyAvailableRoomSlotWithBusinessChecks() {
        UUID courseClassId = UUID.randomUUID();
        UUID semesterId = UUID.randomUUID();
        UUID instructorId = UUID.randomUUID();
        UUID originalScheduleId = UUID.randomUUID();
        LocalDate absentDate = LocalDate.now().plusDays(10).with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
        LocalDate makeupDate = absentDate.plusDays(2);

        CourseClass courseClass = courseClass(courseClassId, semesterId, 45, absentDate.minusDays(5), absentDate.plusDays(60));
        Semester semester = semester(semesterId, absentDate.minusDays(7), absentDate.plusDays(60));
        TimeSlot absentSlot = timeSlot("S1", LocalTime.of(7, 0), LocalTime.of(9, 30));
        TimeSlot makeupSlot = timeSlot("S3", LocalTime.of(13, 0), LocalTime.of(15, 30));
        Room room = room("A201", 60, "ACTIVE");
        Schedule originalSchedule = schedule(originalScheduleId, courseClass, instructorId, room, absentSlot, absentDate);

        when(courseClassRepository.findById(courseClassId)).thenReturn(Optional.of(courseClass));
        when(semesterRepository.findById(semesterId)).thenReturn(Optional.of(semester));
        when(teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                instructorId, courseClassId, semesterId)).thenReturn(true);
        when(scheduleRepository.findById(originalScheduleId)).thenReturn(Optional.of(originalSchedule));
        when(timeSlotRepository.findAll()).thenReturn(List.of(absentSlot, makeupSlot));
        when(roomRepository.findAll()).thenReturn(List.of(room));
        when(leaveRequestRepository.hasApprovedLeaveOnDate(eq(instructorId), any(LocalDate.class))).thenReturn(false);
        when(scheduleRepository.findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(eq(instructorId), any(), any()))
                .thenReturn(List.of());
        when(scheduleRepository.findByRoomRoomId(room.getRoomId())).thenReturn(List.of());
        when(scheduleRepository.findByCourseClassCourseClassIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(eq(courseClassId), any(), any()))
                .thenReturn(List.of());
        when(overrideRepository.findVisibleByInstructorAndDate(eq(instructorId), any())).thenReturn(List.of());
        when(overrideRepository.findVisibleByRoomAndDate(eq(room.getRoomId()), any())).thenReturn(List.of());
        when(overrideRepository.findVisibleByCourseClassAndDate(eq(courseClassId), any())).thenReturn(List.of());
        when(requestRepository.hasRoomHold(eq(room.getRoomId()), any(), any(), any())).thenReturn(false);
        when(registrationRepository.findByCourseClassIdAndIsActiveTrue(courseClassId)).thenReturn(List.of());

        ScheduleAdjustmentSuggestionRequest request = new ScheduleAdjustmentSuggestionRequest();
        request.setCourseClassId(courseClassId);
        request.setRequestedByInstructorId(instructorId);
        request.setOriginalScheduleId(originalScheduleId);
        request.setRequestType("ABSENT_MAKEUP");
        request.setAbsentDate(absentDate);
        request.setAbsentTimeSlotId(absentSlot.getTimeSlotId());
        request.setAbsentPeriods(3);
        request.setProposedPeriods(3);
        request.setFromDate(makeupDate);
        request.setToDate(makeupDate);
        request.setPreferredTimeSlotIds(List.of(makeupSlot.getTimeSlotId()));
        request.setPreferSameRoom(true);

        ScheduleAdjustmentSuggestionResponse response = service.suggest(request);

        assertThat(response.getValidCandidates()).isEqualTo(1);
        assertThat(response.getSuggestions()).singleElement().satisfies(suggestion -> {
            assertThat(suggestion.getDate()).isEqualTo(makeupDate);
            assertThat(suggestion.getTimeSlotId()).isEqualTo(makeupSlot.getTimeSlotId());
            assertThat(suggestion.getRoomId()).isEqualTo(room.getRoomId());
            assertThat(suggestion.getScore()).isPositive();
            assertThat(suggestion.getChecks())
                    .filteredOn(check -> "R3_INSTRUCTOR_BUSY".equals(check.getRule()))
                    .singleElement()
                    .extracting("status")
                    .isEqualTo("OK");
            assertThat(suggestion.getChecks())
                    .filteredOn(check -> "R5_ROOM_BUSY".equals(check.getRule()))
                    .singleElement()
                    .extracting("status")
                    .isEqualTo("OK");
            assertThat(suggestion.getChecks())
                    .filteredOn(check -> "R9_STUDENT_BUSY".equals(check.getRule()))
                    .singleElement()
                    .extracting("status")
                    .isEqualTo("OK");
        });
    }

    @Test
    void suggestMakeupSession_excludesRoomHeldByPendingRequest() {
        UUID courseClassId = UUID.randomUUID();
        UUID semesterId = UUID.randomUUID();
        UUID instructorId = UUID.randomUUID();
        UUID originalScheduleId = UUID.randomUUID();
        LocalDate absentDate = LocalDate.now().plusDays(10).with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
        LocalDate makeupDate = absentDate.plusDays(2);

        CourseClass courseClass = courseClass(courseClassId, semesterId, 45, absentDate.minusDays(5), absentDate.plusDays(60));
        Semester semester = semester(semesterId, absentDate.minusDays(7), absentDate.plusDays(60));
        TimeSlot absentSlot = timeSlot("S1", LocalTime.of(7, 0), LocalTime.of(9, 30));
        TimeSlot makeupSlot = timeSlot("S3", LocalTime.of(13, 0), LocalTime.of(15, 30));
        Room room = room("A201", 60, "ACTIVE");
        Schedule originalSchedule = schedule(originalScheduleId, courseClass, instructorId, room, absentSlot, absentDate);

        when(courseClassRepository.findById(courseClassId)).thenReturn(Optional.of(courseClass));
        when(semesterRepository.findById(semesterId)).thenReturn(Optional.of(semester));
        when(teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                instructorId, courseClassId, semesterId)).thenReturn(true);
        when(scheduleRepository.findById(originalScheduleId)).thenReturn(Optional.of(originalSchedule));
        when(timeSlotRepository.findAll()).thenReturn(List.of(makeupSlot));
        when(roomRepository.findAll()).thenReturn(List.of(room));
        when(leaveRequestRepository.hasApprovedLeaveOnDate(eq(instructorId), any(LocalDate.class))).thenReturn(false);
        when(scheduleRepository.findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(eq(instructorId), any(), any()))
                .thenReturn(List.of());
        when(scheduleRepository.findByRoomRoomId(room.getRoomId())).thenReturn(List.of());
        when(scheduleRepository.findByCourseClassCourseClassIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(eq(courseClassId), any(), any()))
                .thenReturn(List.of());
        when(overrideRepository.findVisibleByInstructorAndDate(eq(instructorId), any())).thenReturn(List.of());
        when(overrideRepository.findVisibleByRoomAndDate(eq(room.getRoomId()), any())).thenReturn(List.of());
        when(overrideRepository.findVisibleByCourseClassAndDate(eq(courseClassId), any())).thenReturn(List.of());
        when(requestRepository.hasRoomHold(eq(room.getRoomId()), eq(makeupDate), eq(makeupSlot.getTimeSlotId()), any()))
                .thenReturn(true);
        when(registrationRepository.findByCourseClassIdAndIsActiveTrue(courseClassId)).thenReturn(List.of());

        ScheduleAdjustmentSuggestionRequest request = new ScheduleAdjustmentSuggestionRequest();
        request.setCourseClassId(courseClassId);
        request.setRequestedByInstructorId(instructorId);
        request.setOriginalScheduleId(originalScheduleId);
        request.setRequestType("ABSENT_MAKEUP");
        request.setAbsentDate(absentDate);
        request.setAbsentTimeSlotId(absentSlot.getTimeSlotId());
        request.setAbsentPeriods(3);
        request.setProposedPeriods(3);
        request.setFromDate(makeupDate);
        request.setToDate(makeupDate);

        ScheduleAdjustmentSuggestionResponse response = service.suggest(request);

        assertThat(response.getTotalCandidates()).isEqualTo(1);
        assertThat(response.getValidCandidates()).isZero();
        assertThat(response.getSuggestions()).isEmpty();
    }

    private CourseClass courseClass(UUID id, UUID semesterId, int maxStudent, LocalDate startDate, LocalDate endDate) {
        CourseClass courseClass = new CourseClass();
        courseClass.setCourseClassId(id);
        courseClass.setClassCode("IT301.001");
        courseClass.setSemesterId(semesterId);
        courseClass.setMaxStudent(maxStudent);
        courseClass.setStartDate(startDate);
        courseClass.setEndDate(endDate);
        courseClass.setIsActive(true);
        return courseClass;
    }

    private Semester semester(UUID id, LocalDate startDate, LocalDate endDate) {
        Semester semester = new Semester();
        semester.setSemesterId(id);
        semester.setCode("HK1");
        semester.setName("Hoc ky 1");
        semester.setStartDate(startDate);
        semester.setEndDate(endDate);
        semester.setIsActive(true);
        return semester;
    }

    private TimeSlot timeSlot(String code, LocalTime startTime, LocalTime endTime) {
        TimeSlot slot = new TimeSlot();
        slot.setTimeSlotId(UUID.randomUUID());
        slot.setSlotCode(code);
        slot.setStartTime(startTime);
        slot.setEndTime(endTime);
        slot.setIsActive(true);
        return slot;
    }

    private Room room(String code, int capacity, String status) {
        Building building = new Building();
        building.setBuildingId(UUID.randomUUID());
        building.setCode("A");
        building.setName("Toa A");

        Room room = new Room();
        room.setRoomId(UUID.randomUUID());
        room.setCode(code);
        room.setName("Phong " + code);
        room.setBuilding(building);
        room.setCapacity(capacity);
        room.setStatus(status);
        room.setFloorNumber(2);
        room.setIsActive(true);
        return room;
    }

    private Schedule schedule(UUID id, CourseClass courseClass, UUID instructorId, Room room, TimeSlot slot, LocalDate date) {
        Schedule schedule = new Schedule();
        schedule.setScheduleId(id);
        schedule.setCourseClass(courseClass);
        schedule.setSemesterId(courseClass.getSemesterId());
        schedule.setRoom(room);
        schedule.setTimeSlot(slot);
        schedule.setDate(date);
        schedule.setNumberOfPeriods(3);
        schedule.setScheduleType("FIXED");
        schedule.setScheduleStatus("PLANNED");
        schedule.setIsActive(true);
        return schedule;
    }
}
