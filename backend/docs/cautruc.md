src/main/java/com/yourcompany/training/
│
├── ┌─────────────────────────────────────────────────────────────────┐
│   │                    1. CORE / COMMON                             │
│   └─────────────────────────────────────────────────────────────────┘
│   │
│   ├── common/
│   │   ├── config/
│   │   │   ├── SwaggerConfig.java
│   │   │   ├── AuditConfig.java (cho JPA auditing)
│   │   │   ├── SecurityConfig.java (WebSecurityConfig cũ)
│   │   │   └── CorsConfig.java
│   │   ├── exception/
│   │   │   ├── BusinessException.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── dto/
│   │   │   ├── ApiResponse.java (chuẩn trả về)
│   │   │   ├── PageResponse.java
│   │   │   └── ErrorResponse.java
│   │   ├── util/
│   │   │   ├── DateTimeUtil.java
│   │   │   └── ValidationUtil.java
│   │   └── annotation/
│   │       ├── CurrentUser.java
│   │       └── ValidatePermission.java
│   │
│   └── infrastructure/
│       ├── persistence/
│       │   ├── base/
│       │   │   ├── BaseEntity.java (id, created_at, updated_at)
│       │   │   └── SoftDeleteEntity.java (extend BaseEntity + deleted_at)
│       │   └── audit/
│       │       ├── AuditorAwareImpl.java
│       │       └── AuditListener.java
│       └── security/
│           ├── jwt/
│           │   ├── JwtTokenProvider.java
│           │   ├── JwtAuthenticationFilter.java
│           │   ├── JwtAuthenticationEntryPoint.java
│           │   └── JwtTokenFilterConfigurer.java
│           ├── userdetails/
│           │   ├── CustomUserDetails.java
│           │   └── CustomUserDetailsService.java
│           ├── annotation/
│           │   ├── HasPermission.java
│           │   └── HasRole.java
│           └── service/
│               ├── PermissionEvaluatorService.java
│               └── SecurityService.java
│
├── ┌─────────────────────────────────────────────────────────────────┐
│   │                    2. MODULES (DOMAIN)                          │
│   └─────────────────────────────────────────────────────────────────┘
│   │
│   ├── auth/ (xác thực)
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   ├── ChangePasswordRequest.java
│   │   │   └── ForgotPasswordRequest.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       └── RefreshTokenService.java
│   │
│   ├── user/ (quản lý người dùng - persons + users)
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   ├── dto/
│   │   │   ├── PersonDto.java
│   │   │   ├── UserDto.java
│   │   │   └── UserResponseDto.java
│   │   ├── repository/
│   │   │   ├── PersonRepository.java
│   │   │   └── UserRepository.java
│   │   ├── service/
│   │   │   ├── PersonService.java
│   │   │   ├── UserService.java
│   │   │   └── AccountProvisioningService.java
│   │   ├── mapper/
│   │   │   └── UserMapper.java (MapStruct)
│   │   └── validator/
│   │       └── UniqueUsernameValidator.java
│   │
│   ├── role/ (phân quyền)
│   │   ├── controller/
│   │   │   └── RoleController.java
│   │   ├── dto/
│   │   │   ├── RoleDto.java
│   │   │   └── PermissionDto.java
│   │   ├── repository/
│   │   │   ├── RoleRepository.java
│   │   │   ├── PermissionRepository.java
│   │   │   └── UserRoleRepository.java
│   │   └── service/
│   │       ├── RoleService.java
│   │       └── PermissionService.java
│   │
│   ├── student/ (quản lý sinh viên)
│   │   ├── controller/
│   │   │   └── StudentController.java
│   │   ├── dto/
│   │   │   ├── StudentProfileDto.java
│   │   │   ├── StudentCreateRequest.java
│   │   │   └── StudentImportDto.java
│   │   ├── repository/
│   │   │   └── StudentProfileRepository.java
│   │   ├── service/
│   │   │   ├── StudentService.java
│   │   │   └── StudentImportService.java
│   │   └── mapper/
│   │       └── StudentMapper.java
│   │
│   ├── lecturer/ (quản lý giảng viên)
│   │   ├── controller/
│   │   │   └── LecturerController.java
│   │   ├── dto/
│   │   │   ├── LecturerProfileDto.java
│   │   │   └── LecturerCreateRequest.java
│   │   ├── repository/
│   │   │   ├── LecturerProfileRepository.java
│   │   │   └── TeachingAssignmentRepository.java
│   │   └── service/
│   │       ├── LecturerService.java
│   │       └── TeachingAssignmentService.java
│   │
│   ├── course/ (quản lý môn học - courses)
│   │   ├── controller/
│   │   │   └── CourseController.java
│   │   ├── dto/
│   │   │   ├── CourseDto.java
│   │   │   ├── CourseClassDto.java
│   │   │   └── PrerequisiteDto.java
│   │   ├── repository/
│   │   │   ├── CourseRepository.java
│   │   │   ├── CourseClassRepository.java
│   │   │   └── PrerequisiteRepository.java
│   │   └── service/
│   │       ├── CourseService.java
│   │       └── CourseClassService.java
│   │
│   ├── registration/ (đăng ký học)
│   │   ├── controller/
│   │   │   └── RegistrationController.java
│   │   ├── dto/
│   │   │   ├── RegistrationRequest.java
│   │   │   ├── RegistrationDto.java
│   │   │   └── RegistrationPeriodDto.java
│   │   ├── repository/
│   │   │   ├── CourseRegistrationRepository.java
│   │   │   └── RegistrationPeriodRepository.java
│   │   ├── service/
│   │   │   ├── RegistrationService.java
│   │   │   ├── RegistrationValidator.java
│   │   │   └── RegistrationPeriodService.java
│   │   └── scheduler/
│   │       └── RegistrationAutoCloseScheduler.java
│   │
│   ├── grade/ (quản lý điểm)
│   │   ├── controller/
│   │   │   └── GradeController.java
│   │   ├── dto/
│   │   │   ├── GradeEntryDto.java
│   │   │   ├── GradeComponentDto.java
│   │   │   └── TranscriptDto.java
│   │   ├── repository/
│   │   │   ├── StudentGradeRepository.java
│   │   │   └── GradeComponentRepository.java
│   │   └── service/
│   │       ├── GradeService.java
│   │       ├── GradeCalculationService.java
│   │       └── TranscriptService.java
│   │
│   ├── tuition/ (học phí)
│   │   ├── controller/
│   │   │   └── TuitionController.java
│   │   ├── dto/
│   │   │   ├── TuitionFeeDto.java
│   │   │   ├── StudentTuitionDto.java
│   │   │   └── PaymentDto.java
│   │   ├── repository/
│   │   │   ├── StudentTuitionRepository.java
│   │   │   └── PaymentRepository.java
│   │   └── service/
│   │       ├── TuitionService.java
│   │       └── PaymentService.java
│   │
│   ├── payroll/ (lương - cho giảng viên + nhân sự)
│   │   ├── controller/
│   │   │   └── PayrollController.java
│   │   ├── dto/
│   │   │   ├── ContractDto.java
│   │   │   ├── AttendanceDto.java
│   │   │   └── SalaryCalculationDto.java
│   │   ├── repository/
│   │   │   ├── ContractRepository.java
│   │   │   ├── AttendanceRepository.java
│   │   │   └── SalaryCalculationRepository.java
│   │   └── service/
│   │       ├── ContractService.java
│   │       ├── AttendanceService.java
│   │       ├── SalaryCalculationService.java
│   │       └── scheduler/
│   │           └── MonthlySalaryScheduler.java
│   │
│   ├── graduation/ (tốt nghiệp)
│   │   ├── controller/
│   │   │   └── GraduationController.java
│   │   ├── dto/
│   │   │   ├── GraduationConditionDto.java
│   │   │   └── GraduationResultDto.java
│   │   ├── repository/
│   │   │   ├── GraduationConditionRepository.java
│   │   │   └── GraduationResultRepository.java
│   │   └── service/
│   │       ├── GraduationService.java
│   │       └── GraduationEvaluator.java
│   │
│   ├── notification/ (thông báo)
│   │   ├── controller/
│   │   │   └── NotificationController.java
│   │   ├── dto/
│   │   │   └── NotificationDto.java
│   │   ├── repository/
│   │   │   └── NotificationRepository.java
│   │   └── service/
│   │       ├── NotificationService.java
│   │       └── EmailService.java
│   │
│   └── report/ (báo cáo thống kê)
│       ├── controller/
│       │   └── ReportController.java
│       ├── dto/
│       │   ├── EnrollmentReportDto.java
│       │   └── SalaryReportDto.java
│       └── service/
│           ├── ReportService.java
│           └── ExcelExportService.java
│
├── ┌─────────────────────────────────────────────────────────────────┐
│   │                    3. APPLICATION                               │
│   └─────────────────────────────────────────────────────────────────┘
│   │
│   └── TrainingManagementApplication.java (main)
│
└── resources/
├── application.yml
├── application-dev.yml
├── application-prod.yml
├── db/
│   ├── migration/ (Flyway/Liquibase scripts)
│   └── seed/
└── templates/
└── email/
├── welcome.html
└── forgot-password.html