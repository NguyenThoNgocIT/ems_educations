package com.quanlydaotao.backend.workflow;

import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.facility.entity.Building;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.repository.BuildingRepository;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentReviewRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSubmitRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidateRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidationResponse;
import com.quanlydaotao.backend.scheduleadjustment.entity.ScheduleAdjustmentRequest;
import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import com.quanlydaotao.backend.scheduleadjustment.repository.ScheduleAdjustmentRequestRepository;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduleadjustment.service.ScheduleAdjustmentService;
import com.quanlydaotao.backend.scheduling.dto.ScheduleWeekItemResponse;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.scheduling.service.ScheduleQueryService;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.support.AbstractPostgresIntegrationTest;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ScheduleAdjustmentWorkflowTest extends AbstractPostgresIntegrationTest {
    @Autowired ScheduleAdjustmentService adjustmentService;
    @Autowired ScheduleQueryService scheduleQueryService;
    @Autowired ScheduleAdjustmentRequestRepository requestRepository;
    @Autowired TeachingSessionOverrideRepository overrideRepository;
    @Autowired DepartmentRepository departmentRepository;
    @Autowired CourseRepository courseRepository;
    @Autowired CourseClassRepository courseClassRepository;
    @Autowired SchoolYearRepository schoolYearRepository;
    @Autowired SemesterRepository semesterRepository;
    @Autowired PersonRepository personRepository;
    @Autowired EmployeeRepository employeeRepository;
    @Autowired BuildingRepository buildingRepository;
    @Autowired RoomRepository roomRepository;
    @Autowired TimeSlotRepository timeSlotRepository;
    @Autowired ScheduleRepository scheduleRepository;
    @Autowired TeachingAssignmentRepository teachingAssignmentRepository;
    @Autowired InstructorProfileRepository instructorProfileRepository;
    @Autowired AdministrativeClassRepository administrativeClassRepository;

    @Test
    void instructorRequestsMakeupSession_adminApproves_overridesAndMergedWeekScheduleAreCorrect() {
        TestData data = seedScheduleData();
        ScheduleAdjustmentSubmitRequest submitRequest = buildSubmitRequest(data);

        ScheduleAdjustmentValidationResponse validation = adjustmentService.validate(toValidateRequest(submitRequest));
        assertThat(validation.getValid()).isTrue();
        assertThat(validation.getProposedSlots()).isNotEmpty();
        assertThat(validation.getProposedRooms()).extracting("roomId").contains(data.room().getRoomId());

        ScheduleAdjustmentResponse submitted = adjustmentService.submit(submitRequest);
        assertThat(submitted.getStatus()).isEqualTo("PENDING");

        ScheduleAdjustmentReviewRequest reviewRequest = new ScheduleAdjustmentReviewRequest();
        reviewRequest.setReviewedBy(UUID.randomUUID());
        reviewRequest.setNote("Đồng ý lịch bù, phòng và giảng viên đều hợp lệ");
        ScheduleAdjustmentResponse approved = adjustmentService.approve(submitted.getRequestId(), reviewRequest);

        assertThat(approved.getStatus()).isEqualTo("APPROVED");
        ScheduleAdjustmentRequest savedRequest = requestRepository.findById(submitted.getRequestId()).orElseThrow();
        assertThat(savedRequest.getReviewedAt()).isNotNull();

        List<TeachingSessionOverride> overrides = overrideRepository.findAll().stream()
                .filter(override -> submitted.getRequestId().equals(override.getRequestId()))
                .toList();
        assertThat(overrides).hasSize(2);
        assertThat(overrides).anySatisfy(override -> {
            assertThat(override.getOverrideType()).isEqualTo("CANCELLED");
            assertThat(override.getOriginalScheduleId()).isEqualTo(data.originalSchedule().getScheduleId());
            assertThat(override.getIsVisible()).isFalse();
        });
        assertThat(overrides).anySatisfy(override -> {
            assertThat(override.getOverrideType()).isEqualTo("MAKEUP");
            assertThat(override.getTeachingDate()).isEqualTo(data.makeupDate());
            assertThat(override.getIsVisible()).isTrue();
        });

        List<ScheduleWeekItemResponse> week = scheduleQueryService.getInstructorWeek(
                data.instructor().getEmployeeId(), data.absentDate(), data.semester().getSemesterId());
        assertThat(week).anySatisfy(item -> {
            assertThat(item.getDate()).isEqualTo(data.absentDate());
            assertThat(item.getCourseClassId()).isEqualTo(data.courseClass().getCourseClassId());
            assertThat(item.getStatus()).isEqualTo("ABSENT");
        });
        assertThat(week).anySatisfy(item -> {
            assertThat(item.getDate()).isEqualTo(data.makeupDate());
            assertThat(item.getCourseClassId()).isEqualTo(data.courseClass().getCourseClassId());
            assertThat(item.getStatus()).isEqualTo("MAKEUP");
        });
    }

    private TestData seedScheduleData() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        LocalDate absentDate = LocalDate.now().plusDays(7).with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
        LocalDate makeupDate = absentDate.plusDays(3);

        Department department = new Department();
        department.setCode("IT-" + suffix);
        department.setName("Khoa CNTT " + suffix);
        department.setIsActive(true);
        department = departmentRepository.save(department);

        Course course = new Course();
        course.setDepartmentId(department.getDepartmentId());
        course.setCode("CSDL-" + suffix);
        course.setName("Cơ sở dữ liệu " + suffix);
        course.setCredits(2D);
        course.setCourseType("THEORY");
        course.setIsActive(true);
        course = courseRepository.save(course);

        SchoolYear schoolYear = new SchoolYear();
        schoolYear.setCode("SY-" + suffix);
        schoolYear.setName("Năm học " + suffix);
        schoolYear.setSchoolYearName("Năm học " + suffix);
        schoolYear.setStartDate(absentDate.minusMonths(1));
        schoolYear.setEndDate(absentDate.plusMonths(6));
        schoolYear.setIsActive(true);
        schoolYear = schoolYearRepository.save(schoolYear);

        Semester semester = new Semester();
        semester.setCode("HK-" + suffix);
        semester.setName("Học kỳ test " + suffix);
        semester.setSchoolYearId(schoolYear.getSchoolYearId());
        semester.setStartDate(absentDate.minusDays(10));
        semester.setEndDate(absentDate.plusDays(60));
        semester.setStatus(true);
        semester.setIsActive(true);
        semester = semesterRepository.save(semester);

        CourseClass courseClass = new CourseClass();
        courseClass.setClassCode("IT301." + suffix);
        courseClass.setCourseId(course.getCourseId());
        courseClass.setSemesterId(semester.getSemesterId());
        courseClass.setMaxStudent(40);
        courseClass.setCurrentStudent(30);
        courseClass.setStartDate(semester.getStartDate());
        courseClass.setEndDate(semester.getEndDate());
        courseClass.setStatus("OPEN");
        courseClass.setIsActive(true);
        courseClass = courseClassRepository.save(courseClass);

        Person person = new Person();
        person.setFullName("Giảng viên Test " + suffix);
        person.setContactEmail("gv-" + suffix + "@uems.test");
        person.setIsActive(true);
        person = personRepository.save(person);

        Employee instructor = new Employee();
        instructor.setPerson(person);
        instructor.setEmployeeCode("GV-" + suffix);
        instructor.setEmployeeType("LECTURER");
        instructor.setStatus("ACTIVE");
        instructor.setStartWorkDate(absentDate.minusYears(1));
        instructor.setIsActive(true);
        instructor = employeeRepository.save(instructor);

        InstructorProfile instructorProfile = new InstructorProfile();
        instructorProfile.setEmployee(instructor);
        instructorProfile.setInstructorCode("GV-" + suffix);
        instructorProfile.setDepartmentId(department.getDepartmentId());
        instructorProfile.setIsActive(true);
        instructorProfileRepository.save(instructorProfile);

        AdministrativeClass administrativeClass = new AdministrativeClass();
        administrativeClass.setClassCode("HC-" + suffix);
        administrativeClass.setClassName("Lớp hành chính " + suffix);
        administrativeClass.setDepartmentId(department.getDepartmentId());
        administrativeClass.setMaxSize(60);
        administrativeClass.setStatus(1);
        administrativeClass.setIsActive(true);
        administrativeClass = administrativeClassRepository.save(administrativeClass);

        Building building = new Building();
        building.setCode("A-" + suffix);
        building.setName("Tòa A " + suffix);
        building.setIsActive(true);
        building = buildingRepository.save(building);

        Room room = new Room();
        room.setCode("A201-" + suffix);
        room.setName("Phòng A201 " + suffix);
        room.setBuilding(building);
        room.setCapacity(60);
        room.setStatus("ACTIVE");
        room.setIsActive(true);
        room = roomRepository.save(room);

        TimeSlot fixedSlot = new TimeSlot();
        fixedSlot.setSlotCode("S1-" + suffix);
        fixedSlot.setStartTime(LocalTime.of(7, 0));
        fixedSlot.setEndTime(LocalTime.of(9, 30));
        fixedSlot.setIsActive(true);
        fixedSlot = timeSlotRepository.save(fixedSlot);

        TimeSlot makeupSlot = new TimeSlot();
        makeupSlot.setSlotCode("S3-" + suffix);
        makeupSlot.setStartTime(LocalTime.of(13, 0));
        makeupSlot.setEndTime(LocalTime.of(15, 30));
        makeupSlot.setIsActive(true);
        makeupSlot = timeSlotRepository.save(makeupSlot);

        TeachingAssignment assignment = new TeachingAssignment();
        assignment.setInstructorId(instructor.getEmployeeId());
        assignment.setCourseClassId(courseClass.getCourseClassId());
        assignment.setClassId(administrativeClass.getClassId());
        assignment.setSemesterId(semester.getSemesterId());
        assignment.setIsActive(true);
        teachingAssignmentRepository.save(assignment);

        Schedule schedule = new Schedule();
        schedule.setCourseClass(courseClass);
        schedule.setInstructor(instructor);
        schedule.setSemesterId(semester.getSemesterId());
        schedule.setRoom(room);
        schedule.setDayOfWeek(absentDate.getDayOfWeek().getValue());
        schedule.setDate(absentDate);
        schedule.setTimeSlot(fixedSlot);
        schedule.setNumberOfPeriods(3);
        schedule.setStartDate(LocalDateTime.of(absentDate, fixedSlot.getStartTime()));
        schedule.setEndDate(LocalDateTime.of(absentDate, fixedSlot.getEndTime()));
        schedule.setScheduleType("FIXED");
        schedule.setScheduleStatus("PLANNED");
        schedule.setIsActive(true);
        schedule = scheduleRepository.save(schedule);

        return new TestData(courseClass, semester, instructor, room, schedule, fixedSlot, makeupSlot, absentDate, makeupDate);
    }

    private ScheduleAdjustmentSubmitRequest buildSubmitRequest(TestData data) {
        ScheduleAdjustmentSubmitRequest request = new ScheduleAdjustmentSubmitRequest();
        request.setRequestedByInstructorId(data.instructor().getEmployeeId());
        request.setCourseClassId(data.courseClass().getCourseClassId());
        request.setOriginalScheduleId(data.originalSchedule().getScheduleId());
        request.setRequestType("ABSENT_MAKEUP");
        request.setAbsentDate(data.absentDate());
        request.setAbsentTimeSlotId(data.fixedSlot().getTimeSlotId());
        request.setAbsentPeriods(3);
        request.setProposedDate(data.makeupDate());
        request.setProposedTimeSlotId(data.makeupSlot().getTimeSlotId());
        request.setProposedRoomId(data.room().getRoomId());
        request.setProposedPeriods(3);
        request.setReason("Giảng viên đi công tác, đề xuất dạy bù trong tuần");
        return request;
    }

    private ScheduleAdjustmentValidateRequest toValidateRequest(ScheduleAdjustmentSubmitRequest request) {
        ScheduleAdjustmentValidateRequest validateRequest = new ScheduleAdjustmentValidateRequest();
        validateRequest.setRequestedByInstructorId(request.getRequestedByInstructorId());
        validateRequest.setCourseClassId(request.getCourseClassId());
        validateRequest.setOriginalScheduleId(request.getOriginalScheduleId());
        validateRequest.setRequestType(request.getRequestType());
        validateRequest.setAbsentDate(request.getAbsentDate());
        validateRequest.setAbsentTimeSlotId(request.getAbsentTimeSlotId());
        validateRequest.setAbsentPeriods(request.getAbsentPeriods());
        validateRequest.setProposedDate(request.getProposedDate());
        validateRequest.setProposedTimeSlotId(request.getProposedTimeSlotId());
        validateRequest.setProposedRoomId(request.getProposedRoomId());
        validateRequest.setProposedPeriods(request.getProposedPeriods());
        return validateRequest;
    }

    private record TestData(
            CourseClass courseClass,
            Semester semester,
            Employee instructor,
            Room room,
            Schedule originalSchedule,
            TimeSlot fixedSlot,
            TimeSlot makeupSlot,
            LocalDate absentDate,
            LocalDate makeupDate) {
    }
}
