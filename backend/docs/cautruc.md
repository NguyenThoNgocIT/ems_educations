# HỆ THỐNG QUẢN LÝ HOẠT ĐỘNG ĐÀO TẠO
## Cấu trúc dự án - Đồ án tốt nghiệp
src/main/java/com/university/training/
│
├── ┌─────────────────────────────────────────────────────────────────┐
│ │ 1. CORE / COMMON (Lõi hệ thống) │
│ └─────────────────────────────────────────────────────────────────┘
│ │
│ ├── common/
│ │ ├── config/
│ │ │ ├── SwaggerConfig.java # API Documentation
│ │ │ ├── SecurityConfig.java # Spring Security + JWT
│ │ │ ├── CorsConfig.java # CORS cho Web Admin & Client
│ │ │ ├── WebMvcConfig.java # Interceptor, Resource handlers
│ │ │ └── ModelMapperConfig.java # DTO mapping
│ │ │
│ │ ├── exception/
│ │ │ ├── BusinessException.java # Ngoại lệ nghiệp vụ
│ │ │ ├── ResourceNotFoundException.java # Không tìm thấy
│ │ │ ├── DuplicateException.java # Trùng dữ liệu
│ │ │ ├── ForbiddenException.java # Không có quyền
│ │ │ └── GlobalExceptionHandler.java # Xử lý toàn cục
│ │ │
│ │ ├── dto/
│ │ │ ├── request/ # Request DTOs
│ │ │ │ ├── PagingRequest.java
│ │ │ │ └── SearchRequest.java
│ │ │ ├── response/ # Response DTOs
│ │ │ │ ├── ApiResponse.java # Chuẩn trả về
│ │ │ │ ├── PageResponse.java
│ │ │ │ └── ErrorResponse.java
│ │ │ └── enums/ # Enums dùng chung
│ │ │ ├── Gender.java
│ │ │ ├── Status.java
│ │ │ └── RoleLevel.java
│ │ │
│ │ ├── util/
│ │ │ ├── DateTimeUtil.java
│ │ │ ├── SecurityUtil.java
│ │ │ ├── ExcelUtil.java # Import/Export Excel
│ │ │ └── PdfUtil.java # Xuất bảng điểm, văn bằng
│ │ │
│ │ └── constant/
│ │ ├── ApiConstants.java # API prefix, version
│ │ ├── CacheConstants.java
│ │ └── ErrorCodes.java
│ │
│ └── infrastructure/
│ │
│ ├── persistence/
│ │ ├── base/
│ │ │ ├── BaseEntity.java # id, createdAt, updatedAt
│ │ │ └── SoftDeleteEntity.java # extends BaseEntity + deletedAt, deletedBy
│ │ ├── audit/
│ │ │ ├── AuditorAwareImpl.java # Lấy user hiện tại cho audit
│ │ │ ├── AuditListener.java
│ │ │ └── EnableJpaAuditing.java
│ │ └── specification/
│ │ └── BaseSpecification.java # Query động
│ │
│ └── security/
│ ├── jwt/
│ │ ├── JwtTokenProvider.java # Tạo & validate token
│ │ ├── JwtAuthenticationFilter.java
│ │ └── JwtAuthenticationEntryPoint.java
│ ├── userdetails/
│ │ ├── CustomUserDetails.java # Implements UserDetails
│ │ └── CustomUserDetailsService.java
│ ├── annotation/
│ │ ├── HasPermission.java
│ │ ├── HasRole.java
│ │ └── PublicEndpoint.java
│ ├── service/
│ │ ├── PermissionEvaluatorService.java
│ │ └── SecurityService.java # Lấy user hiện tại, check role
│ └── interceptor/
│ └── PermissionInterceptor.java
│
├── ┌─────────────────────────────────────────────────────────────────┐
│ │ 2. MODULES (DOMAIN - Theo nghiệp vụ) │
│ └─────────────────────────────────────────────────────────────────┘
│ │
│ ├── auth/ # Xác thực & phân quyền
│ │ ├── controller/
│ │ │ ├── AuthController.java # /api/v1/auth/*
│ │ │ └── SessionController.java # /api/v1/sessions/*
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── LoginRequest.java
│ │ │ │ ├── RefreshTokenRequest.java
│ │ │ │ ├── ChangePasswordRequest.java
│ │ │ │ └── ForgotPasswordRequest.java
│ │ │ └── response/
│ │ │ ├── LoginResponse.java
│ │ │ └── SessionInfoResponse.java
│ │ ├── service/
│ │ │ ├── AuthService.java
│ │ │ ├── RefreshTokenService.java
│ │ │ └── LogoutService.java
│ │ └── validator/
│ │ └── LoginValidator.java
│ │
│ ├── user/ # Quản lý người dùng (Persons + Users)
│ │ ├── controller/
│ │ │ └── UserController.java # /api/v1/users
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateUserRequest.java
│ │ │ │ ├── UpdateUserRequest.java
│ │ │ │ └── ChangeUserStatusRequest.java
│ │ │ └── response/
│ │ │ ├── UserDetailResponse.java
│ │ │ ├── PersonInfoResponse.java
│ │ │ └── UserProfileResponse.java
│ │ ├── repository/
│ │ │ ├── PersonRepository.java
│ │ │ ├── UserRepository.java
│ │ │ └── UserRoleRepository.java
│ │ ├── service/
│ │ │ ├── UserService.java
│ │ │ ├── PersonService.java
│ │ │ └── UserProvisioningService.java # Tạo user từ student/lecturer
│ │ └── mapper/
│ │ └── UserMapper.java
│ │
│ ├── role/ # Vai trò & Quyền
│ │ ├── controller/
│ │ │ ├── RoleController.java # /api/v1/roles
│ │ │ └── PermissionController.java # /api/v1/permissions
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateRoleRequest.java
│ │ │ │ └── AssignPermissionRequest.java
│ │ │ └── response/
│ │ │ ├── RoleResponse.java
│ │ │ └── PermissionResponse.java
│ │ ├── repository/
│ │ │ ├── RoleRepository.java
│ │ │ ├── PermissionRepository.java
│ │ │ ├── RolePermissionRepository.java
│ │ │ ├── MenuRepository.java
│ │ │ └── PermissionApiRepository.java
│ │ ├── service/
│ │ │ ├── RoleService.java
│ │ │ ├── PermissionService.java
│ │ │ ├── MenuService.java # Tạo menu động
│ │ │ └── PermissionCacheService.java
│ │ └── scheduler/
│ │ └── PermissionCacheRefreshScheduler.java
│ │
│ ├── department/ # Đơn vị/Khoa/Bộ môn
│ │ ├── controller/
│ │ │ └── DepartmentController.java # /api/v1/departments
│ │ ├── dto/
│ │ │ ├── DepartmentDto.java
│ │ │ └── DepartmentTreeDto.java
│ │ ├── repository/
│ │ │ └── DepartmentRepository.java
│ │ └── service/
│ │ └── DepartmentService.java
│ │
│ ├── academic/ # Khung đào tạo (niên khóa, học kỳ)
│ │ ├── controller/
│ │ │ ├── AcademicCohortController.java # /api/v1/academic-cohorts
│ │ │ ├── SchoolYearController.java # /api/v1/school-years
│ │ │ └── SemesterController.java # /api/v1/semesters
│ │ ├── dto/
│ │ │ ├── AcademicCohortDto.java
│ │ │ ├── SchoolYearDto.java
│ │ │ └── SemesterDto.java
│ │ ├── repository/
│ │ │ ├── AcademicCohortRepository.java
│ │ │ ├── SchoolYearRepository.java
│ │ │ └── SemesterRepository.java
│ │ └── service/
│ │ ├── AcademicCohortService.java
│ │ ├── SchoolYearService.java
│ │ └── SemesterService.java
│ │
│ ├── major/ # Chuyên ngành
│ │ ├── controller/
│ │ │ └── MajorController.java # /api/v1/majors
│ │ ├── dto/
│ │ │ ├── MajorDto.java
│ │ │ └── MajorWithProgramsDto.java
│ │ ├── repository/
│ │ │ └── MajorRepository.java
│ │ └── service/
│ │ └── MajorService.java
│ │
│ ├── training-program/ # Chương trình đào tạo
│ │ ├── controller/
│ │ │ └── TrainingProgramController.java # /api/v1/training-programs
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateTrainingProgramRequest.java
│ │ │ │ └── AddCourseToProgramRequest.java
│ │ │ └── response/
│ │ │ ├── TrainingProgramResponse.java
│ │ │ └── TrainingProgramDetailResponse.java
│ │ ├── repository/
│ │ │ ├── TrainingProgramRepository.java
│ │ │ └── TrainingProgramCourseRepository.java
│ │ └── service/
│ │ ├── TrainingProgramService.java
│ │ └── TrainingCurriculumService.java
│ │
│ ├── course/ # Quản lý môn học
│ │ ├── controller/
│ │ │ ├── CourseController.java # /api/v1/courses
│ │ │ ├── CourseClassController.java # /api/v1/course-classes
│ │ │ └── PrerequisiteController.java # /api/v1/prerequisites
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateCourseRequest.java
│ │ │ │ ├── CreateCourseClassRequest.java
│ │ │ │ └── EquivalentCourseRequest.java
│ │ │ └── response/
│ │ │ ├── CourseResponse.java
│ │ │ ├── CourseClassResponse.java
│ │ │ └── CourseDetailResponse.java
│ │ ├── repository/
│ │ │ ├── CourseRepository.java
│ │ │ ├── CourseClassRepository.java
│ │ │ ├── CoursePrerequisiteRepository.java
│ │ │ └── EquivalentCourseRepository.java
│ │ ├── service/
│ │ │ ├── CourseService.java
│ │ │ ├── CourseClassService.java
│ │ │ ├── PrerequisiteValidationService.java
│ │ │ └── EquivalentCourseService.java
│ │ └── validator/
│ │ └── CourseClassCapacityValidator.java
│ │
│ ├── student/ # Quản lý sinh viên
│ │ ├── controller/
│ │ │ ├── StudentController.java # /api/v1/students
│ │ │ └── StudentStatusController.java # /api/v1/student-status
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateStudentRequest.java
│ │ │ │ ├── UpdateStudentStatusRequest.java
│ │ │ │ └── ImportStudentRequest.java
│ │ │ └── response/
│ │ │ ├── StudentProfileResponse.java
│ │ │ ├── StudentDetailResponse.java
│ │ │ └── StudentStatusHistoryResponse.java
│ │ ├── repository/
│ │ │ ├── StudentRepository.java
│ │ │ ├── StudentStatusCatalogRepository.java
│ │ │ └── StudentStatusHistoryRepository.java
│ │ ├── service/
│ │ │ ├── StudentService.java
│ │ │ ├── StudentImportService.java # Import từ Excel
│ │ │ ├── StudentStatusService.java
│ │ │ └── StudentIdGeneratorService.java
│ │ └── mapper/
│ │ └── StudentMapper.java
│ │
│ ├── lecturer/ # Quản lý giảng viên
│ │ ├── controller/
│ │ │ ├── LecturerController.java # /api/v1/lecturers
│ │ │ └── TeachingAssignmentController.java # /api/v1/teaching-assignments
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateLecturerRequest.java
│ │ │ │ └── AssignTeachingRequest.java
│ │ │ └── response/
│ │ │ ├── LecturerProfileResponse.java
│ │ │ └── TeachingAssignmentResponse.java
│ │ ├── repository/
│ │ │ ├── LecturerRepository.java
│ │ │ ├── InstructorRepository.java
│ │ │ ├── TeachingAssignmentRepository.java
│ │ │ └── DegreeRepository.java
│ │ └── service/
│ │ ├── LecturerService.java
│ │ ├── TeachingAssignmentService.java
│ │ └── LecturerWorkloadService.java # Tính khối lượng giảng dạy
│ │
│ ├── staff/ # Quản lý cán bộ/nhân viên
│ │ ├── controller/
│ │ │ ├── StaffController.java # /api/v1/staffs
│ │ │ ├── DivisionController.java # /api/v1/divisions
│ │ │ └── PositionController.java # /api/v1/positions
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ └── CreateStaffRequest.java
│ │ │ └── response/
│ │ │ ├── StaffProfileResponse.java
│ │ │ ├── DivisionResponse.java
│ │ │ └── PositionResponse.java
│ │ ├── repository/
│ │ │ ├── StaffRepository.java
│ │ │ ├── DivisionRepository.java
│ │ │ └── PositionRepository.java
│ │ └── service/
│ │ ├── StaffService.java
│ │ └── DivisionService.java
│ │
│ ├── class-management/ # Quản lý lớp học
│ │ ├── controller/
│ │ │ ├── ClassController.java # /api/v1/classes
│ │ │ └── StudentClassController.java # /api/v1/student-classes
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateClassRequest.java
│ │ │ │ └── AssignStudentToClassRequest.java
│ │ │ └── response/
│ │ │ ├── ClassResponse.java
│ │ │ └── ClassDetailResponse.java
│ │ ├── repository/
│ │ │ ├── ClassRepository.java
│ │ │ └── StudentClassRepository.java
│ │ └── service/
│ │ ├── ClassService.java
│ │ └── ClassAssignmentService.java
│ │
│ ├── registration/ # Đăng ký học (Quan trọng nhất)
│ │ ├── controller/
│ │ │ ├── RegistrationPeriodController.java # /api/v1/registration-periods
│ │ │ ├── RegistrationController.java # /api/v1/registrations (Client)
│ │ │ └── RegistrationAdminController.java # /api/v1/admin/registrations
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── RegisterCourseRequest.java
│ │ │ │ ├── DropCourseRequest.java
│ │ │ │ └── CreateRegistrationPeriodRequest.java
│ │ │ └── response/
│ │ │ ├── RegistrationResponse.java
│ │ │ ├── RegistrationSummaryResponse.java
│ │ │ ├── RegistrationPeriodResponse.java
│ │ │ └── EligibleCourseResponse.java # DS môn có thể đăng ký
│ │ ├── repository/
│ │ │ ├── CourseRegistrationRepository.java
│ │ │ ├── RegistrationPeriodRepository.java
│ │ │ └── RegistrationLogRepository.java
│ │ ├── service/
│ │ │ ├── RegistrationService.java
│ │ │ ├── RegistrationPeriodService.java
│ │ │ ├── RegistrationEligibilityService.java # Kiểm tra điều kiện
│ │ │ ├── PrerequisiteCheckService.java # Kiểm tra tiên quyết
│ │ │ ├── CreditLimitCheckService.java # Kiểm tra tín chỉ
│ │ │ ├── ScheduleConflictService.java # Kiểm tra trùng lịch
│ │ │ └── RegistrationLockService.java
│ │ ├── scheduler/
│ │ │ ├── RegistrationOpenScheduler.java
│ │ │ └── RegistrationAutoCloseScheduler.java
│ │ └── validator/
│ │ └── RegistrationValidator.java
│ │
│ ├── schedule/ # Xếp thời khóa biểu
│ │ ├── controller/
│ │ │ └── ScheduleController.java # /api/v1/schedules
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateScheduleRequest.java
│ │ │ │ └── TimetableRequest.java
│ │ │ └── response/
│ │ │ ├── ScheduleResponse.java
│ │ │ ├── TimetableResponse.java # Thời khóa biểu SV/GV
│ │ │ └── RoomScheduleResponse.java # Lịch phòng học
│ │ ├── repository/
│ │ │ ├── ScheduleRepository.java
│ │ │ ├── TimeSlotRepository.java
│ │ │ ├── RoomRepository.java
│ │ │ └── BuildingRepository.java
│ │ ├── service/
│ │ │ ├── ScheduleService.java
│ │ │ ├── TimetableService.java
│ │ │ ├── ScheduleConflictService.java
│ │ │ └── TimetableExportService.java # Xuất PDF/Excel
│ │ └── scheduler/
│ │ └── AutomaticScheduler.java # Tự động xếp TKB
│ │
│ ├── grade/ # Quản lý điểm số
│ │ ├── controller/
│ │ │ ├── GradeComponentController.java # /api/v1/grade-components (Admin)
│ │ │ ├── GradeController.java # /api/v1/grades (GV nhập điểm)
│ │ │ └── TranscriptController.java # /api/v1/transcripts (SV xem điểm)
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── GradeComponentRequest.java
│ │ │ │ ├── GradeEntryRequest.java # Nhập điểm chi tiết
│ │ │ │ └── GradeAppealRequest.java # Phúc khảo
│ │ │ └── response/
│ │ │ ├── GradeComponentResponse.java
│ │ │ ├── StudentGradeResponse.java
│ │ │ ├── TranscriptResponse.java
│ │ │ └── SemesterTranscriptResponse.java
│ │ ├── repository/
│ │ │ ├── GradeComponentRepository.java
│ │ │ ├── StudentGradeRepository.java
│ │ │ ├── StudentSummaryRepository.java
│ │ │ └── GradeScaleRepository.java
│ │ ├── service/
│ │ │ ├── GradeComponentService.java
│ │ │ ├── GradeEntryService.java
│ │ │ ├── GradeCalculationService.java # Tính điểm tổng kết
│ │ │ ├── TranscriptService.java
│ │ │ ├── GpaCalculationService.java # Tính GPA
│ │ │ └── GradeScaleService.java
│ │ └── scheduler/
│ │ └── GradeFinalizationScheduler.java # Chốt điểm cuối kỳ
│ │
│ ├── exam/ # Quản lý thi cử
│ │ ├── controller/
│ │ │ ├── ExamController.java # /api/v1/exams
│ │ │ ├── ExamScheduleController.java # /api/v1/exam-schedules
│ │ │ └── ExamResultController.java # /api/v1/exam-results
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateExamRequest.java
│ │ │ │ ├── AssignExamRoomRequest.java
│ │ │ │ └── EnterExamResultRequest.java
│ │ │ └── response/
│ │ │ ├── ExamResponse.java
│ │ │ ├── ExamScheduleResponse.java
│ │ │ └── ExamResultResponse.java
│ │ ├── repository/
│ │ │ ├── ExamRepository.java
│ │ │ ├── ExamTypeRepository.java
│ │ │ ├── ExamRoomRepository.java
│ │ │ ├── ExamRegistrationRepository.java
│ │ │ └── ExamResultRepository.java
│ │ └── service/
│ │ ├── ExamService.java
│ │ ├── ExamScheduleService.java
│ │ ├── ExamRegistrationService.java
│ │ ├── ExamResultService.java
│ │ └── ExamConflictService.java
│ │
│ ├── tuition/ # Học phí
│ │ ├── controller/
│ │ │ ├── TuitionFeeController.java # /api/v1/tuition-fees (Admin)
│ │ │ ├── StudentTuitionController.java # /api/v1/student-tuition
│ │ │ └── PaymentController.java # /api/v1/payments
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CalculateTuitionRequest.java
│ │ │ │ └── PaymentRequest.java
│ │ │ └── response/
│ │ │ ├── TuitionFeeResponse.java
│ │ │ ├── StudentTuitionResponse.java
│ │ │ ├── PaymentResponse.java
│ │ │ └── TuitionDebtResponse.java
│ │ ├── repository/
│ │ │ ├── TuitionFeeRepository.java
│ │ │ ├── StudentTuitionRepository.java
│ │ │ └── PaymentRepository.java
│ │ ├── service/
│ │ │ ├── TuitionFeeService.java
│ │ │ ├── TuitionCalculationService.java # Tính học phí theo tín chỉ
│ │ │ ├── StudentTuitionService.java
│ │ │ ├── PaymentService.java
│ │ │ └── TuitionDebtService.java
│ │ └── scheduler/
│ │ └── TuitionReminderScheduler.java # Nhắc nhở đóng học phí
│ │
│ ├── personnel/ # Nhân sự - Hợp đồng, lương
│ │ ├── controller/
│ │ │ ├── ContractController.java # /api/v1/contracts
│ │ │ ├── LeaveRequestController.java # /api/v1/leave-requests
│ │ │ └── AttendanceController.java # /api/v1/attendances
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CreateContractRequest.java
│ │ │ │ ├── LeaveRequestRequest.java
│ │ │ │ └── AttendanceRequest.java
│ │ │ └── response/
│ │ │ ├── ContractResponse.java
│ │ │ ├── LeaveRequestResponse.java
│ │ │ └── AttendanceResponse.java
│ │ ├── repository/
│ │ │ ├── ContractRepository.java
│ │ │ ├── EmployeeLeaveRequestRepository.java
│ │ │ └── EmployeeAttendanceRepository.java
│ │ └── service/
│ │ ├── ContractService.java
│ │ ├── LeaveRequestService.java
│ │ └── AttendanceService.java
│ │
│ ├── payroll/ # Tính lương
│ │ ├── controller/
│ │ │ └── PayrollController.java # /api/v1/payroll
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ └── SalaryCalculationRequest.java
│ │ │ └── response/
│ │ │ ├── SalaryResponse.java
│ │ │ ├── LecturerSalaryResponse.java # Lương GV theo giờ
│ │ │ └── StaffSalaryResponse.java # Lương CB theo tháng
│ │ ├── repository/
│ │ │ └── SalaryRepository.java
│ │ ├── service/
│ │ │ ├── SalaryCalculationService.java
│ │ │ ├── LecturerSalaryService.java # Lương GV: giờ dạy * đơn giá
│ │ │ ├── StaffSalaryService.java
│ │ │ └── PayrollExportService.java
│ │ └── scheduler/
│ │ └── MonthlyPayrollScheduler.java
│ │
│ ├── graduation/ # Quản lý tốt nghiệp
│ │ ├── controller/
│ │ │ ├── GraduationConditionController.java
│ │ │ ├── GraduationController.java
│ │ │ └── GraduationCouncilController.java
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── CheckGraduationRequest.java
│ │ │ │ └── GraduationDecisionRequest.java
│ │ │ └── response/
│ │ │ ├── GraduationConditionResponse.java
│ │ │ ├── GraduationCheckResponse.java
│ │ │ ├── GraduationResultResponse.java
│ │ │ └── DegreeEligibilityResponse.java
│ │ ├── repository/
│ │ │ ├── GraduationConditionRepository.java
│ │ │ ├── GraduationSessionRepository.java
│ │ │ ├── GraduationCouncilRepository.java
│ │ │ ├── GraduationResultRepository.java
│ │ │ └── GraduationProfileRepository.java
│ │ ├── service/
│ │ │ ├── GraduationConditionService.java
│ │ │ ├── GraduationCheckService.java # Kiểm tra điều kiện TN
│ │ │ ├── GraduationService.java
│ │ │ ├── GraduationCouncilService.java
│ │ │ ├── DegreeService.java
│ │ │ └── DiplomaExportService.java # Xuất bằng tốt nghiệp
│ │ └── scheduler/
│ │ └── GraduationAutoCheckScheduler.java
│ │
│ ├── notification/ # Thông báo
│ │ ├── controller/
│ │ │ └── NotificationController.java # /api/v1/notifications
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── SendNotificationRequest.java
│ │ │ │ └── MarkReadRequest.java
│ │ │ └── response/
│ │ │ ├── NotificationResponse.java
│ │ │ └── UnreadCountResponse.java
│ │ ├── repository/
│ │ │ ├── NotificationRepository.java
│ │ │ └── UserNotificationRepository.java
│ │ ├── service/
│ │ │ ├── NotificationService.java
│ │ │ ├── EmailService.java # Gửi email
│ │ │ ├── PushNotificationService.java # Gửi realtime (WebSocket)
│ │ │ └── NotificationTemplateService.java
│ │ └── websocket/
│ │ ├── WebSocketConfig.java
│ │ └── NotificationWebSocketHandler.java
│ │
│ ├── dashboard/ # Dashboard & Thống kê
│ │ ├── controller/
│ │ │ └── DashboardController.java # /api/v1/dashboard
│ │ ├── dto/
│ │ │ ├── StatisticsDto.java
│ │ │ ├── EnrollmentStatsDto.java
│ │ │ ├── RevenueStatsDto.java
│ │ │ └── LecturerWorkloadStatsDto.java
│ │ └── service/
│ │ ├── DashboardService.java
│ │ ├── StatisticsService.java
│ │ └── ChartDataService.java
│ │
│ ├── report/ # Báo cáo tổng hợp
│ │ ├── controller/
│ │ │ └── ReportController.java # /api/v1/reports
│ │ ├── dto/
│ │ │ ├── request/
│ │ │ │ ├── EnrollmentReportRequest.java
│ │ │ │ ├── GradeReportRequest.java
│ │ │ │ └── FinancialReportRequest.java
│ │ │ └── response/
│ │ │ ├── EnrollmentReportDto.java
│ │ │ ├── GradeDistributionDto.java
│ │ │ ├── TuitionReportDto.java
│ │ │ └── GraduationReportDto.java
│ │ └── service/
│ │ ├── ReportService.java
│ │ ├── ReportExportService.java # Xuất Excel/PDF
│ │ ├── EnrollmentReportService.java
│ │ ├── GradeReportService.java
│ │ └── FinancialReportService.java
│ │
│ └── audit/ # Lịch sử & Log
│ ├── controller/
│ │ └── AuditController.java # /api/v1/audit-logs
│ ├── dto/
│ │ └── AuditLogResponse.java
│ ├── repository/
│ │ └── LogRepository.java
│ └── service/
│ ├── AuditService.java # Ghi log tự động
│ └── LogCleanupScheduler.java
│
├── ┌─────────────────────────────────────────────────────────────────┐
│ │ 3. APPLICATION (Main) │
│ └─────────────────────────────────────────────────────────────────┘
│ │
│ └── TrainingManagementApplication.java
│
└── resources/
│
├── application.yml
├── application-dev.yml
├── application-prod.yml
├── application-test.yml
│
├── db/
│ ├── migration/ # Flyway migration scripts
│ │ ├── V1__init_schema.sql
│ │ ├── V2__insert_master_data.sql
│ │ └── V3__add_indexes.sql
│ └── seed/
│ ├── roles_data.sql
│ ├── permissions_data.sql
│ ├── menus_data.sql
│ └── test_data.sql
│
├── templates/
│ ├── email/
│ │ ├── welcome-email.html
│ │ ├── forgot-password.html
│ │ ├── registration-approval.html
│ │