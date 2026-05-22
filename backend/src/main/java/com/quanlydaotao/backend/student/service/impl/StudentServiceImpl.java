package com.quanlydaotao.backend.student.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.entity.StudentGrade;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.repository.StudentGradeRepository;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalAcademicResultResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalGradeResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalScheduleResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalSemesterResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.mapper.StudentMapper;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.studentclass.service.StudentClassService;
import com.quanlydaotao.backend.studentstatus.service.StudentStatusHistoryService;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import com.quanlydaotao.backend.specialization.repository.SpecializationRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.utils.StringUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final AccountServiceImpl accountService;
    private final DepartmentRepository departmentRepository;
    private final MajorRepository majorRepository;
    private final AcademicCohortRepository academicCohortRepository;
    private final SpecializationRepository specializationRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final StudentGradeRepository studentGradeRepository;
    private final ScheduleRepository scheduleRepository;
    private final SemesterRepository semesterRepository;
    private final StudentMapper studentMapper;
    private final StudentClassService studentClassService;
    private final StudentStatusHistoryService studentStatusHistoryService;

    @Override
    @Transactional
    public AccountCreationResponse createStudentForAdmin(StudentAdminCreateRequest request) {
        return accountService.createStudentAccount(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAdminResponse> getAllStudentsForAdmin() {
        return studentRepository.findAll().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAdminResponse getStudentForAdmin(UUID id) {
        return toAdminResponse(findStudent(id));
    }

    @Override
    @Transactional
    public StudentAdminResponse updateStudentForAdmin(UUID id, StudentAdminUpdateRequest request) {
        Student student = findStudent(id);
        Person person = student.getPerson();

        if (StringUtils.hasText(request.getStudentCode()) && !request.getStudentCode().equalsIgnoreCase(student.getStudentCode())) {
            String studentCode = request.getStudentCode().trim().toUpperCase();
            if (studentRepository.findByStudentCode(studentCode).isPresent()) {
                throw new BusinessException("Mã sinh viên đã tồn tại");
            }
            student.setStudentCode(studentCode);
        }
        if (academicSelectionChanged(request)) {
            UUID departmentId = request.getDepartmentId() != null ? request.getDepartmentId() : resolveDepartmentId(student);
            UUID majorId = request.getMajorId() != null ? request.getMajorId() : student.getMajorId();
            UUID specializationId = request.getSpecializationId() != null ? request.getSpecializationId() : student.getSpecializationId();
            UUID trainingProgramId = request.getTrainingProgramId() != null ? request.getTrainingProgramId() : student.getTrainingProgramId();
            UUID academicCohortId = request.getAcademicCohortId() != null ? request.getAcademicCohortId() : student.getAcademicCohortId();
            validateStudentProgramSelection(departmentId, majorId, specializationId, trainingProgramId, academicCohortId);
            student.setDepartmentId(departmentId);
            student.setMajorId(majorId);
            student.setSpecializationId(specializationId);
            student.setTrainingProgramId(trainingProgramId);
            student.setAcademicCohortId(academicCohortId);
        }
        if (request.getClassId() != null) {
            if (request.getSemesterId() == null) {
                throw new BusinessException("Học kỳ không được để trống khi cập nhật lớp hành chính cho sinh viên");
            }
            studentClassService.assignStudentToClass(student.getStudentId(), request.getClassId(), request.getSemesterId(),
                    null, "ACTIVE", request.getNote());
            student.setClassId(request.getClassId());
        }
        if (request.getStudentStatusId() != null) {
            studentStatusHistoryService.setCurrentStatus(student.getStudentId(), request.getStudentStatusId(),
                    request.getStudentStatusStartDate(), request.getStudentStatusReason());
        }
        if (request.getAdmissionDate() != null) {
            student.setAdmissionDate(request.getAdmissionDate());
        }
        if (request.getNote() != null) {
            student.setNote(request.getNote());
        }
        if (request.getIsActive() != null) {
            student.setIsActive(request.getIsActive());
        }

        updatePersonForAdmin(person, request);
        personRepository.save(person);
        return toAdminResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudentForAdmin(UUID id) {
        Student student = findStudent(id);
        student.setIsActive(false);
        student.setDeletedAt(LocalDateTime.now());
        studentRepository.save(student);
        userRepository.findByPersonPersonId(student.getPerson().getPersonId()).ifPresent(user -> {
            user.setIsActive(false);
            user.setDeletedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public StudentSelfResponse getCurrentStudent(String username) {
        return studentMapper.toSelfDto(findCurrentStudent(username));
    }

    @Override
    @Transactional
    public StudentSelfResponse updateCurrentStudent(String username, StudentSelfUpdateRequest request) {
        Student student = findCurrentStudent(username);
        Person person = student.getPerson();
        updatePersonForSelf(person, request);
        personRepository.save(person);
        return studentMapper.toSelfDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalScheduleResponse> getCurrentStudentSchedule(String username) {
        Student student = findCurrentStudent(username);
        Map<UUID, StudentPortalScheduleResponse> schedules = new LinkedHashMap<>();

        courseRegistrationRepository.findByStudentIdAndIsActiveTrue(student.getStudentId()).stream()
                .map(CourseRegistration::getCourseClass)
                .filter(Objects::nonNull)
                .forEach(courseClass -> scheduleRepository.findByCourseClassCourseClassId(courseClass.getCourseClassId())
                        .stream()
                        .filter(schedule -> Boolean.TRUE.equals(schedule.getIsActive()))
                        .forEach(schedule -> schedules.putIfAbsent(schedule.getScheduleId(), toScheduleResponse(schedule))));

        return schedules.values().stream()
                .sorted(Comparator
                        .comparing(StudentPortalScheduleResponse::getDate, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(StudentPortalScheduleResponse::getDayOfWeek, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(StudentPortalScheduleResponse::getStartTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPortalAcademicResultResponse getCurrentStudentAcademicResult(String username) {
        Student student = findCurrentStudent(username);
        List<CourseRegistration> registrations = courseRegistrationRepository.findByStudentId(student.getStudentId()).stream()
                .filter(registration -> registration.getCourseClass() != null)
                .toList();
        List<StudentGrade> studentGrades = studentGradeRepository.findByStudentId(student.getStudentId());
        Map<UUID, Semester> semestersById = loadSemesters(registrations);
        Map<UUID, CourseRegistration> latestRegistrationByCourse = latestRegistrationByCourse(registrations, semestersById);

        List<StudentPortalGradeResponse> grades = studentGrades.stream()
                .filter(grade -> grade.getCourse() != null)
                .map(grade -> toGradeResponse(grade, latestRegistrationByCourse.get(grade.getCourseId()), semestersById))
                .sorted(Comparator
                        .comparing((StudentPortalGradeResponse grade) -> semesterStartDate(grade.getSemesterId(), semestersById), Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(StudentPortalGradeResponse::getCourseCode, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();

        List<StudentPortalSemesterResponse> semesterOptions = semestersById.values().stream()
                .sorted(Comparator.comparing(Semester::getStartDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(semester -> StudentPortalSemesterResponse.builder()
                        .semesterId(semester.getSemesterId())
                        .label(semester.getName())
                        .build())
                .toList();

        UUID currentSemesterId = semesterOptions.isEmpty() ? null : semesterOptions.get(semesterOptions.size() - 1).getSemesterId();
        String semesterLabel = currentSemesterId == null ? null : semestersById.get(currentSemesterId).getName();
        return StudentPortalAcademicResultResponse.builder()
                .semesterLabel(semesterLabel)
                .cumulativeGpa(weightedGpa(grades))
                .semesterGpa(weightedGpa(grades.stream()
                        .filter(grade -> Objects.equals(currentSemesterId, grade.getSemesterId()))
                        .toList()))
                .accumulatedCredits(grades.stream()
                        .filter(grade -> "PASSED".equalsIgnoreCase(grade.getStatus()))
                        .map(StudentPortalGradeResponse::getCredits)
                        .filter(Objects::nonNull)
                        .mapToDouble(Double::doubleValue)
                        .sum())
                .programCredits(resolveProgramCredits(student))
                .semesters(semesterOptions)
                .grades(grades)
                .build();
    }

    private Student findStudent(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
    }

    private Student findCurrentStudent(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        return studentRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không phải sinh viên"));
    }

    private StudentPortalScheduleResponse toScheduleResponse(Schedule schedule) {
        CourseClass courseClass = schedule.getCourseClass();
        Course course = courseClass == null ? null : courseClass.getCourse();
        return StudentPortalScheduleResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .dayOfWeek(schedule.getDayOfWeek())
                .date(schedule.getDate())
                .startTime(schedule.getTimeSlot() == null ? null : schedule.getTimeSlot().getStartTime())
                .endTime(schedule.getTimeSlot() == null ? null : schedule.getTimeSlot().getEndTime())
                .courseCode(course == null ? null : course.getCode())
                .courseName(course == null ? null : course.getName())
                .classCode(courseClass == null ? null : courseClass.getClassCode())
                .roomCode(schedule.getRoom() == null ? null : schedule.getRoom().getCode())
                .instructorName(schedule.getInstructor() == null || schedule.getInstructor().getPerson() == null
                        ? null : schedule.getInstructor().getPerson().getFullName())
                .mode(schedule.getMode())
                .build();
    }

    private Map<UUID, Semester> loadSemesters(List<CourseRegistration> registrations) {
        Set<UUID> semesterIds = registrations.stream()
                .map(CourseRegistration::getCourseClass)
                .filter(Objects::nonNull)
                .map(CourseClass::getSemesterId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        return semesterRepository.findAllById(semesterIds).stream()
                .collect(Collectors.toMap(Semester::getSemesterId, Function.identity()));
    }

    private Map<UUID, CourseRegistration> latestRegistrationByCourse(
            List<CourseRegistration> registrations,
            Map<UUID, Semester> semestersById) {
        Map<UUID, CourseRegistration> registrationsByCourse = new HashMap<>();
        registrations.forEach(registration -> {
            CourseClass courseClass = registration.getCourseClass();
            if (courseClass == null || courseClass.getCourseId() == null) {
                return;
            }
            registrationsByCourse.merge(courseClass.getCourseId(), registration,
                    (current, candidate) -> compareRegistrationSemester(current, candidate, semestersById) >= 0 ? current : candidate);
        });
        return registrationsByCourse;
    }

    private int compareRegistrationSemester(CourseRegistration first, CourseRegistration second, Map<UUID, Semester> semestersById) {
        return Comparator.nullsFirst(Comparator.<java.time.LocalDate>naturalOrder())
                .compare(semesterStartDate(first.getCourseClass().getSemesterId(), semestersById),
                        semesterStartDate(second.getCourseClass().getSemesterId(), semestersById));
    }

    private java.time.LocalDate semesterStartDate(UUID semesterId, Map<UUID, Semester> semestersById) {
        Semester semester = semesterId == null ? null : semestersById.get(semesterId);
        return semester == null ? null : semester.getStartDate();
    }

    private StudentPortalGradeResponse toGradeResponse(
            StudentGrade grade,
            CourseRegistration registration,
            Map<UUID, Semester> semestersById) {
        Course course = grade.getCourse();
        UUID semesterId = registration == null ? null : registration.getCourseClass().getSemesterId();
        Semester semester = semesterId == null ? null : semestersById.get(semesterId);
        return StudentPortalGradeResponse.builder()
                .gradeId(grade.getGradeId())
                .semesterId(semesterId)
                .semesterLabel(semester == null ? "Chưa xác định học kỳ" : semester.getName())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .credits(course.getCredits())
                .finalScore(grade.getGrade())
                .gradePoint(toGradePoint(grade.getGrade()))
                .letterGrade(toLetterGrade(grade.getGrade()))
                .status(normalizeGradeStatus(grade))
                .build();
    }

    private Double weightedGpa(List<StudentPortalGradeResponse> grades) {
        double credits = grades.stream()
                .filter(grade -> grade.getGradePoint() != null && grade.getCredits() != null)
                .mapToDouble(StudentPortalGradeResponse::getCredits)
                .sum();
        if (credits == 0) {
            return 0D;
        }
        return grades.stream()
                .filter(grade -> grade.getGradePoint() != null && grade.getCredits() != null)
                .mapToDouble(grade -> grade.getGradePoint() * grade.getCredits())
                .sum() / credits;
    }

    private Integer resolveProgramCredits(Student student) {
        if (student.getTrainingProgramId() == null) {
            return 0;
        }
        return trainingProgramRepository.findById(student.getTrainingProgramId())
                .map(TrainingProgram::getTotalCredits)
                .orElse(0);
    }

    private String normalizeGradeStatus(StudentGrade grade) {
        if (StringUtils.hasText(grade.getStatus())) {
            return grade.getStatus().trim().toUpperCase();
        }
        if (grade.getGrade() == null) {
            return "IN_PROGRESS";
        }
        return grade.getGrade() >= 4D ? "PASSED" : "FAILED";
    }

    private Double toGradePoint(Double score) {
        if (score == null) {
            return null;
        }
        if (score >= 8.5D) return 4D;
        if (score >= 7D) return 3D;
        if (score >= 5.5D) return 2D;
        if (score >= 4D) return 1D;
        return 0D;
    }

    private String toLetterGrade(Double score) {
        if (score == null) {
            return "--";
        }
        if (score >= 8.5D) return "A";
        if (score >= 7D) return "B";
        if (score >= 5.5D) return "C";
        if (score >= 4D) return "D";
        return "F";
    }

    private void updatePersonForAdmin(Person person, StudentAdminUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            person.setFullName(request.getFullName().trim());
        }
        if (StringUtils.hasText(request.getFullNameNoAccent())) {
            person.setFullNameNoAccent(StringUtil.normalizeForAccountCode(request.getFullNameNoAccent()));
        } else if (StringUtils.hasText(request.getFullName())) {
            person.setFullNameNoAccent(StringUtil.getFirstNameNoAccent(request.getFullName()));
        }
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getPlaceOfBirth() != null) person.setPlaceOfBirth(request.getPlaceOfBirth());
        if (request.getEthnicity() != null) person.setEthnicity(request.getEthnicity());
        if (request.getPersonalIdentificationNumber() != null) person.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        if (request.getDateOfIssue() != null) person.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null) person.setCardPlace(request.getCardPlace());
        if (request.getNationality() != null) person.setNationality(request.getNationality());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getPermanentAddress() != null) person.setPermanentAddress(request.getPermanentAddress());
        if (request.getTemporaryAddress() != null) person.setTemporaryAddress(request.getTemporaryAddress());
        if (request.getAvatarUrl() != null) person.setAvatarUrl(request.getAvatarUrl());
    }

    private void updatePersonForSelf(Person person, StudentSelfUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            person.setFullName(request.getFullName().trim());
            person.setFullNameNoAccent(StringUtil.getFirstNameNoAccent(request.getFullName()));
        }
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getPlaceOfBirth() != null) person.setPlaceOfBirth(request.getPlaceOfBirth());
        if (request.getEthnicity() != null) person.setEthnicity(request.getEthnicity());
        if (request.getDateOfIssue() != null) person.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null) person.setCardPlace(request.getCardPlace());
        if (request.getNationality() != null) person.setNationality(request.getNationality());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getPermanentAddress() != null) person.setPermanentAddress(request.getPermanentAddress());
        if (request.getTemporaryAddress() != null) person.setTemporaryAddress(request.getTemporaryAddress());
        if (request.getAvatarUrl() != null) person.setAvatarUrl(request.getAvatarUrl());
    }

    private StudentAdminResponse toAdminResponse(Student student) {
        StudentAdminResponse response = studentMapper.toDto(student);
        response.setDepartmentId(resolveDepartmentId(student));
        return response;
    }

    private boolean academicSelectionChanged(StudentAdminUpdateRequest request) {
        return request.getDepartmentId() != null
                || request.getMajorId() != null
                || request.getSpecializationId() != null
                || request.getTrainingProgramId() != null
                || request.getAcademicCohortId() != null;
    }

    private UUID resolveDepartmentId(Student student) {
        if (student.getDepartmentId() != null) {
            return student.getDepartmentId();
        }
        if (student.getTrainingProgramId() != null) {
            UUID departmentId = trainingProgramRepository.findById(student.getTrainingProgramId())
                    .map(TrainingProgram::getDepartmentId)
                    .orElse(null);
            if (departmentId != null) {
                return departmentId;
            }
        }
        if (student.getMajorId() != null) {
            return majorRepository.findById(student.getMajorId())
                    .map(Major::getDepartmentId)
                    .orElse(null);
        }
        return null;
    }

    private void validateStudentProgramSelection(UUID departmentId, UUID majorId, UUID specializationId, UUID trainingProgramId, UUID academicCohortId) {
        if (departmentId == null) {
            throw new BusinessException("Khoa không được để trống");
        }
        if (academicCohortId == null) {
            throw new BusinessException("Khóa học không được để trống");
        }
        if (!departmentRepository.existsById(departmentId)) {
            throw new BusinessException("Khoa không tồn tại");
        }
        if (majorId != null) {
            Major major = majorRepository.findById(majorId)
                    .orElseThrow(() -> new BusinessException("Ngành không tồn tại"));
            if (!departmentId.equals(major.getDepartmentId())) {
                throw new BusinessException("Ngành không thuộc khoa đã chọn");
            }
        }
        if (specializationId != null) {
            if (majorId == null) {
                throw new BusinessException("Chuyên ngành phải thuộc một ngành cụ thể");
            }
            Specialization specialization = specializationRepository.findById(specializationId)
                    .orElseThrow(() -> new BusinessException("Chuyên ngành không tồn tại"));
            if (!departmentId.equals(specialization.getDepartmentId()) || !majorId.equals(specialization.getMajorId())) {
                throw new BusinessException("Chuyên ngành không thuộc khoa/ngành đã chọn");
            }
        }
        if (!academicCohortRepository.existsById(academicCohortId)) {
            throw new BusinessException("Khóa học không tồn tại");
        }
        if (trainingProgramId != null) {
            TrainingProgram trainingProgram = trainingProgramRepository.findById(trainingProgramId)
                    .orElseThrow(() -> new BusinessException("Chương trình đào tạo không tồn tại"));
            if (!departmentId.equals(trainingProgram.getDepartmentId())) {
                throw new BusinessException("Chương trình đào tạo không thuộc khoa đã chọn");
            }
            if (majorId != null && trainingProgram.getMajorId() != null && !majorId.equals(trainingProgram.getMajorId())) {
                throw new BusinessException("Chương trình đào tạo không thuộc ngành đã chọn");
            }
            if (specializationId != null && !specializationId.equals(trainingProgram.getSpecializationId())) {
                throw new BusinessException("Chương trình đào tạo không thuộc chuyên ngành đã chọn");
            }
            if (!academicCohortId.equals(trainingProgram.getAcademicCohortId())) {
                throw new BusinessException("Chương trình đào tạo không thuộc khóa học đã chọn");
            }
        }
    }
}
