package com.quanlydaotao.backend.workflow;

import com.quanlydaotao.backend.academiccohort.entity.AcademicCohort;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.course.dto.CourseRegistrationResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementOptionResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementRegistrationRequest;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.RegistrationService;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.grade.entity.StudentSummary;
import com.quanlydaotao.backend.grade.repository.StudentSummaryRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import com.quanlydaotao.backend.registrationperiod.repository.RegistrationPeriodRepository;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.support.AbstractPostgresIntegrationTest;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import com.quanlydaotao.backend.trainingprogramcourse.repository.TrainingProgramCourseRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class RetakeImprovementRegistrationWorkflowTest extends AbstractPostgresIntegrationTest {
    @Autowired RegistrationService registrationService;
    @Autowired DepartmentRepository departmentRepository;
    @Autowired TrainingProgramRepository trainingProgramRepository;
    @Autowired TrainingProgramCourseRepository trainingProgramCourseRepository;
    @Autowired CourseRepository courseRepository;
    @Autowired CourseClassRepository courseClassRepository;
    @Autowired CourseRegistrationRepository registrationRepository;
    @Autowired RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired StudentSummaryRepository summaryRepository;
    @Autowired PersonRepository personRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired UserRepository userRepository;
    @Autowired SchoolYearRepository schoolYearRepository;
    @Autowired SemesterRepository semesterRepository;
    @Autowired MajorRepository majorRepository;
    @Autowired AcademicCohortRepository academicCohortRepository;

    @Test
    void studentRegistersRetakeAndImprovement_fromFinalizedSummaries_successfully() {
        TestData data = seedRegistrationData();

        List<RetakeImprovementOptionResponse> options = registrationService
                .getCurrentStudentRetakeImprovementOptions(data.username(), data.currentSemester().getSemesterId());

        assertThat(options).hasSize(2);
        assertThat(options)
                .filteredOn(option -> option.getCourseId().equals(data.failedCourse().getCourseId()))
                .singleElement()
                .satisfies(option -> {
                    assertThat(option.getRegistrationType()).isEqualTo(1);
                    assertThat(option.getRegistrationTypeName()).isEqualTo("Học lại");
                    assertThat(option.getCanRegister()).isTrue();
                });
        assertThat(options)
                .filteredOn(option -> option.getCourseId().equals(data.passedCourse().getCourseId()))
                .singleElement()
                .satisfies(option -> {
                    assertThat(option.getRegistrationType()).isEqualTo(2);
                    assertThat(option.getRegistrationTypeName()).isEqualTo("Học cải thiện");
                    assertThat(option.getCanRegister()).isTrue();
                });

        RetakeImprovementRegistrationRequest retakeRequest = new RetakeImprovementRegistrationRequest();
        retakeRequest.setCourseClassId(data.failedRetakeClass().getCourseClassId());
        CourseRegistrationResponse retake = registrationService.registerCurrentStudentRetakeImprovement(data.username(), retakeRequest);

        assertThat(retake.getRegistrationType()).isEqualTo(1);
        assertThat(retake.getReplacedGradeId()).isEqualTo(data.failedPreviousRegistration().getCourseRegistrationId());
        assertThat(courseClassRepository.findById(data.failedRetakeClass().getCourseClassId()).orElseThrow().getCurrentStudent()).isEqualTo(1);

        RetakeImprovementRegistrationRequest improveRequest = new RetakeImprovementRegistrationRequest();
        improveRequest.setCourseClassId(data.passedImprovementClass().getCourseClassId());
        CourseRegistrationResponse improve = registrationService.registerCurrentStudentRetakeImprovement(data.username(), improveRequest);

        assertThat(improve.getRegistrationType()).isEqualTo(2);
        assertThat(improve.getReplacedGradeId()).isEqualTo(data.passedPreviousRegistration().getCourseRegistrationId());
        assertThat(registrationRepository.findByStudentIdAndIsActiveTrue(data.student().getStudentId())).hasSize(4);
    }

    private TestData seedRegistrationData() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        LocalDate today = LocalDate.now();

        Department department = new Department();
        department.setCode("REG-" + suffix);
        department.setName("Khoa đăng ký " + suffix);
        department.setIsActive(true);
        department = departmentRepository.save(department);

        Major major = new Major();
        major.setDepartmentId(department.getDepartmentId());
        major.setCode("MREG" + suffix.substring(0, 6));
        major.setName("Ngành kiểm thử đăng ký " + suffix);
        major.setIsActive(true);
        major = majorRepository.save(major);

        AcademicCohort cohort = new AcademicCohort();
        cohort.setCode("K" + suffix.substring(0, 6));
        cohort.setName("Khóa kiểm thử " + suffix);
        cohort.setStartYear(today.getYear() - 1);
        cohort.setEndYear(today.getYear() + 3);
        cohort.setIsActive(true);
        cohort = academicCohortRepository.save(cohort);

        TrainingProgram program = new TrainingProgram();
        program.setCode("TP-REG-" + suffix);
        program.setName("Chương trình kiểm thử đăng ký " + suffix);
        program.setMajorId(major.getMajorId());
        program.setAcademicCohortId(cohort.getCohortId());
        program.setDepartmentId(department.getDepartmentId());
        program.setStatus("ACTIVE");
        program.setIsActive(true);
        program = trainingProgramRepository.save(program);

        Course failedCourse = createCourse(department.getDepartmentId(), "FAIL-" + suffix, "Môn học lại " + suffix);
        Course passedCourse = createCourse(department.getDepartmentId(), "PASS-" + suffix, "Môn cải thiện " + suffix);
        addProgramCourse(program.getTrainingProgramId(), failedCourse.getCourseId());
        addProgramCourse(program.getTrainingProgramId(), passedCourse.getCourseId());

        SchoolYear schoolYear = new SchoolYear();
        schoolYear.setCode("SY-REG-" + suffix);
        schoolYear.setName("Năm học kiểm thử " + suffix);
        schoolYear.setSchoolYearName("Năm học kiểm thử " + suffix);
        schoolYear.setStartDate(today.minusMonths(6));
        schoolYear.setEndDate(today.plusMonths(6));
        schoolYear.setIsActive(true);
        schoolYear = schoolYearRepository.save(schoolYear);

        Semester oldSemester = createSemester(schoolYear.getSchoolYearId(), "OLD-" + suffix, today.minusMonths(5), today.minusMonths(2));
        Semester currentSemester = createSemester(schoolYear.getSchoolYearId(), "CUR-" + suffix, today.minusDays(10), today.plusMonths(3));

        RegistrationPeriod oldPeriod = createPeriod(oldSemester.getSemesterId(), "OLDP-" + suffix, today.minusMonths(5).atStartOfDay(), today.minusMonths(2).atStartOfDay());
        createPeriod(currentSemester.getSemesterId(), "CURP-" + suffix, LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(20));

        CourseClass failedOldClass = createClass(failedCourse.getCourseId(), oldSemester.getSemesterId(), "FAIL.OLD." + suffix, 1);
        CourseClass passedOldClass = createClass(passedCourse.getCourseId(), oldSemester.getSemesterId(), "PASS.OLD." + suffix, 1);
        CourseClass failedRetakeClass = createClass(failedCourse.getCourseId(), currentSemester.getSemesterId(), "FAIL.RE." + suffix, 0);
        CourseClass passedImprovementClass = createClass(passedCourse.getCourseId(), currentSemester.getSemesterId(), "PASS.IM." + suffix, 0);

        Person person = new Person();
        person.setFullName("Sinh viên đăng ký " + suffix);
        person.setContactEmail("sv-" + suffix + "@uems.test");
        person.setIsActive(true);
        person = personRepository.save(person);

        Student student = new Student();
        student.setPerson(person);
        student.setStudentCode("SVREG" + suffix);
        student.setDepartmentId(department.getDepartmentId());
        student.setMajorId(major.getMajorId());
        student.setAcademicCohortId(cohort.getCohortId());
        student.setTrainingProgramId(program.getTrainingProgramId());
        student.setAdmissionDate(today.minusYears(1));
        student.setIsActive(true);
        student = studentRepository.save(student);

        User user = new User();
        user.setPerson(person);
        user.setUsername("svreg" + suffix);
        user.setEmail("svreg" + suffix + "@donga.edu.vn");
        user.setPasswordHash("$2a$10$uems.test.hash");
        user.setRequirePasswordChange(false);
        user.setEmailConfirmed(true);
        user.setIsActive(true);
        userRepository.save(user);

        CourseRegistration failedPrevious = createRegistration(student.getStudentId(), failedOldClass.getCourseClassId(), oldPeriod.getRegistrationPeriodId());
        CourseRegistration passedPrevious = createRegistration(student.getStudentId(), passedOldClass.getCourseClassId(), oldPeriod.getRegistrationPeriodId());
        createSummary(failedPrevious, BigDecimal.valueOf(3.5D), "F", "FAILED");
        createSummary(passedPrevious, BigDecimal.valueOf(7.5D), "B", "PASSED");

        return new TestData(
                user.getUsername(),
                student,
                currentSemester,
                failedCourse,
                passedCourse,
                failedRetakeClass,
                passedImprovementClass,
                failedPrevious,
                passedPrevious);
    }

    private Course createCourse(UUID departmentId, String code, String name) {
        Course course = new Course();
        course.setDepartmentId(departmentId);
        course.setCode(code);
        course.setName(name);
        course.setCredits(3D);
        course.setCourseType("THEORY");
        course.setIsActive(true);
        return courseRepository.save(course);
    }

    private void addProgramCourse(UUID trainingProgramId, UUID courseId) {
        TrainingProgramCourse item = new TrainingProgramCourse();
        item.setTrainingProgramId(trainingProgramId);
        item.setCourseId(courseId);
        item.setIsRequired(true);
        item.setCredits(BigDecimal.valueOf(3D));
        item.setStatus("ACTIVE");
        item.setIsActive(true);
        trainingProgramCourseRepository.save(item);
    }

    private Semester createSemester(UUID schoolYearId, String code, LocalDate startDate, LocalDate endDate) {
        Semester semester = new Semester();
        semester.setCode(code);
        semester.setName("Học kỳ " + code);
        semester.setSchoolYearId(schoolYearId);
        semester.setStartDate(startDate);
        semester.setEndDate(endDate);
        semester.setStatus(true);
        semester.setIsActive(true);
        return semesterRepository.save(semester);
    }

    private RegistrationPeriod createPeriod(UUID semesterId, String code, LocalDateTime startDate, LocalDateTime endDate) {
        RegistrationPeriod period = new RegistrationPeriod();
        period.setCode(code);
        period.setName("Đợt đăng ký " + code);
        period.setSemesterId(semesterId);
        period.setStartDate(startDate);
        period.setEndDate(endDate);
        period.setStatus(1);
        period.setAllowRetake(true);
        period.setIsActive(true);
        return registrationPeriodRepository.save(period);
    }

    private CourseClass createClass(UUID courseId, UUID semesterId, String classCode, int currentStudent) {
        CourseClass courseClass = new CourseClass();
        courseClass.setClassCode(classCode);
        courseClass.setCourseId(courseId);
        courseClass.setSemesterId(semesterId);
        courseClass.setMaxStudent(40);
        courseClass.setCurrentStudent(currentStudent);
        courseClass.setStartDate(LocalDate.now().minusDays(5));
        courseClass.setEndDate(LocalDate.now().plusMonths(2));
        courseClass.setStatus("OPEN");
        courseClass.setIsActive(true);
        return courseClassRepository.save(courseClass);
    }

    private CourseRegistration createRegistration(UUID studentId, UUID courseClassId, UUID periodId) {
        CourseRegistration registration = CourseRegistration.builder()
                .studentId(studentId)
                .courseClassId(courseClassId)
                .registrationPeriodId(periodId)
                .registeredAt(LocalDateTime.now().minusMonths(3))
                .status(1)
                .isPaid(true)
                .build();
        registration.setIsActive(true);
        return registrationRepository.save(registration);
    }

    private void createSummary(CourseRegistration registration, BigDecimal totalScore, String letterGrade, String result) {
        StudentSummary summary = new StudentSummary();
        summary.setCourseRegistration(registration);
        summary.setTotalScore(totalScore);
        summary.setLetterGrade(letterGrade);
        summary.setResult(result);
        summary.setGpaValue("PASSED".equals(result) ? BigDecimal.valueOf(3D) : BigDecimal.ZERO);
        summary.setIsFinalized(true);
        summary.setIsActive(true);
        summaryRepository.save(summary);
    }

    private record TestData(
            String username,
            Student student,
            Semester currentSemester,
            Course failedCourse,
            Course passedCourse,
            CourseClass failedRetakeClass,
            CourseClass passedImprovementClass,
            CourseRegistration failedPreviousRegistration,
            CourseRegistration passedPreviousRegistration) {
    }
}
