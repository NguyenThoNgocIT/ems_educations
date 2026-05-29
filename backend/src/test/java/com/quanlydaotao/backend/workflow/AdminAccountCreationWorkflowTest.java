package com.quanlydaotao.backend.workflow;

import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortRequest;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortResponse;
import com.quanlydaotao.backend.academiccohort.service.AcademicCohortService;
import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.service.AdministrativeClassService;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.degree.entity.Degree;
import com.quanlydaotao.backend.degree.repository.DegreeRepository;
import com.quanlydaotao.backend.department.dto.DepartmentDto;
import com.quanlydaotao.backend.department.service.DepartmentService;
import com.quanlydaotao.backend.division.entity.Division;
import com.quanlydaotao.backend.division.repository.DivisionRepository;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminCreateRequest;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.instructor.service.InstructorService;
import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;
import com.quanlydaotao.backend.major.service.MajorService;
import com.quanlydaotao.backend.position.entity.Position;
import com.quanlydaotao.backend.position.repository.PositionRepository;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.service.SchoolYearService;
import com.quanlydaotao.backend.semester.dto.SemesterRequest;
import com.quanlydaotao.backend.semester.dto.SemesterResponse;
import com.quanlydaotao.backend.semester.service.SemesterService;
import com.quanlydaotao.backend.staff.dto.StaffAdminCreateRequest;
import com.quanlydaotao.backend.staff.repository.StaffRepository;
import com.quanlydaotao.backend.staff.service.StaffService;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.studentclass.repository.StudentClassRepository;
import com.quanlydaotao.backend.studentstatus.entity.StudentStatusCatalog;
import com.quanlydaotao.backend.studentstatus.repository.StudentStatusCatalogRepository;
import com.quanlydaotao.backend.studentstatus.repository.StudentStatusHistoryRepository;
import com.quanlydaotao.backend.support.AbstractPostgresIntegrationTest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.service.TrainingProgramService;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AdminAccountCreationWorkflowTest extends AbstractPostgresIntegrationTest {
    @Autowired StudentService studentService;
    @Autowired InstructorService instructorService;
    @Autowired StaffService staffService;
    @Autowired DepartmentService departmentService;
    @Autowired MajorService majorService;
    @Autowired AcademicCohortService academicCohortService;
    @Autowired SchoolYearService schoolYearService;
    @Autowired SemesterService semesterService;
    @Autowired TrainingProgramService trainingProgramService;
    @Autowired AdministrativeClassService administrativeClassService;
    @Autowired RoleRepository roleRepository;
    @Autowired UserRepository userRepository;
    @Autowired UserRoleRepository userRoleRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired StudentClassRepository studentClassRepository;
    @Autowired StudentStatusCatalogRepository studentStatusCatalogRepository;
    @Autowired StudentStatusHistoryRepository studentStatusHistoryRepository;
    @Autowired InstructorProfileRepository instructorProfileRepository;
    @Autowired StaffRepository staffRepository;
    @Autowired DegreeRepository degreeRepository;
    @Autowired DivisionRepository divisionRepository;
    @Autowired PositionRepository positionRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @Test
    void adminCreatesStudentInstructorAndStaff_generatedAccountsAndRelationsAreCorrect() {
        ensureRoles();
        String suffix = String.valueOf(System.nanoTime()).substring(6);

        DepartmentDto itDepartment = createDepartment("IT" + suffix, "Khoa CNTT " + suffix);
        DepartmentDto businessDepartment = createDepartment("BUS" + suffix, "Khoa Kinh tế " + suffix);
        MajorResponse softwareMajor = createMajor("SE" + suffix, "Kỹ thuật phần mềm " + suffix, itDepartment.getDepartmentId());
        MajorResponse businessMajor = createMajor("BA" + suffix, "Quản trị " + suffix, businessDepartment.getDepartmentId());
        AcademicCohortResponse cohort = createCohort("K" + suffix);
        SemesterResponse semester = createSemester(suffix);
        TrainingProgramResponse program = createTrainingProgram(suffix, itDepartment.getDepartmentId(), softwareMajor.getMajorId(), cohort.getCohortId());
        AdministrativeClassResponse adminClass = createAdministrativeClass(suffix, itDepartment.getDepartmentId(), softwareMajor.getMajorId(), cohort.getCohortId());
        StudentStatusCatalog activeStatus = createStudentStatus(suffix);
        Degree degree = createDegree("THS" + suffix, softwareMajor.getMajorId());
        Division academicDivision = createDivision("DT" + suffix);
        Division financeDivision = createDivision("TC" + suffix);
        Position academicOfficer = createPosition("CV" + suffix, academicDivision.getDivisionId());
        Position financeOfficer = createPosition("KT" + suffix, financeDivision.getDivisionId());

        AccountCreationResponse student = studentService.createStudentForAdmin(buildStudentRequest(
                suffix,
                itDepartment.getDepartmentId(),
                softwareMajor.getMajorId(),
                cohort.getCohortId(),
                program.getTrainingProgramId(),
                adminClass.getClassId(),
                semester.getSemesterId(),
                activeStatus.getStudentStatusId()));

        assertThat(student.getType()).isEqualTo("STUDENT");
        assertThat(student.getStudentCode()).isNotBlank();
        assertThat(student.getUsername()).isEqualTo(student.getStudentCode().toLowerCase());
        assertThat(student.getEmailEdu()).isEqualTo("sinhvien" + student.getUsername() + "@donga.edu.vn");
        assertThat(student.getInitialPassword()).isEqualTo("02092004");
        assertThat(student.getRequirePasswordChange()).isTrue();
        assertThat(student.getStudentClassId()).isNotNull();
        assertThat(student.getStudentStatusHistoryId()).isNotNull();
        assertAccount(student.getUserId(), "STUDENT", "02092004");
        assertThat(studentRepository.findById(student.getStudentId()).orElseThrow().getTrainingProgramId())
                .isEqualTo(program.getTrainingProgramId());
        assertThat(studentClassRepository.findById(student.getStudentClassId())).isPresent();
        assertThat(studentStatusHistoryRepository.findById(student.getStudentStatusHistoryId())).isPresent();

        AccountCreationResponse instructor = instructorService.createInstructorForAdmin(buildInstructorRequest(
                suffix,
                itDepartment.getDepartmentId(),
                softwareMajor.getMajorId(),
                degree.getDegreeId()));

        assertThat(instructor.getType()).isEqualTo("INSTRUCTOR");
        assertThat(instructor.getEmployeeCode()).isNotBlank();
        assertThat(instructor.getInstructorCode()).isEqualTo("GV" + instructor.getEmployeeCode());
        assertThat(instructor.getUsername()).isEqualTo(instructor.getInstructorCode().toLowerCase());
        assertThat(instructor.getEmailEdu()).isEqualTo("giangvien" + instructor.getUsername() + "@donga.edu.vn");
        assertAccount(instructor.getUserId(), "LECTURER", "15081990");
        InstructorProfile instructorProfile = instructorProfileRepository.findByInstructorCode(instructor.getInstructorCode()).orElseThrow();
        assertThat(instructorProfile.getDepartmentId()).isEqualTo(itDepartment.getDepartmentId());
        assertThat(instructorProfile.getMajorId()).isEqualTo(softwareMajor.getMajorId());
        assertThat(instructorProfile.getDegreeId()).isEqualTo(degree.getDegreeId());

        AccountCreationResponse staff = staffService.createStaffForAdmin(buildStaffRequest(
                suffix,
                academicDivision.getDivisionId(),
                academicOfficer.getPositionId()));

        assertThat(staff.getType()).isEqualTo("STAFF");
        assertThat(staff.getEmployeeCode()).isNotBlank();
        assertThat(staff.getStaffCode()).isEqualTo("NV" + staff.getEmployeeCode());
        assertThat(staff.getUsername()).isEqualTo(staff.getStaffCode().toLowerCase());
        assertThat(staff.getEmailEdu()).isEqualTo("nhanvien" + staff.getUsername() + "@donga.edu.vn");
        assertAccount(staff.getUserId(), "STAFF", "22101992");
        assertThat(staffRepository.findByStaffCode(staff.getStaffCode()).orElseThrow().getDivisionId())
                .isEqualTo(academicDivision.getDivisionId());

        StudentAdminCreateRequest invalidStudentRequest = buildStudentRequest(
                suffix + "BADST",
                itDepartment.getDepartmentId(),
                softwareMajor.getMajorId(),
                cohort.getCohortId(),
                program.getTrainingProgramId(),
                null,
                null,
                null);
        invalidStudentRequest.setAcademicCohortId(UUID.randomUUID());
        assertThatThrownBy(() -> studentService.createStudentForAdmin(invalidStudentRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Khóa học không tồn tại");

        assertThatThrownBy(() -> instructorService.createInstructorForAdmin(buildInstructorRequest(
                suffix + "BADGV",
                itDepartment.getDepartmentId(),
                businessMajor.getMajorId(),
                null)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Ngành không thuộc khoa");

        assertThatThrownBy(() -> staffService.createStaffForAdmin(buildStaffRequest(
                suffix + "BADNV",
                academicDivision.getDivisionId(),
                financeOfficer.getPositionId())))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Chức vụ không thuộc phòng ban");
    }

    private void assertAccount(UUID userId, String roleCode, String rawPassword) {
        User user = userRepository.findById(userId).orElseThrow();
        assertThat(user.getRequirePasswordChange()).isTrue();
        assertThat(user.getEmailConfirmed()).isFalse();
        assertThat(user.getConfirmationToken()).isNotBlank();
        assertThat(passwordEncoder.matches(rawPassword, user.getPasswordHash())).isTrue();
        List<String> roles = userRoleRepository.findActiveRolesByUserId(userId).stream()
                .map(userRole -> userRole.getRole().getCode())
                .toList();
        assertThat(roles).contains(roleCode);
    }

    private StudentAdminCreateRequest buildStudentRequest(
            String suffix,
            UUID departmentId,
            UUID majorId,
            UUID cohortId,
            UUID trainingProgramId,
            UUID classId,
            UUID semesterId,
            UUID statusId) {
        StudentAdminCreateRequest request = new StudentAdminCreateRequest();
        request.setFullName("Sinh Viên " + suffix);
        request.setFullNameNoAccent("sinhvien");
        request.setDateOfBirth(LocalDate.of(2004, 9, 2));
        request.setGender("MALE");
        request.setPersonalIdentificationNumber("SVCCCD" + suffix);
        request.setContactEmail("student" + suffix + "@example.com");
        request.setPhoneNumber("090" + suffix.substring(0, Math.min(7, suffix.length())));
        request.setDepartmentId(departmentId);
        request.setMajorId(majorId);
        request.setAcademicCohortId(cohortId);
        request.setTrainingProgramId(trainingProgramId);
        request.setClassId(classId);
        request.setSemesterId(semesterId);
        request.setAdmissionDate(LocalDate.of(2026, 9, 1));
        request.setStudentStatusId(statusId);
        request.setStudentStatusStartDate(LocalDate.of(2026, 9, 1));
        return request;
    }

    private InstructorAdminCreateRequest buildInstructorRequest(String suffix, UUID departmentId, UUID majorId, UUID degreeId) {
        InstructorAdminCreateRequest request = new InstructorAdminCreateRequest();
        request.setFullName("Giảng Viên " + suffix);
        request.setFullNameNoAccent("giangvien");
        request.setDateOfBirth(LocalDate.of(1990, 8, 15));
        request.setGender("FEMALE");
        request.setPersonalIdentificationNumber("GVCCCD" + suffix);
        request.setStartWorkDate(LocalDate.of(2026, 1, 1));
        request.setContractType("FULL_TIME");
        request.setDepartmentId(departmentId);
        request.setMajorId(majorId);
        request.setDegreeId(degreeId);
        request.setAcademicRank("LECTURER");
        request.setSpecialization("Software Engineering");
        request.setInstitution("UEMS");
        request.setGraduationYear(2018);
        return request;
    }

    private StaffAdminCreateRequest buildStaffRequest(String suffix, UUID divisionId, UUID positionId) {
        StaffAdminCreateRequest request = new StaffAdminCreateRequest();
        request.setFullName("Nhân Viên " + suffix);
        request.setFullNameNoAccent("nhanvien");
        request.setDateOfBirth(LocalDate.of(1992, 10, 22));
        request.setGender("MALE");
        request.setPersonalIdentificationNumber("NVCCCD" + suffix);
        request.setStartWorkDate(LocalDate.of(2026, 1, 1));
        request.setContractType("FULL_TIME");
        request.setDivisionId(divisionId);
        request.setPositionId(positionId);
        return request;
    }

    private void ensureRoles() {
        ensureRole("STUDENT", "Sinh viên", 30);
        ensureRole("LECTURER", "Giảng viên", 20);
        ensureRole("STAFF", "Nhân viên", 25);
    }

    private void ensureRole(String code, String name, int level) {
        roleRepository.findByCode(code).orElseGet(() -> {
            Role role = new Role();
            role.setCode(code);
            role.setName(name);
            role.setLevel(level);
            role.setIsSystem(true);
            role.setIsActive(true);
            return roleRepository.save(role);
        });
    }

    private DepartmentDto createDepartment(String code, String name) {
        DepartmentDto request = new DepartmentDto();
        request.setCode(code);
        request.setName(name);
        request.setIsActive(true);
        return departmentService.createDepartment(request);
    }

    private MajorResponse createMajor(String code, String name, UUID departmentId) {
        MajorRequest request = new MajorRequest();
        request.setCode(code);
        request.setName(name);
        request.setDepartmentId(departmentId);
        request.setEffectiveDate(LocalDate.of(2026, 1, 1));
        request.setIsActive(true);
        return majorService.createMajor(request);
    }

    private AcademicCohortResponse createCohort(String code) {
        AcademicCohortRequest request = new AcademicCohortRequest();
        request.setCode(code);
        request.setName("Khóa " + code);
        request.setStartYear(2026);
        request.setEndYear(2030);
        request.setStartDate(LocalDate.of(2026, 9, 1));
        request.setEndDate(LocalDate.of(2030, 8, 31));
        request.setIsActive(true);
        return academicCohortService.createCohort(request);
    }

    private SemesterResponse createSemester(String suffix) {
        SchoolYearRequest schoolYearRequest = new SchoolYearRequest();
        schoolYearRequest.setCode("SY" + suffix);
        schoolYearRequest.setName("Năm học " + suffix);
        schoolYearRequest.setStartDate(LocalDate.of(2026, 8, 1));
        schoolYearRequest.setEndDate(LocalDate.of(2027, 7, 31));
        schoolYearRequest.setIsActive(true);
        SchoolYearResponse schoolYear = schoolYearService.createSchoolYear(schoolYearRequest);

        SemesterRequest semesterRequest = new SemesterRequest();
        semesterRequest.setCode("HK1" + suffix);
        semesterRequest.setName("Học kỳ 1 " + suffix);
        semesterRequest.setSchoolYearId(schoolYear.getSchoolYearId());
        semesterRequest.setStartDate(LocalDate.of(2026, 9, 1));
        semesterRequest.setEndDate(LocalDate.of(2026, 12, 31));
        semesterRequest.setStatus(true);
        semesterRequest.setIsActive(true);
        return semesterService.createSemester(semesterRequest);
    }

    private TrainingProgramResponse createTrainingProgram(String suffix, UUID departmentId, UUID majorId, UUID cohortId) {
        TrainingProgramRequest request = new TrainingProgramRequest();
        request.setCode("TP" + suffix);
        request.setName("Chương trình đào tạo " + suffix);
        request.setDepartmentId(departmentId);
        request.setMajorId(majorId);
        request.setAcademicCohortId(cohortId);
        request.setProgramPhase("FOUNDATION");
        request.setDegreeLevel("Đại học");
        request.setEducationType("Chính quy");
        request.setTotalCredits(120);
        request.setDurationYears(new BigDecimal("4.0"));
        request.setMaxDurationYears(new BigDecimal("6.0"));
        request.setEffectiveDate(LocalDate.of(2026, 9, 1));
        request.setStatus("ACTIVE");
        request.setIsActive(true);
        return trainingProgramService.createProgram(request);
    }

    private AdministrativeClassResponse createAdministrativeClass(String suffix, UUID departmentId, UUID majorId, UUID cohortId) {
        AdministrativeClassRequest request = new AdministrativeClassRequest();
        request.setClassCode("DHKTPM" + suffix);
        request.setClassName("Lớp KTPM " + suffix);
        request.setDepartmentId(departmentId);
        request.setMajorId(majorId);
        request.setAcademicCohortId(cohortId);
        request.setClassPhase("FOUNDATION");
        request.setMaxSize(50);
        request.setStatus(1);
        request.setIsActive(true);
        return administrativeClassService.createClass(request);
    }

    private StudentStatusCatalog createStudentStatus(String suffix) {
        StudentStatusCatalog status = new StudentStatusCatalog();
        status.setCode("ACTIVE" + suffix);
        status.setName("Đang học " + suffix);
        status.setStatusType("ACTIVE");
        status.setIsActive(true);
        return studentStatusCatalogRepository.save(status);
    }

    private Degree createDegree(String code, UUID majorId) {
        Degree degree = new Degree();
        degree.setCode(code);
        degree.setName("Thạc sĩ " + code);
        degree.setLevel(2);
        degree.setMajorId(majorId);
        degree.setIsActive(true);
        return degreeRepository.save(degree);
    }

    private Division createDivision(String code) {
        Division division = new Division();
        division.setCode(code);
        division.setName("Phòng " + code);
        division.setIsActive(true);
        return divisionRepository.save(division);
    }

    private Position createPosition(String code, UUID divisionId) {
        Position position = new Position();
        position.setCode(code);
        position.setName("Chuyên viên " + code);
        position.setDivisionId(divisionId);
        position.setIsActive(true);
        return positionRepository.save(position);
    }
}
