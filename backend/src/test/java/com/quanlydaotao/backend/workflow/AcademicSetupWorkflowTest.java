package com.quanlydaotao.backend.workflow;

import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortRequest;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortResponse;
import com.quanlydaotao.backend.academiccohort.service.AcademicCohortService;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.service.AdministrativeClassService;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.dto.CourseDto;
import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.service.CourseClassService;
import com.quanlydaotao.backend.course.service.CoursePrerequisiteService;
import com.quanlydaotao.backend.course.service.CourseService;
import com.quanlydaotao.backend.department.dto.DepartmentDto;
import com.quanlydaotao.backend.department.service.DepartmentService;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.equivalentcourse.entity.EquivalentCourse;
import com.quanlydaotao.backend.equivalentcourse.repository.EquivalentCourseRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;
import com.quanlydaotao.backend.major.service.MajorService;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import com.quanlydaotao.backend.registrationperiod.repository.RegistrationPeriodRepository;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.service.SchoolYearService;
import com.quanlydaotao.backend.semester.dto.SemesterRequest;
import com.quanlydaotao.backend.semester.dto.SemesterResponse;
import com.quanlydaotao.backend.semester.service.SemesterService;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.studentclass.dto.StudentClassRequest;
import com.quanlydaotao.backend.studentclass.dto.StudentClassResponse;
import com.quanlydaotao.backend.studentclass.service.StudentClassService;
import com.quanlydaotao.backend.support.AbstractPostgresIntegrationTest;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentRequest;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentResponse;
import com.quanlydaotao.backend.teachingassignment.service.TeachingAssignmentService;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.service.TrainingProgramService;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import com.quanlydaotao.backend.trainingprogramcourse.repository.TrainingProgramCourseRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AcademicSetupWorkflowTest extends AbstractPostgresIntegrationTest {
    @Autowired DepartmentService departmentService;
    @Autowired MajorService majorService;
    @Autowired AcademicCohortService academicCohortService;
    @Autowired SchoolYearService schoolYearService;
    @Autowired SemesterService semesterService;
    @Autowired CourseService courseService;
    @Autowired CourseClassService courseClassService;
    @Autowired CoursePrerequisiteService coursePrerequisiteService;
    @Autowired AdministrativeClassService administrativeClassService;
    @Autowired StudentClassService studentClassService;
    @Autowired TrainingProgramService trainingProgramService;
    @Autowired TeachingAssignmentService teachingAssignmentService;
    @Autowired TrainingProgramCourseRepository trainingProgramCourseRepository;
    @Autowired EquivalentCourseRepository equivalentCourseRepository;
    @Autowired PersonRepository personRepository;
    @Autowired EmployeeRepository employeeRepository;
    @Autowired InstructorProfileRepository instructorProfileRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired CourseRegistrationRepository courseRegistrationRepository;

    @Test
    void adminConfiguresAcademicStructureAndTeachingAssignment_fullWorkflowIsValid() {
        String suffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDate today = LocalDate.now();

        DepartmentDto department = createDepartment(suffix);
        MajorResponse major = createMajor(suffix, department.getDepartmentId());
        AcademicCohortResponse cohort = createCohort(suffix, today);
        SchoolYearResponse schoolYear = createSchoolYear(suffix, today);
        SemesterResponse semester = createSemester(suffix, schoolYear.getSchoolYearId(), today);
        InstructorProfile advisor = createInstructor(suffix, department.getDepartmentId(), "A");
        InstructorProfile lecturer = createInstructor(suffix, department.getDepartmentId(), "B");

        AdministrativeClassResponse administrativeClass = createAdministrativeClass(
                suffix, department.getDepartmentId(), major.getMajorId(), cohort.getCohortId(), advisor.getInstructorId(), "FOUNDATION");

        TrainingProgramResponse program = createTrainingProgram(suffix, department.getDepartmentId(), major.getMajorId(), cohort.getCohortId());
        CourseDto foundationCourse = createCourse("F" + suffix, department.getDepartmentId(), "Cơ sở dữ liệu " + suffix);
        CourseDto specializationCourse = createCourse("S" + suffix, department.getDepartmentId(), "Phát triển phần mềm " + suffix);
        CourseDto equivalentCourse = createCourse("E" + suffix, department.getDepartmentId(), "Cơ sở dữ liệu tương đương " + suffix);

        addProgramCourse(program.getTrainingProgramId(), foundationCourse.getId(), semester.getSemesterId(), "FOUNDATION", null, 1);
        addProgramCourse(program.getTrainingProgramId(), specializationCourse.getId(), semester.getSemesterId(), "SPECIALIZATION", foundationCourse.getId(), 2);
        addEquivalentCourse(foundationCourse.getId(), equivalentCourse.getId());

        CreatePrerequisiteRequest prerequisiteRequest = new CreatePrerequisiteRequest();
        prerequisiteRequest.setCourseId(specializationCourse.getId());
        prerequisiteRequest.setPrerequisiteId(foundationCourse.getId());
        prerequisiteRequest.setType("PREREQUISITE");
        PrerequisiteDto prerequisite = coursePrerequisiteService.addPrerequisite(prerequisiteRequest);

        assertThat(prerequisite.getType()).isEqualTo("PREREQUISITE");
        assertThat(trainingProgramCourseRepository.search(program.getTrainingProgramId(), semester.getSemesterId(), null, null, true))
                .extracting(TrainingProgramCourse::getCoursePhase)
                .contains("FOUNDATION", "SPECIALIZATION");
        assertThat(equivalentCourseRepository.findAll()).anyMatch(item ->
                foundationCourse.getId().equals(item.getOriginalCourseId())
                        && equivalentCourse.getId().equals(item.getEquivalentCourseId()));

        CourseClassDto courseClass = createCourseClass(suffix, foundationCourse.getId(), semester);
        Student student = createStudent(suffix, program.getTrainingProgramId(), department.getDepartmentId(), major.getMajorId(), cohort.getCohortId());
        StudentClassResponse studentClass = assignStudentToAdministrativeClass(student.getStudentId(), administrativeClass.getClassId(), semester.getSemesterId());
        CourseRegistration registration = assignStudentToCourseClass(student.getStudentId(), courseClass.getId(), semester.getSemesterId());
        TeachingAssignmentResponse assignment = assignLecturer(lecturer.getInstructorId(), courseClass.getId(), administrativeClass.getClassId(), semester.getSemesterId());

        assertThat(studentClass.getIsActive()).isTrue();
        assertThat(registration.getCourseClassId()).isEqualTo(courseClass.getId());
        assertThat(assignment.getInstructorId()).isEqualTo(lecturer.getInstructorId());
        assertThat(teachingAssignmentService.search(lecturer.getInstructorId(), null, null, semester.getSemesterId(), true))
                .singleElement()
                .satisfies(item -> {
                    assertThat(item.getCourseClassId()).isEqualTo(courseClass.getId());
                    assertThat(item.getClassId()).isEqualTo(administrativeClass.getClassId());
                    assertThat(item.getIsActive()).isTrue();
                });

        assertDuplicateAndInvalidRulesAreBlocked(suffix, department, major, cohort, semester, advisor, administrativeClass, courseClass, specializationCourse);
    }

    private void assertDuplicateAndInvalidRulesAreBlocked(
            String suffix,
            DepartmentDto department,
            MajorResponse major,
            AcademicCohortResponse cohort,
            SemesterResponse semester,
            InstructorProfile advisor,
            AdministrativeClassResponse administrativeClass,
            CourseClassDto courseClass,
            CourseDto specializationCourse) {
        assertThatThrownBy(() -> createAdministrativeClass(
                suffix + "X", department.getDepartmentId(), major.getMajorId(), cohort.getCohortId(), advisor.getInstructorId(), "FOUNDATION"))
                .isInstanceOf(BusinessException.class);

        assertThatThrownBy(() -> createCourseClass(suffix, courseClass.getCourseId(), semester))
                .isInstanceOf(BusinessException.class);

        CreatePrerequisiteRequest selfPrerequisite = new CreatePrerequisiteRequest();
        selfPrerequisite.setCourseId(specializationCourse.getId());
        selfPrerequisite.setPrerequisiteId(specializationCourse.getId());
        assertThatThrownBy(() -> coursePrerequisiteService.addPrerequisite(selfPrerequisite))
                .isInstanceOf(BusinessException.class);

        assertThatThrownBy(() -> assignLecturer(UUID.randomUUID(), courseClass.getId(), administrativeClass.getClassId(), semester.getSemesterId()))
                .isInstanceOf(RuntimeException.class);
    }

    private DepartmentDto createDepartment(String suffix) {
        DepartmentDto request = DepartmentDto.builder()
                .code("D" + suffix)
                .name("Khoa workflow " + suffix)
                .isActive(true)
                .build();
        return departmentService.createDepartment(request);
    }

    private MajorResponse createMajor(String suffix, UUID departmentId) {
        MajorRequest request = new MajorRequest();
        request.setCode("M" + suffix);
        request.setName("Ngành workflow " + suffix);
        request.setDepartmentId(departmentId);
        request.setIsActive(true);
        return majorService.createMajor(request);
    }

    private AcademicCohortResponse createCohort(String suffix, LocalDate today) {
        AcademicCohortRequest request = new AcademicCohortRequest();
        request.setCode("K" + suffix.substring(0, 6));
        request.setName("Niên khóa workflow " + suffix);
        request.setStartYear(today.getYear());
        request.setEndYear(today.getYear() + 4);
        request.setIsActive(true);
        return academicCohortService.createCohort(request);
    }

    private SchoolYearResponse createSchoolYear(String suffix, LocalDate today) {
        SchoolYearRequest request = new SchoolYearRequest();
        request.setCode("SY" + suffix);
        request.setName("Năm học workflow " + suffix);
        request.setStartDate(today.minusMonths(1));
        request.setEndDate(today.plusMonths(10));
        request.setIsActive(true);
        return schoolYearService.createSchoolYear(request);
    }

    private SemesterResponse createSemester(String suffix, UUID schoolYearId, LocalDate today) {
        SemesterRequest request = new SemesterRequest();
        request.setCode("HK" + suffix);
        request.setName("Học kỳ workflow " + suffix);
        request.setSchoolYearId(schoolYearId);
        request.setStartDate(today);
        request.setEndDate(today.plusMonths(4));
        request.setStatus(true);
        request.setIsActive(true);
        return semesterService.createSemester(request);
    }

    private TrainingProgramResponse createTrainingProgram(String suffix, UUID departmentId, UUID majorId, UUID cohortId) {
        TrainingProgramRequest request = new TrainingProgramRequest();
        request.setCode("TP" + suffix);
        request.setName("Chương trình workflow " + suffix);
        request.setDepartmentId(departmentId);
        request.setMajorId(majorId);
        request.setAcademicCohortId(cohortId);
        request.setProgramPhase("FOUNDATION");
        request.setTotalCredits(120);
        request.setDurationYears(BigDecimal.valueOf(4));
        request.setMaxDurationYears(BigDecimal.valueOf(6));
        request.setStatus("ACTIVE");
        request.setIsActive(true);
        return trainingProgramService.createProgram(request);
    }

    private CourseDto createCourse(String code, UUID departmentId, String name) {
        CourseDto request = new CourseDto();
        request.setCode(code);
        request.setName(name);
        request.setDepartmentId(departmentId);
        request.setCredits(3D);
        request.setTheoryHours(45D);
        request.setPracticeHours(0D);
        request.setCourseType("THEORY");
        return courseService.createCourse(request);
    }

    private void addProgramCourse(UUID programId, UUID courseId, UUID semesterId, String phase, UUID prerequisiteCourseId, int sortOrder) {
        TrainingProgramCourse item = new TrainingProgramCourse();
        item.setTrainingProgramId(programId);
        item.setCourseId(courseId);
        item.setSemesterId(semesterId);
        item.setCoursePhase(phase);
        item.setPrerequisiteCourseId(prerequisiteCourseId);
        item.setIsPrerequisiteRequired(prerequisiteCourseId != null);
        item.setIsRequired(true);
        item.setCredits(BigDecimal.valueOf(3));
        item.setSortOrder(sortOrder);
        item.setStatus("ACTIVE");
        item.setIsActive(true);
        trainingProgramCourseRepository.save(item);
    }

    private void addEquivalentCourse(UUID originalCourseId, UUID equivalentCourseId) {
        EquivalentCourse equivalent = new EquivalentCourse();
        equivalent.setOriginalCourseId(originalCourseId);
        equivalent.setEquivalentCourseId(equivalentCourseId);
        equivalent.setIsActive(true);
        equivalentCourseRepository.save(equivalent);
    }

    private AdministrativeClassResponse createAdministrativeClass(
            String suffix,
            UUID departmentId,
            UUID majorId,
            UUID cohortId,
            UUID advisorId,
            String classPhase) {
        AdministrativeClassRequest request = new AdministrativeClassRequest();
        request.setClassCode("CLS" + suffix.substring(0, Math.min(6, suffix.length())));
        request.setClassName("Lớp hành chính workflow " + suffix);
        request.setDepartmentId(departmentId);
        request.setMajorId(majorId);
        request.setAcademicCohortId(cohortId);
        request.setAdvisorId(advisorId);
        request.setClassPhase(classPhase);
        request.setMaxSize(50);
        request.setIsActive(true);
        return administrativeClassService.createClass(request);
    }

    private CourseClassDto createCourseClass(String suffix, UUID courseId, SemesterResponse semester) {
        CourseClassDto request = new CourseClassDto();
        request.setClassCode("HP" + suffix);
        request.setCourseId(courseId);
        request.setSemesterId(semester.getSemesterId());
        request.setMaxStudent(60);
        request.setStatus("OPEN");
        request.setStartDate(semester.getStartDate().plusDays(1));
        request.setEndDate(semester.getEndDate().minusDays(1));
        return courseClassService.createCourseClass(request);
    }

    private StudentClassResponse assignStudentToAdministrativeClass(UUID studentId, UUID classId, UUID semesterId) {
        StudentClassRequest request = new StudentClassRequest();
        request.setStudentId(studentId);
        request.setClassId(classId);
        request.setSemesterId(semesterId);
        request.setStatus("ACTIVE");
        return studentClassService.createStudentClass(request);
    }

    private CourseRegistration assignStudentToCourseClass(UUID studentId, UUID courseClassId, UUID semesterId) {
        RegistrationPeriod period = new RegistrationPeriod();
        period.setCode("RP" + UUID.randomUUID().toString().substring(0, 8));
        period.setName("Đợt gán học phần mặc định");
        period.setSemesterId(semesterId);
        period.setStartDate(LocalDateTime.now().minusDays(1));
        period.setEndDate(LocalDateTime.now().plusDays(30));
        period.setStatus(1);
        period.setAllowRetake(false);
        period.setIsActive(true);
        period = registrationPeriodRepository.save(period);

        CourseRegistration registration = CourseRegistration.builder()
                .studentId(studentId)
                .courseClassId(courseClassId)
                .registrationPeriodId(period.getRegistrationPeriodId())
                .registeredAt(LocalDateTime.now())
                .status(1)
                .isPaid(false)
                .build();
        registration.setIsActive(true);
        return courseRegistrationRepository.save(registration);
    }

    private TeachingAssignmentResponse assignLecturer(UUID instructorId, UUID courseClassId, UUID classId, UUID semesterId) {
        TeachingAssignmentRequest request = new TeachingAssignmentRequest();
        request.setInstructorId(instructorId);
        request.setCourseClassId(courseClassId);
        request.setClassId(classId);
        request.setSemesterId(semesterId);
        request.setIsActive(true);
        request.setNote("Phân công workflow test");
        return teachingAssignmentService.assign(request);
    }

    private Student createStudent(String suffix, UUID programId, UUID departmentId, UUID majorId, UUID cohortId) {
        Person person = new Person();
        person.setFullName("Sinh viên workflow " + suffix);
        person.setContactEmail("student-" + suffix.toLowerCase() + "@uems.test");
        person.setIsActive(true);
        person = personRepository.save(person);

        Student student = new Student();
        student.setPerson(person);
        student.setStudentCode("SV" + suffix);
        student.setTrainingProgramId(programId);
        student.setDepartmentId(departmentId);
        student.setMajorId(majorId);
        student.setAcademicCohortId(cohortId);
        student.setAdmissionDate(LocalDate.now());
        student.setIsActive(true);
        return studentRepository.save(student);
    }

    private InstructorProfile createInstructor(String suffix, UUID departmentId, String marker) {
        Person person = new Person();
        person.setFullName("Giảng viên workflow " + marker + " " + suffix);
        person.setContactEmail("instructor-" + marker.toLowerCase() + suffix.toLowerCase() + "@uems.test");
        person.setIsActive(true);
        person = personRepository.save(person);

        Employee employee = new Employee();
        employee.setPerson(person);
        employee.setEmployeeCode("GV" + marker + suffix);
        employee.setEmployeeType("LECTURER");
        employee.setStatus("ACTIVE");
        employee.setStartWorkDate(LocalDate.now().minusYears(1));
        employee.setIsActive(true);
        employee = employeeRepository.save(employee);

        InstructorProfile instructor = new InstructorProfile();
        instructor.setEmployee(employee);
        instructor.setInstructorCode("GV" + marker + suffix);
        instructor.setDepartmentId(departmentId);
        instructor.setIsActive(true);
        return instructorProfileRepository.save(instructor);
    }
}
