package com.quanlydaotao.backend.account.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationRequest;
import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.course.entity.TrainingProgram;
import com.quanlydaotao.backend.course.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.course.repository.MajorRepository;
import com.quanlydaotao.backend.course.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.degree.repository.DegreeRepository;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminCreateRequest;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.notification.service.EmailNotificationService;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.staff.entity.Staff;
import com.quanlydaotao.backend.staff.dto.StaffAdminCreateRequest;
import com.quanlydaotao.backend.staff.repository.StaffRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import com.quanlydaotao.backend.utils.StringUtil;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl {
    private static final String TYPE_STUDENT = "STUDENT";
    private static final String TYPE_INSTRUCTOR = "INSTRUCTOR";
    private static final String TYPE_STAFF = "STAFF";
    private static final DateTimeFormatter DEFAULT_PASSWORD_FORMAT = DateTimeFormatter.ofPattern("ddMMyyyy");

    private final EntityManager entityManager;
    private final PasswordEncoder passwordEncoder;
    private final PersonRepository personRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final MajorRepository majorRepository;
    private final AcademicCohortRepository academicCohortRepository;
    private final DepartmentRepository departmentRepository;
    private final DegreeRepository degreeRepository;
    private final ObjectProvider<EmailNotificationService> emailNotificationServiceProvider;

    @Value("${app.auth.password-change-url:http://localhost:3000/change-password}")
    private String passwordChangeUrl;

    @Transactional
    public AccountCreationResponse createAccount(AccountCreationRequest request) {
        String type = normalizeType(request.getType());
        Person person = personRepository.save(buildPerson(request));

        String generatedCode;
        String username;
        String roleCode;
        UUID studentId = null;
        UUID employeeId = null;

        if (TYPE_STUDENT.equals(type)) {
            Student student = createStudentProfile(request, person);
            studentId = student.getStudentId();
            generatedCode = student.getStudentCode();
            username = generatedCode;
            roleCode = "STUDENT";
        } else {
            Employee employee = createEmployee(request, person, type);
            employeeId = employee.getEmployeeId();

            if (TYPE_INSTRUCTOR.equals(type)) {
                InstructorProfile instructor = createInstructorProfile(request, employee);
                generatedCode = instructor.getInstructorCode();
                username = generatedCode.toLowerCase(Locale.ROOT);
                roleCode = "LECTURER";
            } else {
                Staff staff = createStaffProfile(request, employee);
                generatedCode = staff.getStaffCode();
                username = generatedCode.toLowerCase(Locale.ROOT);
                roleCode = "STAFF";
            }
        }

        String emailPrefix = firstNameForAccount(person);
        String emailEdu = emailPrefix + username.toLowerCase(Locale.ROOT) + "@donga.edu.vn";
        String rawPassword = request.getDateOfBirth().format(DEFAULT_PASSWORD_FORMAT);
        User user = createUser(person, username.toLowerCase(Locale.ROOT), emailEdu, rawPassword);
        assignRole(user, roleCode);
        String confirmationLink = buildConfirmationLink(user.getConfirmationToken());
        emailNotificationServiceProvider.ifAvailable(service -> service.sendAccountConfirmation(user, rawPassword, confirmationLink));

        return AccountCreationResponse.builder()
                .personId(person.getPersonId())
                .studentId(studentId)
                .employeeId(employeeId)
                .userId(user.getUserId())
                .type(type)
                .roleCode(roleCode)
                .generatedCode(generatedCode)
                .studentCode(TYPE_STUDENT.equals(type) ? generatedCode : null)
                .employeeCode(employeeId != null ? findEmployeeCode(employeeId) : null)
                .instructorCode(TYPE_INSTRUCTOR.equals(type) ? generatedCode : null)
                .staffCode(TYPE_STAFF.equals(type) ? generatedCode : null)
                .username(user.getUsername())
                .emailEdu(user.getEmail())
                .initialPassword(rawPassword)
                .confirmationToken(user.getConfirmationToken())
                .confirmationLink(confirmationLink)
                .requirePasswordChange(user.getRequirePasswordChange())
                .majorId(request.getMajorId())
                .trainingProgramId(request.getTrainingProgramId())
                .academicCohortId(request.getAcademicCohortId())
                .classId(request.getClassId())
                .departmentId(request.getDepartmentId())
                .degreeId(request.getDegreeId())
                .divisionId(request.getDivisionId())
                .positionId(request.getPositionId())
                .build();
    }

    @Transactional
    public AccountCreationResponse createStudentAccount(StudentAdminCreateRequest request) {
        AccountCreationRequest accountRequest = new AccountCreationRequest();
        fillCommonPerson(accountRequest, request.getFullName(), request.getFullNameNoAccent(), request.getDateOfBirth(),
                request.getGender(), request.getPlaceOfBirth(), request.getEthnicity(), request.getPersonalIdentificationNumber(),
                request.getDateOfIssue(), request.getCardPlace(), request.getNationality(), request.getContactEmail(),
                request.getPhoneNumber(), request.getPermanentAddress(), request.getTemporaryAddress(), request.getAvatarUrl(),
                request.getNote());
        accountRequest.setType(TYPE_STUDENT);
        accountRequest.setStudentCode(request.getStudentCode());
        accountRequest.setMajorId(request.getMajorId());
        accountRequest.setTrainingProgramId(request.getTrainingProgramId());
        accountRequest.setAcademicCohortId(request.getAcademicCohortId());
        accountRequest.setClassId(request.getClassId());
        accountRequest.setAdmissionDate(request.getAdmissionDate());
        return createAccount(accountRequest);
    }

    @Transactional
    public AccountCreationResponse createInstructorAccount(InstructorAdminCreateRequest request) {
        AccountCreationRequest accountRequest = new AccountCreationRequest();
        fillCommonPerson(accountRequest, request.getFullName(), request.getFullNameNoAccent(), request.getDateOfBirth(),
                request.getGender(), request.getPlaceOfBirth(), request.getEthnicity(), request.getPersonalIdentificationNumber(),
                request.getDateOfIssue(), request.getCardPlace(), request.getNationality(), request.getContactEmail(),
                request.getPhoneNumber(), request.getPermanentAddress(), request.getTemporaryAddress(), request.getAvatarUrl(),
                request.getNote());
        accountRequest.setType(TYPE_INSTRUCTOR);
        accountRequest.setEmployeeCode(request.getEmployeeCode());
        accountRequest.setInstructorCode(request.getInstructorCode());
        accountRequest.setStartWorkDate(request.getStartWorkDate());
        accountRequest.setEndWorkDate(request.getEndWorkDate());
        accountRequest.setContractType(request.getContractType());
        accountRequest.setDepartmentId(request.getDepartmentId());
        accountRequest.setDegreeId(request.getDegreeId());
        accountRequest.setAcademicRank(request.getAcademicRank());
        accountRequest.setMajorId(request.getMajorId());
        accountRequest.setSpecialization(request.getSpecialization());
        accountRequest.setInstitution(request.getInstitution());
        accountRequest.setGraduationYear(request.getGraduationYear());
        return createAccount(accountRequest);
    }

    @Transactional
    public AccountCreationResponse createStaffAccount(StaffAdminCreateRequest request) {
        AccountCreationRequest accountRequest = new AccountCreationRequest();
        fillCommonPerson(accountRequest, request.getFullName(), request.getFullNameNoAccent(), request.getDateOfBirth(),
                request.getGender(), request.getPlaceOfBirth(), request.getEthnicity(), request.getPersonalIdentificationNumber(),
                request.getDateOfIssue(), request.getCardPlace(), request.getNationality(), request.getContactEmail(),
                request.getPhoneNumber(), request.getPermanentAddress(), request.getTemporaryAddress(), request.getAvatarUrl(),
                request.getNote());
        accountRequest.setType(TYPE_STAFF);
        accountRequest.setEmployeeCode(request.getEmployeeCode());
        accountRequest.setStaffCode(request.getStaffCode());
        accountRequest.setStartWorkDate(request.getStartWorkDate());
        accountRequest.setEndWorkDate(request.getEndWorkDate());
        accountRequest.setContractType(request.getContractType());
        accountRequest.setDivisionId(request.getDivisionId());
        accountRequest.setPositionId(request.getPositionId());
        return createAccount(accountRequest);
    }

    private Person buildPerson(AccountCreationRequest request) {
        validateRequired(request.getFullName(), "Họ tên không được để trống");
        if (request.getDateOfBirth() == null) {
            throw new BusinessException("Ngày sinh không được để trống để sinh mật khẩu mặc định");
        }
        if (StringUtils.hasText(request.getPersonalIdentificationNumber()) && existsPersonIdentification(request.getPersonalIdentificationNumber())) {
            throw new BusinessException("CCCD/CMND đã tồn tại");
        }

        Person person = new Person();
        person.setFullName(request.getFullName().trim());
        person.setFullNameNoAccent(resolveFullNameNoAccent(request));
        person.setGender(request.getGender());
        person.setDateOfBirth(request.getDateOfBirth());
        person.setPlaceOfBirth(request.getPlaceOfBirth());
        person.setEthnicity(request.getEthnicity());
        person.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        person.setDateOfIssue(request.getDateOfIssue());
        person.setCardPlace(request.getCardPlace());
        person.setNationality(request.getNationality());
        person.setContactEmail(request.getContactEmail());
        person.setPhoneNumber(request.getPhoneNumber());
        person.setPermanentAddress(request.getPermanentAddress());
        person.setTemporaryAddress(request.getTemporaryAddress());
        person.setAvatarUrl(request.getAvatarUrl());
        person.setNote(request.getNote());
        return person;
    }

    private Student createStudentProfile(AccountCreationRequest request, Person person) {
        if (request.getTrainingProgramId() == null) {
            throw new BusinessException("Chương trình đào tạo không được để trống");
        }
        TrainingProgram trainingProgram = trainingProgramRepository.findById(request.getTrainingProgramId())
                .orElseThrow(() -> new BusinessException("Chương trình đào tạo không tồn tại"));
        if (request.getMajorId() != null && !majorRepository.existsById(request.getMajorId())) {
            throw new BusinessException("Ngành không tồn tại");
        }
        if (request.getAcademicCohortId() != null && !academicCohortRepository.existsById(request.getAcademicCohortId())) {
            throw new BusinessException("Khóa học không tồn tại");
        }
        if (request.getMajorId() != null && trainingProgram.getMajorId() != null && !request.getMajorId().equals(trainingProgram.getMajorId())) {
            throw new BusinessException("Ngành không khớp với chương trình đào tạo");
        }
        if (request.getAcademicCohortId() != null && trainingProgram.getAcademicCohortId() != null
                && !request.getAcademicCohortId().equals(trainingProgram.getAcademicCohortId())) {
            throw new BusinessException("Khóa học không khớp với chương trình đào tạo");
        }
        if (request.getClassId() != null && !existsActiveReference("Classes", "ClassId", request.getClassId())) {
            throw new BusinessException("Lớp không tồn tại");
        }
        if (request.getClassId() != null && request.getAcademicCohortId() != null
                && !classMatchesCohort(request.getClassId(), request.getAcademicCohortId())) {
            throw new BusinessException("Lớp không thuộc khóa học đã chọn");
        }

        String studentCode = normalizeCode(request.getStudentCode(), generateStudentCode());
        if (studentRepository.findByStudentCode(studentCode).isPresent()) {
            throw new BusinessException("Mã sinh viên đã tồn tại");
        }

        Student student = new Student();
        student.setPerson(person);
        student.setStudentCode(studentCode);
        student.setMajorId(request.getMajorId());
        student.setTrainingProgramId(request.getTrainingProgramId());
        student.setAcademicCohortId(request.getAcademicCohortId());
        student.setClassId(request.getClassId());
        student.setAdmissionDate(request.getAdmissionDate());
        student.setNote(request.getNote());
        return studentRepository.save(student);
    }

    private Employee createEmployee(AccountCreationRequest request, Person person, String type) {
        String employeeCode = normalizeCode(request.getEmployeeCode(), generateEmployeeCode());
        if (employeeRepository.findByEmployeeCode(employeeCode).isPresent()) {
            throw new BusinessException("Mã nhân viên đã tồn tại");
        }

        Employee employee = new Employee();
        employee.setPerson(person);
        employee.setEmployeeCode(employeeCode);
        employee.setStartWorkDate(request.getStartWorkDate() != null ? request.getStartWorkDate() : LocalDate.now());
        employee.setEndWorkDate(request.getEndWorkDate());
        employee.setContractType(request.getContractType());
        employee.setNote(request.getNote());
        employee.setEmployeeType(type);
        employee.setStatus("ACTIVE");
        return employeeRepository.save(employee);
    }

    private InstructorProfile createInstructorProfile(AccountCreationRequest request, Employee employee) {
        if (request.getDepartmentId() == null) {
            throw new BusinessException("Khoa/Bộ môn không được để trống");
        }
        if (!departmentRepository.existsById(request.getDepartmentId())) {
            throw new BusinessException("Khoa/Bộ môn không tồn tại");
        }
        if (request.getDegreeId() != null && !degreeRepository.existsById(request.getDegreeId())) {
            throw new BusinessException("Học vị không tồn tại");
        }
        if (request.getMajorId() != null && !majorRepository.existsById(request.getMajorId())) {
            throw new BusinessException("Ngành không tồn tại");
        }

        String instructorCode = normalizeCode(request.getInstructorCode(), "GV" + employee.getEmployeeCode());
        if (instructorProfileRepository.findByInstructorCode(instructorCode).isPresent()) {
            throw new BusinessException("Mã giảng viên đã tồn tại");
        }

        InstructorProfile instructor = new InstructorProfile();
        instructor.setEmployee(employee);
        instructor.setInstructorCode(instructorCode);
        instructor.setDepartmentId(request.getDepartmentId());
        instructor.setDegreeId(request.getDegreeId());
        instructor.setAcademicRank(request.getAcademicRank());
        instructor.setMajorId(request.getMajorId());
        instructor.setSpecialization(request.getSpecialization());
        instructor.setInstitution(request.getInstitution());
        instructor.setGraduationYear(request.getGraduationYear());
        return instructorProfileRepository.save(instructor);
    }

    private Staff createStaffProfile(AccountCreationRequest request, Employee employee) {
        if (request.getDivisionId() == null) {
            throw new BusinessException("Phòng ban không được để trống");
        }
        if (!existsActiveReference("Divisions", "DivisionId", request.getDivisionId())) {
            throw new BusinessException("Phòng ban không tồn tại");
        }
        if (request.getPositionId() != null && !existsActiveReference("Positions", "PositionId", request.getPositionId())) {
            throw new BusinessException("Chức vụ không tồn tại");
        }

        String staffCode = normalizeCode(request.getStaffCode(), "NV" + employee.getEmployeeCode());
        if (staffRepository.findByStaffCode(staffCode).isPresent()) {
            throw new BusinessException("Mã nhân viên hành chính đã tồn tại");
        }

        Staff staff = new Staff();
        staff.setEmployee(employee);
        staff.setStaffCode(staffCode);
        staff.setDivisionId(request.getDivisionId());
        staff.setPositionId(request.getPositionId());
        return staffRepository.save(staff);
    }

    private User createUser(Person person, String username, String email, String rawPassword) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new BusinessException("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("Email edu đã tồn tại");
        }

        User user = new User();
        user.setPerson(person);
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRequirePasswordChange(true);
        user.setEmailConfirmed(false);
        user.setConfirmationToken(UUID.randomUUID().toString());
        user.setAccessFailedCount(0);
        return userRepository.save(user);
    }

    private void assignRole(User user, String roleCode) {
        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new BusinessException("Vai trò " + roleCode + " chưa được cấu hình"));
        UserRole userRole = new UserRole();
        userRole.setId(new UserRoleId(user.getUserId(), role.getRoleId()));
        userRole.setUser(user);
        userRole.setRole(role);
        userRole.setIsActive(true);
        userRoleRepository.save(userRole);
    }

    private String generateStudentCode() {
        long maxCode = studentRepository.findAll().stream()
                .map(Student::getStudentCode)
                .map(this::parseLongOrZero)
                .max(Long::compareTo)
                .orElse(100000L);
        return String.valueOf(maxCode + 1);
    }

    private String generateEmployeeCode() {
        long currentYearBase = Year.now().getValue() * 1000L;
        long maxCode = employeeRepository.findAll().stream()
                .map(Employee::getEmployeeCode)
                .map(this::parseLongOrZero)
                .filter(code -> code >= currentYearBase)
                .max(Long::compareTo)
                .orElse(currentYearBase);
        return String.valueOf(maxCode + 1);
    }

    private long parseLongOrZero(String value) {
        if (!StringUtils.hasText(value)) {
            return 0L;
        }
        try {
            return Long.parseLong(value.replaceAll("\\D", ""));
        } catch (NumberFormatException ex) {
            return 0L;
        }
    }

    private boolean existsPersonIdentification(String personalIdentificationNumber) {
        Long count = entityManager.createQuery("""
                        SELECT COUNT(p)
                        FROM Person p
                        WHERE p.personalIdentificationNumber = :pin
                          AND p.isActive = true
                        """, Long.class)
                .setParameter("pin", personalIdentificationNumber)
                .getSingleResult();
        return count > 0;
    }

    private boolean existsActiveReference(String tableName, String idColumn, UUID id) {
        Number count = (Number) entityManager.createNativeQuery(
                        "SELECT COUNT(1) FROM " + tableName + " WHERE " + idColumn + " = :id AND IsActive = 1")
                .setParameter("id", id)
                .getSingleResult();
        return count.longValue() > 0;
    }

    private String normalizeType(String rawType) {
        validateRequired(rawType, "Loại tài khoản không được để trống");
        String type = rawType.trim().toUpperCase(Locale.ROOT);
        return switch (type) {
            case "STUDENT", "SINHVIEN" -> TYPE_STUDENT;
            case "INSTRUCTOR", "LECTURER", "GIANGVIEN" -> TYPE_INSTRUCTOR;
            case "STAFF", "NHANVIEN" -> TYPE_STAFF;
            default -> throw new BusinessException("Loại tài khoản không hợp lệ: " + rawType);
        };
    }

    private String normalizeCode(String requestedCode, String generatedCode) {
        String code = StringUtils.hasText(requestedCode) ? requestedCode : generatedCode;
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String resolveFullNameNoAccent(AccountCreationRequest request) {
        if (StringUtils.hasText(request.getFullNameNoAccent())) {
            return StringUtil.normalizeForAccountCode(request.getFullNameNoAccent());
        }
        return StringUtil.getFirstNameNoAccent(request.getFullName());
    }

    private String firstNameForAccount(Person person) {
        if (StringUtils.hasText(person.getFullNameNoAccent())) {
            return StringUtil.normalizeForAccountCode(person.getFullNameNoAccent());
        }
        return StringUtil.getFirstNameNoAccent(person.getFullName());
    }

    private void validateRequired(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new BusinessException(message);
        }
    }

    private void fillCommonPerson(AccountCreationRequest target, String fullName, String fullNameNoAccent, LocalDate dateOfBirth,
                                  String gender, String placeOfBirth, String ethnicity, String personalIdentificationNumber,
                                  LocalDate dateOfIssue, String cardPlace, String nationality, String contactEmail,
                                  String phoneNumber, String permanentAddress, String temporaryAddress, String avatarUrl,
                                  String note) {
        target.setFullName(fullName);
        target.setFullNameNoAccent(fullNameNoAccent);
        target.setDateOfBirth(dateOfBirth);
        target.setGender(gender);
        target.setPlaceOfBirth(placeOfBirth);
        target.setEthnicity(ethnicity);
        target.setPersonalIdentificationNumber(personalIdentificationNumber);
        target.setDateOfIssue(dateOfIssue);
        target.setCardPlace(cardPlace);
        target.setNationality(nationality);
        target.setContactEmail(contactEmail);
        target.setPhoneNumber(phoneNumber);
        target.setPermanentAddress(permanentAddress);
        target.setTemporaryAddress(temporaryAddress);
        target.setAvatarUrl(avatarUrl);
        target.setNote(note);
    }

    private String findEmployeeCode(UUID employeeId) {
        return employeeRepository.findById(employeeId)
                .map(Employee::getEmployeeCode)
                .orElse(null);
    }

    private boolean classMatchesCohort(UUID classId, UUID academicCohortId) {
        Number count = (Number) entityManager.createNativeQuery(
                        "SELECT COUNT(1) FROM Classes WHERE ClassId = :classId AND (AcademicCohortId IS NULL OR AcademicCohortId = :cohortId)")
                .setParameter("classId", classId)
                .setParameter("cohortId", academicCohortId)
                .getSingleResult();
        return count.longValue() > 0;
    }

    private String buildConfirmationLink(String token) {
        String separator = passwordChangeUrl.contains("?") ? "&" : "?";
        return passwordChangeUrl + separator + "token=" + token;
    }
}
