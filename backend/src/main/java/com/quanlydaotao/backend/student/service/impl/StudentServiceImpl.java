package com.quanlydaotao.backend.student.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import com.quanlydaotao.backend.registrationperiod.repository.RegistrationPeriodRepository;
import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.grade.entity.StudentSummary;
import com.quanlydaotao.backend.grade.repository.StudentSummaryRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalAnnouncementResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalAcademicResultResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalDocumentResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalExamResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalGradeResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalRegistrationResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalScheduleResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalSemesterResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalSupportRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalSupportRequestResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalTuitionResponse;
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

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final StudentSummaryRepository studentSummaryRepository;
    private final ScheduleRepository scheduleRepository;
    private final SemesterRepository semesterRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final StudentMapper studentMapper;
    private final StudentClassService studentClassService;
    private final StudentStatusHistoryService studentStatusHistoryService;
    private final TeachingSessionOverrideRepository overrideRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final EmployeeRepository employeeRepository;
    private final CourseClassRepository courseClassRepository;

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

    private boolean isSessionCancelled(UUID scheduleId, LocalDate date, List<TeachingSessionOverride> overrides) {
        return overrides.stream()
                .anyMatch(override -> "CANCELLED".equals(override.getOverrideType())
                        && Objects.equals(override.getOriginalScheduleId(), scheduleId)
                        && (override.getOriginalDate() == null || Objects.equals(override.getOriginalDate(), date)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalScheduleResponse> getCurrentStudentSchedule(String username) {
        Student student = findCurrentStudent(username);
        Map<String, StudentPortalScheduleResponse> schedulesMap = new LinkedHashMap<>();

        List<CourseClass> courseClasses = courseRegistrationRepository.findByStudentIdAndIsActiveTrue(student.getStudentId()).stream()
                .map(CourseRegistration::getCourseClass)
                .filter(Objects::nonNull)
                .toList();
                
        List<UUID> courseClassIds = courseClasses.stream().map(CourseClass::getCourseClassId).toList();
        
        List<TeachingSessionOverride> overrides = courseClassIds.isEmpty() ? List.of() : 
            overrideRepository.findByCourseClassIdInAndIsActiveTrue(courseClassIds);

        courseClasses.forEach(courseClass -> scheduleRepository.findByCourseClassCourseClassId(courseClass.getCourseClassId())
                .stream()
                .filter(schedule -> Boolean.TRUE.equals(schedule.getIsActive()))
                .forEach(schedule -> {
                    if (schedule.getDate() != null) {
                        LocalDate date = schedule.getDate();
                        boolean isCancelled = isSessionCancelled(schedule.getScheduleId(), date, overrides);
                        String key = schedule.getScheduleId() + "_" + date;
                        schedulesMap.putIfAbsent(key, toScheduleResponse(schedule, date, isCancelled));
                    } else {
                        Semester semester = semesterRepository.findById(schedule.getSemesterId()).orElse(null);
                        if (semester != null) {
                            LocalDate recStart = schedule.getCourseClass().getStartDate() != null ? schedule.getCourseClass().getStartDate() : semester.getStartDate();
                            LocalDate recEnd = schedule.getCourseClass().getEndDate() != null ? schedule.getCourseClass().getEndDate() : semester.getEndDate();
                            if (recStart != null && recEnd != null) {
                                for (LocalDate date = recStart; !date.isAfter(recEnd); date = date.plusDays(1)) {
                                    if (date.getDayOfWeek().getValue() == schedule.getDayOfWeek()) {
                                        boolean isCancelled = isSessionCancelled(schedule.getScheduleId(), date, overrides);
                                        String key = schedule.getScheduleId() + "_" + date;
                                        schedulesMap.putIfAbsent(key, toScheduleResponse(schedule, date, isCancelled));
                                    }
                                }
                            }
                        }
                    }
                }));
                
        overrides.stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsVisible()))
                .forEach(o -> schedulesMap.putIfAbsent(o.getOverrideId().toString(), toScheduleResponse(o)));

        return schedulesMap.values().stream()
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
        Map<UUID, Semester> semestersById = loadSemesters(registrations);
        List<StudentSummary> summaries = studentSummaryRepository.findFinalizedByStudent(student.getStudentId());

        List<StudentPortalGradeResponse> grades = summaries.stream()
                .filter(summary -> summary.getCourseRegistration() != null && summary.getCourseRegistration().getCourseClass() != null)
                .map(summary -> toGradeResponse(summary, semestersById))
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

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalAnnouncementResponse> getCurrentStudentAnnouncements(String username) {
        findCurrentStudent(username);
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalDocumentResponse> getCurrentStudentDocuments(String username) {
        findCurrentStudent(username);
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPortalTuitionResponse getCurrentStudentTuition(String username) {
        Student student = findCurrentStudent(username);
        List<CourseRegistration> registrations = courseRegistrationRepository.findByStudentIdAndIsActiveTrue(student.getStudentId());
        double registeredCredits = registrations.stream()
                .map(CourseRegistration::getCourseClass)
                .filter(Objects::nonNull)
                .map(CourseClass::getCourse)
                .filter(Objects::nonNull)
                .map(Course::getCredits)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();
        int unpaidRegistrations = (int) registrations.stream()
                .filter(registration -> !Boolean.TRUE.equals(registration.getIsPaid()))
                .count();

        return StudentPortalTuitionResponse.builder()
                .totalAmount(BigDecimal.ZERO)
                .paidAmount(BigDecimal.ZERO)
                .remainingAmount(BigDecimal.ZERO)
                .registeredCredits(registeredCredits)
                .unpaidRegistrations(unpaidRegistrations)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalRegistrationResponse> getCurrentStudentRegistrations(String username) {
        Student student = findCurrentStudent(username);
        List<CourseRegistration> registrations = courseRegistrationRepository.findByStudentIdAndIsActiveTrue(student.getStudentId());
        Map<UUID, Semester> semestersById = loadSemesters(registrations);
        Set<UUID> registrationPeriodIds = registrations.stream()
                .map(CourseRegistration::getRegistrationPeriodId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<UUID, RegistrationPeriod> periodsById = registrationPeriodRepository.findAllById(registrationPeriodIds).stream()
                .collect(Collectors.toMap(RegistrationPeriod::getRegistrationPeriodId, Function.identity()));

        return registrations.stream()
                .map(registration -> toRegistrationResponse(registration, semestersById, periodsById))
                .sorted(Comparator.comparing(StudentPortalRegistrationResponse::getRegisteredAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalExamResponse> getCurrentStudentExams(String username) {
        findCurrentStudent(username);
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentPortalSupportRequestResponse> getCurrentStudentSupportRequests(String username) {
        findCurrentStudent(username);
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPortalSupportRequestResponse createCurrentStudentSupportRequest(String username, StudentPortalSupportRequest request) {
        findCurrentStudent(username);
        return StudentPortalSupportRequestResponse.builder()
                .id(UUID.randomUUID())
                .title(request == null ? null : request.getTitle())
                .content(request == null ? null : request.getContent())
                .status("RECEIVED")
                .createdAt(LocalDateTime.now())
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

    private StudentPortalScheduleResponse toScheduleResponse(Schedule schedule, LocalDate date, boolean isCancelled) {
        CourseClass courseClass = schedule.getCourseClass();
        Course course = courseClass == null ? null : courseClass.getCourse();
        return StudentPortalScheduleResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .dayOfWeek(schedule.getDayOfWeek())
                .date(date != null ? date : schedule.getDate())
                .startTime(schedule.getTimeSlot() == null ? null : schedule.getTimeSlot().getStartTime())
                .endTime(schedule.getTimeSlot() == null ? null : schedule.getTimeSlot().getEndTime())
                .courseCode(course == null ? null : course.getCode())
                .courseName(course == null ? null : course.getName())
                .classCode(courseClass == null ? null : courseClass.getClassCode())
                .roomCode(schedule.getRoom() == null ? null : schedule.getRoom().getCode())
                .instructorName(schedule.getInstructor() == null || schedule.getInstructor().getPerson() == null
                        ? null : schedule.getInstructor().getPerson().getFullName())
                .mode(schedule.getMode())
                .isCancelled(isCancelled)
                .build();
    }

    private StudentPortalScheduleResponse toScheduleResponse(TeachingSessionOverride override) {
        CourseClass courseClass = courseClassRepository.findById(override.getCourseClassId()).orElse(null); 
        Course course = courseClass == null ? null : courseClass.getCourse();
        TimeSlot timeSlot = override.getTimeSlotId() != null ? timeSlotRepository.findById(override.getTimeSlotId()).orElse(null) : null;
        Room room = override.getRoomId() != null ? roomRepository.findById(override.getRoomId()).orElse(null) : null;
        Employee employee = override.getInstructorId() != null ? employeeRepository.findById(override.getInstructorId()).orElse(null) : null;
        
        Integer dayOfWeek = override.getTeachingDate() != null ? override.getTeachingDate().getDayOfWeek().getValue() : null;

        return StudentPortalScheduleResponse.builder()
                .scheduleId(override.getOverrideId())
                .dayOfWeek(dayOfWeek)
                .date(override.getTeachingDate())
                .startTime(timeSlot == null ? null : timeSlot.getStartTime())
                .endTime(timeSlot == null ? null : timeSlot.getEndTime())
                .courseCode(course == null ? null : course.getCode())
                .courseName(course == null ? null : course.getName())
                .classCode(courseClass == null ? null : courseClass.getClassCode())
                .roomCode(room == null ? null : room.getCode())
                .instructorName(employee == null || employee.getPerson() == null ? null : employee.getPerson().getFullName())
                .mode(courseClass == null ? null : "LT")
                .overrideType(override.getOverrideType())
                .isCancelled(false)
                .build();
    }

    private StudentPortalRegistrationResponse toRegistrationResponse(
            CourseRegistration registration,
            Map<UUID, Semester> semestersById,
            Map<UUID, RegistrationPeriod> periodsById) {
        CourseClass courseClass = registration.getCourseClass();
        Course course = courseClass == null ? null : courseClass.getCourse();
        Semester semester = courseClass == null ? null : semestersById.get(courseClass.getSemesterId());
        RegistrationPeriod period = registration.getRegistrationPeriodId() == null
                ? null
                : periodsById.get(registration.getRegistrationPeriodId());

        return StudentPortalRegistrationResponse.builder()
                .registrationId(registration.getCourseRegistrationId())
                .courseClassId(registration.getCourseClassId())
                .courseCode(course == null ? null : course.getCode())
                .courseName(course == null ? null : course.getName())
                .classCode(courseClass == null ? null : courseClass.getClassCode())
                .credits(course == null ? null : course.getCredits())
                .semesterLabel(semester == null ? null : semester.getName())
                .registrationPeriodName(period == null ? null : period.getName())
                .registeredAt(registration.getRegisteredAt())
                .status(registration.getStatus())
                .paid(registration.getIsPaid())
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
            StudentSummary summary,
            Map<UUID, Semester> semestersById) {
        CourseRegistration registration = summary.getCourseRegistration();
        Course course = registration.getCourseClass().getCourse();
        UUID semesterId = registration.getCourseClass().getSemesterId();
        Semester semester = semesterId == null ? null : semestersById.get(semesterId);
        return StudentPortalGradeResponse.builder()
                .gradeId(summary.getCourseRegistrationId())
                .semesterId(semesterId)
                .semesterLabel(semester == null ? "Chưa xác định học kỳ" : semester.getName())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .credits(course.getCredits())
                .finalScore(summary.getTotalScore() == null ? null : summary.getTotalScore().doubleValue())
                .gradePoint(summary.getGpaValue() == null ? null : summary.getGpaValue().doubleValue())
                .letterGrade(summary.getLetterGrade())
                .status(summary.getResult())
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
