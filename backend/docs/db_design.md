Users/Role/Permission
1) Bảng Users (tài khoản)
   Unique:
   UQ_Users_Username (bắt buộc)
   UQ_Users_Email (nếu email dùng đăng nhập/không cho trùng)
   Index:
   IX_Users_IsActive
   IX_Users_LastLoginAt
   --
   TABLE: Persons là bảng cha của student, nhân sự và giảng viên
- PersonId           UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())

- FullName           NVARCHAR(150)         NOT NULL
- Gender             NVARCHAR(20)          NULL
- DateOfBirth        DATE                  NULL
- PlaceOfBirth       NVARCHAR(150)         NULL
- Ethnicity          NVARCHAR(100)         NULL
- Nationality        NVARCHAR(100)         NULL

- ContactEmail       NVARCHAR(150)         NULL      -- email liên hệ (không phải login)
- PhoneNumber        NVARCHAR(20)          NULL
- PermanentAddress   NVARCHAR(255)         NULL
- TemporaryAddress   NVARCHAR(255)         NULL

- AvatarUrl          NVARCHAR(255)         NULL
- Note               NVARCHAR(255)         NULL
- IsActive           BIT                   NOT NULL DEFAULT(1)

- CreatedAt          DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy          UNIQUEIDENTIFIER      NULL
- UpdatedAt          DATETIME2(3)          NULL
- UpdatedBy          UNIQUEIDENTIFIER      NULL
- DeletedAt          DATETIME2(3)          NULL
- DeletedBy          UNIQUEIDENTIFIER      NULL

INDEX (optional):
- IX_Persons_FullName(FullName)
- IX_Persons_PhoneNumber(PhoneNumber)

TABLE: Users account
- UserId               UNIQUEIDENTIFIER  PK  NOT NULL  DEFAULT (NEWID())                 -- định danh tài khoản
- PersonId         UNIQUEIDENTIFIER FK NOT NULL REFERENCES Persons(PersonId)
- Username             NVARCHAR(50)       UQ  NOT NULL                                    -- duy nhất
- PasswordHash         NVARCHAR(255)          NOT NULL
- Email                NVARCHAR(150)      UQ  NULL                                        -- tùy policy, có thể NOT NULL
- LastLoginAt          DATETIME2(3)           NULL
- AccessFailedCount    INT                    NOT NULL DEFAULT(0)
- LockoutEndAt         DATETIME2(3)           NULL                                        -- thay cho is_locked + lock_reason dạng cứng
- LockReason           NVARCHAR(255)          NULL
- IsActive             BIT                    NOT NULL DEFAULT(1)

-- Audit (khuyến nghị giữ)
- CreatedAt            DATETIME2(3)           NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy            UNIQUEIDENTIFIER       NULL
- UpdatedAt            DATETIME2(3)           NULL
- UpdatedBy            UNIQUEIDENTIFIER       NULL
- DeletedAt            DATETIME2(3)           NULL
- DeletedBy            UNIQUEIDENTIFIER       NULL

CONSTRAINTS / INDEX:
- PK_Users(UserId)
- UQ_Users_Username(Username)
- UQ_Users_Email(Email)  -- nếu áp dụng
- IX_Users_IsActive(IsActive)
- IX_Users_LastLoginAt(LastLoginAt)
- UQ_Users_PersonId UNIQUE(PersonId)  -- 1 person tối đa 1 account
2) Roles
   TABLE: Roles
- RoleId          UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- Code            NVARCHAR(50)      UQ  NOT NULL                      -- ADMIN, GIAOVU...
- Name            NVARCHAR(100)         NOT NULL
- Description     NVARCHAR(255)         NULL
- Level           INT                   NULL
- IsSystem        BIT                   NOT NULL DEFAULT(0)
- DisplayOrder    INT                   NULL
- Color           NVARCHAR(20)          NULL
- IsActive        BIT                   NOT NULL DEFAULT(1)

- CreatedAt       DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy       UNIQUEIDENTIFIER      NULL
- UpdatedAt       DATETIME2(3)          NULL
- UpdatedBy       UNIQUEIDENTIFIER      NULL
- DeletedAt       DATETIME2(3)          NULL
- DeletedBy       UNIQUEIDENTIFIER      NULL

CONSTRAINTS / INDEX:
- PK_Roles(RoleId)
- UQ_Roles_Code(Code)
- IX_Roles_IsActive(IsActive)
3) Permissions
   TABLE: Permissions
- PermissionId    UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- Code            NVARCHAR(100)     UQ  NOT NULL                     -- USER_CREATE...
- Name            NVARCHAR(150)         NOT NULL
- Description     NVARCHAR(255)         NULL
- Module          NVARCHAR(50)          NULL
- ApiPath         NVARCHAR(255)         NULL
- HttpMethod      NVARCHAR(10)          NULL
- Screen          NVARCHAR(100)         NULL
- IsMenu          BIT                   NOT NULL DEFAULT(0)
- OrderIndex      INT                   NULL
- IsActive        BIT                   NOT NULL DEFAULT(1)

- CreatedAt       DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy       UNIQUEIDENTIFIER      NULL
- UpdatedAt       DATETIME2(3)          NULL
- UpdatedBy       UNIQUEIDENTIFIER      NULL
- DeletedAt       DATETIME2(3)          NULL
- DeletedBy       UNIQUEIDENTIFIER      NULL

CONSTRAINTS / INDEX:
- PK_Permissions(PermissionId)
- UQ_Permissions_Code(Code)
- IX_Permissions_Module(Module)
4) UserRoles (mapping)
   Đổi sang PK ghép, bỏ id. Thêm unique chính là PK.
   TABLE: UserRoles
- UserId       UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Users(UserId)
- RoleId       UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Roles(RoleId)
- CreatedAt    DATETIME2(3)              NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy    UNIQUEIDENTIFIER          NULL
- IsActive     BIT                       NOT NULL DEFAULT(1)

CONSTRAINTS / INDEX:
- PK_UserRoles(UserId, RoleId)
- IX_UserRoles_RoleId(RoleId)
5) RolePermissions (mapping)
   TABLE: RolePermissions
- RoleId        UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Roles(RoleId)
- PermissionId  UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Permissions(PermissionId)
- CreatedAt     DATETIME2(3)              NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy     UNIQUEIDENTIFIER          NULL
- IsActive      BIT                       NOT NULL DEFAULT(1)

CONSTRAINTS / INDEX:
- PK_RolePermissions(RoleId, PermissionId)
- IX_RolePermissions_PermissionId(PermissionId)
1) Students
   TABLE: Students
- StudentId          UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- PersonId           UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Persons(PersonId)
- StudentCode        NVARCHAR(50)      UQ  NOT NULL
- EnrollmentYear     INT                   NULL
- EducationLevel     NVARCHAR(50)          NULL
- TrainingType       NVARCHAR(50)          NULL
- MajorId            UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Majors(MajorId)
- CourseCohort       NVARCHAR(50)          NULL      -- K20/K21... (đổi tên tránh trùng với "Course" môn học)
- Note               NVARCHAR(255)         NULL
- IsActive           BIT                   NOT NULL DEFAULT(1)

- CreatedAt          DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy          UNIQUEIDENTIFIER      NULL
- UpdatedAt          DATETIME2(3)          NULL
- UpdatedBy          UNIQUEIDENTIFIER      NULL
- DeletedAt          DATETIME2(3)          NULL
- DeletedBy          UNIQUEIDENTIFIER      NULL

CONSTRAINTS / INDEX:
- PK_Students(StudentId)
- UQ_Students_StudentCode(StudentCode)
- IX_Students_UserId(UserId)
- IX_Students_MajorId(MajorId)
2) StudentStatuses
   TABLE: StudentStatusCatalog
- StudentStatusId UNIQUEIDENTIFIER PK  NOT NULL DEFAULT(NEWID())
- Code            NVARCHAR(50)     UQ  NOT NULL      -- DANG_HOC, BAO_LUU...
- Name            NVARCHAR(100)        NOT NULL
- Description     NVARCHAR(255)        NULL
- StatusType      NVARCHAR(50)         NULL
- IsActive        BIT                 NOT NULL DEFAULT(1)

- CreatedAt       DATETIME2(3)         NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy       UNIQUEIDENTIFIER     NULL
- UpdatedAt       DATETIME2(3)         NULL
- UpdatedBy       UNIQUEIDENTIFIER     NULL

TABLE: StudentStatusHistories
- StudentStatusHistoryId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- StudentId              UNIQUEIDENTIFIER FK NOT NULL REFERENCES Students(StudentId)
- StudentStatusId        UNIQUEIDENTIFIER FK NOT NULL REFERENCES StudentStatusCatalog(StudentStatusId)

- StartDate              DATE                NOT NULL
- EndDate                DATE                NULL
- IsCurrent              BIT                 NOT NULL DEFAULT(0)

- Reason                 NVARCHAR(255)        NULL
- DecisionNo             NVARCHAR(50)         NULL
- DecisionDate           DATE                 NULL
- DecidedBy              NVARCHAR(150)        NULL

- WarningLevel           INT                  NULL
- AllowRegister          BIT                  NOT NULL DEFAULT(1)
- AllowExam              BIT                  NOT NULL DEFAULT(1)

- CreatedAt              DATETIME2(3)         NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy              UNIQUEIDENTIFIER     NULL
- UpdatedAt              DATETIME2(3)         NULL
- UpdatedBy              UNIQUEIDENTIFIER     NULL

INDEX:
- IX_SSH_StudentId(StudentId)
- IX_SSH_StatusId(StudentStatusId)
- IX_SSH_IsCurrent(StudentId, IsCurrent)
3) Classes (lớp hành chính) + StudentClasses (gán SV vào lớp)
   TABLE: Classes
- ClassId        UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- ClassCode      NVARCHAR(50)     UQ NOT NULL
- ClassName      NVARCHAR(100)       NOT NULL
- DepartmentId   UNIQUEIDENTIFIER    NULL      -- FK Departments(DepartmentId) (thay khoa_id)
- AdvisorId      UNIQUEIDENTIFIER    NULL      -- FK Instructors(InstructorId) (thay co_van_id)
- IntakeYear     INT                NULL       -- năm nhập học / khoá
- MaxSize        INT                NULL
- Status         NVARCHAR(50)        NULL       -- ACTIVE/INACTIVE... (hoặc tinyint enum)
- Note           NVARCHAR(255)       NULL
- IsActive       BIT                NOT NULL DEFAULT(1)
- CreatedAt      DATETIME2(3)       NOT NULL DEFAULT(SYSDATETIME())
- UpdatedAt      DATETIME2(3)       NULL
- DeletedAt      DATETIME2(3)       NULL
- DeletedBy      UNIQUEIDENTIFIER   NULL

TABLE: StudentClasses
- StudentClassId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- StudentId      UNIQUEIDENTIFIER FK NOT NULL REFERENCES Students(StudentId)
- ClassId        UNIQUEIDENTIFIER FK NOT NULL REFERENCES Classes(ClassId)
- AcademicYear   INT                 NULL          -- thay nam_hoc
- TermCode       NVARCHAR(20)        NULL          -- HK1/HK2/HE
- RoleInClass    NVARCHAR(50)        NULL          -- SV/LOP_TRUONG...
- StartDate      DATE                NULL          -- ngay_vao_lop
- EndDate        DATE                NULL
- Status         NVARCHAR(50)        NULL
- Note           NVARCHAR(255)       NULL
- IsActive       BIT                 NOT NULL DEFAULT(1)
- CreatedAt      DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER    NULL
- UpdatedAt      DATETIME2(3)        NULL
- UpdatedBy      UNIQUEIDENTIFIER    NULL
- DeletedAt      DATETIME2(3)        NULL
- DeletedBy      UNIQUEIDENTIFIER    NULL

CONSTRAINTS / INDEX:
- UQ_StudentClasses(StudentId, ClassId, StartDate)  -- hoặc (StudentId, ClassId) nếu chỉ 1 lớp cố định
- IX_StudentClasses_ClassId(ClassId)
  Nhóm Giảng viên – Nhân sự: chuẩn hoá + thống nhất “Employees”
1) Departments (Khoa) – thay KHOA
   TABLE: Departments
- DepartmentId   UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Code           NVARCHAR(50)     UQ NOT NULL
- Name           NVARCHAR(150)       NOT NULL
- Description    NVARCHAR(255)       NULL
- IsActive       BIT                NOT NULL DEFAULT(1)
- CreatedAt      DATETIME2(3)       NOT NULL DEFAULT(SYSDATETIME())
- UpdatedAt      DATETIME2(3)       NULL
- DeletedAt      DATETIME2(3)       NULL
- DeletedBy      UNIQUEIDENTIFIER   NULL
  4.1 TABLE: Employees ( bảng cha nhân sự + giảng viên)
  TABLE: Employees
- EmployeeId      UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- PersonId        UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Persons(PersonId)

- EmployeeCode    NVARCHAR(50)      UQ  NOT NULL      -- bạn đã chọn A
- StartWorkDate   DATE                  NULL
- Status          NVARCHAR(50)          NULL          -- WORKING/RESIGNED...
- IsActive        BIT                   NOT NULL DEFAULT(1)

- CreatedAt       DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy       UNIQUEIDENTIFIER      NULL
- UpdatedAt       DATETIME2(3)          NULL
- UpdatedBy       UNIQUEIDENTIFIER      NULL
- DeletedAt       DATETIME2(3)          NULL
- DeletedBy       UNIQUEIDENTIFIER      NULL

CONSTRAINTS:
- UQ_Employees_PersonId UNIQUE(PersonId)  -- 1 person tối đa 1 hồ sơ employee
  TABLE: Instructors (bảng con) giảng viên
  TABLE: Instructors
- EmployeeId       UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Employees(EmployeeId)

- InstructorCode   NVARCHAR(50)     UQ NOT NULL
- DepartmentId     UNIQUEIDENTIFIER    NULL REFERENCES Departments(DepartmentId)
- DegreeId         UNIQUEIDENTIFIER    NULL REFERENCES Degrees(DegreeId)

- CreatedAt        DATETIME2(3)       NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy        UNIQUEIDENTIFIER   NULL
- UpdatedAt        DATETIME2(3)       NULL
- UpdatedBy        UNIQUEIDENTIFIER   NULL
- DeletedAt        DATETIME2(3)       NULL
- DeletedBy        UNIQUEIDENTIFIER   NULL
  4.3 TABLE: Staffs (bảng con) nhân sự
  TABLE: Staffs
- EmployeeId     UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Employees(EmployeeId)

- StaffCode      NVARCHAR(50)     UQ NOT NULL
- DivisionId     UNIQUEIDENTIFIER    NULL REFERENCES Divisions(DivisionId)
- PositionId     UNIQUEIDENTIFIER    NULL REFERENCES Positions(PositionId)

- CreatedAt      DATETIME2(3)       NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER   NULL
- UpdatedAt      DATETIME2(3)       NULL
- UpdatedBy      UNIQUEIDENTIFIER   NULL
- DeletedAt      DATETIME2(3)       NULL
- DeletedBy      UNIQUEIDENTIFIER   NULL
4) Positions (Chức vụ)
   TABLE: Positions
- PositionId   UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Name         NVARCHAR(150)    NOT NULL
- Allowance    DECIMAL(18,2)    NULL
- IsActive     BIT             NOT NULL DEFAULT(1)
5) Degrees (Trình độ) – thay TRINH_DO
   TABLE: Degrees
- DegreeId      UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Name          NVARCHAR(150)    NOT NULL            -- Cử nhân/Thạc sĩ...
- Major         NVARCHAR(150)    NULL                -- chuyên ngành
- IsActive      BIT             NOT NULL DEFAULT(1)
6) InstructorLeaveRequests (Nghỉ phép), InstructorAttendance (Chấm công), Contracts (Hợp đồng)
- Hợp đồng:
  TABLE: Contracts
- ContractId     UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- EmployeeId     UNIQUEIDENTIFIER FK NOT NULL REFERENCES Employees(EmployeeId)

- ContractNo     NVARCHAR(50)     NULL
- ContractType   NVARCHAR(100)    NOT NULL
- SignedDate     DATE             NULL
- EffectiveDate  DATE             NULL
- ExpiredDate    DATE             NULL
- BaseSalary     DECIMAL(18,2)    NULL
- Status         TINYINT          NOT NULL DEFAULT(1)   -- 1 active, 0 inactive
- Note           NVARCHAR(255)    NULL

- CreatedAt      DATETIME2(3)     NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER NULL
- UpdatedAt      DATETIME2(3)     NULL
- UpdatedBy      UNIQUEIDENTIFIER NULL

INDEX:
- IX_Contracts_EmployeeId(EmployeeId)
- IX_Contracts_Status(Status)

RULE (optional, nếu muốn 1 hợp đồng active):
- Unique filtered index on Contracts(EmployeeId) WHERE Status = 1

3) Nghỉ phép, chấm công
   TABLE:EmployeeLeaveRequests
- LeaveRequestId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- EmployeeLeaveRequests   UNIQUEIDENTIFIER FK NOT NULL REFERENCES Employees(EmployeeId)

- FromDate       DATE               NOT NULL
- ToDate         DATE               NOT NULL
- Reason         NVARCHAR(255)       NULL
- Status         TINYINT            NOT NULL DEFAULT(0)  -- 0 pending, 1 approved, 2 rejected
- ApprovedBy     UNIQUEIDENTIFIER    NULL REFERENCES Staffs(EmployeeId) -- nếu có duyệt bởi nhân sự
- ApprovedAt     DATETIME2(3)        NULL
- Note           NVARCHAR(255)       NULL

- CreatedAt      DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER    NULL
- UpdatedAt      DATETIME2(3)        NULL
- UpdatedBy      UNIQUEIDENTIFIER    NULL

CHECK:
- CK_LeaveRequest_DateRange: FromDate <= ToDate
  INDEX:
- IX_ILR_EmployeeId(EmployeesId)
- IX_ILR_Status(Status)
  TABLE: EmployeeAttendances
- AttendanceId  UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
  -EmployeeAttendances  UNIQUEIDENTIFIER FK NOT NULL REFERENCES Employees(EmployeeId)

- WorkDate      DATE               NOT NULL
- CheckInTime   TIME(0)            NULL
- CheckOutTime  TIME(0)            NULL
- Status        TINYINT            NOT NULL DEFAULT(0)  -- 0 unknown, 1 present, 2 absent, 3 leave

- CreatedAt     DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy     UNIQUEIDENTIFIER    NULL

CONSTRAINTS / INDEX:
- UQ_InstructorAttendances(EmployeeId, WorkDate)   -- 1 ngày 1 bản ghi
- CK_Attendance_Time CHECK (CheckOutTime IS NULL OR CheckInTime IS NULL OR CheckInTime < CheckOutTime)
- IX_IA_WorkDate(WorkDate)
5) Teaching / phân công giảng dạy
   TABLE: TeachingAssignments (PHAN_CONG_GIANG_DAY)
- AssignmentId   UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())     -- thay INT bằng GUID theo chuẩn bạn chốt
- InstructorId   UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Instructors(EmployeeId)
- CoursesId      UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Courses(CourseId)      -- mon_hoc_id
- ClassId        UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Classes(ClassId)         -- lop_hoc_id

- Semester       NVARCHAR(20)          NOT NULL                        -- hoc_ky (VD: HK1, HK2, HE)
- SchoolYear     NVARCHAR(20)          NOT NULL                        -- nam_hoc (VD: 2025-2026)

- Note           NVARCHAR(255)         NULL
- IsActive       BIT                  NOT NULL DEFAULT(1)

- CreatedAt      DATETIME2(3)         NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER     NULL
- UpdatedAt      DATETIME2(3)         NULL
- UpdatedBy      UNIQUEIDENTIFIER     NULL

CONSTRAINTS / INDEX:
- IX_TA_InstructorId(InstructorId)
- IX_TA_CourseId(CoursesId)
- IX_TA_ClassId(ClassId)
- UQ_TA UNIQUE(InstructorId, CoursesId, ClassId, Semester, SchoolYear)  -- chống phân công trùng

TABLE: Majors
- MajorId      UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- Code         NVARCHAR(20)      UQ  NOT NULL                 -- CNTT, AI...
- Name         NVARCHAR(255)         NOT NULL
- Description  NVARCHAR(MAX)         NULL
- IsActive     BIT                   NOT NULL DEFAULT(1)

- CreatedAt    DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy    UNIQUEIDENTIFIER      NULL
- UpdatedAt    DATETIME2(3)          NULL
- UpdatedBy    UNIQUEIDENTIFIER      NULL
- DeleteAt     DATETIME2(3)          NULL
- DeleteBy    UNIQUEIDENTIFIER       NULL
CONSTRAINTS / INDEX:
- PK_Majors(MajorId)
- UQ_Majors_Code(Code)
- IX_Majors_IsActive(IsActive)
TABLE: TrainingPrograms
- TrainingProgramId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Code              NVARCHAR(20)     UQ NOT NULL                -- VD: CTDT_CNTT_K20
- Name              NVARCHAR(255)       NOT NULL
- MajorId           UNIQUEIDENTIFIER    NOT NULL REFERENCES Majors(MajorId)
- CohortCode        NVARCHAR(20)        NOT NULL                -- K20/K21...
- TotalCredits      INT                 NULL
- Description       NVARCHAR(MAX)       NULL
- Note              NVARCHAR(MAX)       NULL
- IsActive          BIT                 NOT NULL DEFAULT(1)

- CreatedAt         DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy         UNIQUEIDENTIFIER    NULL
- UpdatedAt         DATETIME2(3)        NULL
- UpdatedBy         UNIQUEIDENTIFIER    NULL
- DeleteAt          DATETIME2(3)        NULL
- DeleteBy          UNIQUEIDENTIFIER    NULL
INDEX:
- IX_TrainingPrograms_MajorId(MajorId)
- IX_TrainingPrograms_CohortCode(CohortCode)
  TABLE: Courses
- CourseId        UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Code            NVARCHAR(20)     UQ NOT NULL
- Name            NVARCHAR(200)       NOT NULL
- Credits         INT                NOT NULL
- TheoryHours     INT                NULL
- PracticeHours   INT                NULL
- Description     NVARCHAR(1000)      NULL
- IsActive        BIT                NOT NULL DEFAULT(1)

- CreatedAt       DATETIME2(3)       NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy       UNIQUEIDENTIFIER   NULL
- UpdatedAt       DATETIME2(3)       NULL
- UpdatedBy       UNIQUEIDENTIFIER   NULL

INDEX:
- IX_Courses_IsActive(IsActive)
  TrainingProgramCourses (Môn thuộc chương trình)
TABLE: TrainingProgramCourses
- TrainingProgramId UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES TrainingPrograms(TrainingProgramId)
- CourseId          UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Courses(CourseId)

- RecommendedTermNo INT                  NULL      -- học kỳ đề xuất
- IsMandatory       BIT                  NOT NULL DEFAULT(1)
- Note              NVARCHAR(255)        NULL

- CreatedAt         DATETIME2(3)         NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy         UNIQUEIDENTIFIER     NULL

CONSTRAINTS / INDEX:
- PK_TrainingProgramCourses(TrainingProgramId, CourseId)
- IX_TPC_CourseId(CourseId)
  CoursePrerequisites (Môn tiên quyết)
- TABLE: CoursePrerequisites
- CourseId               UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Courses(CourseId)
- PrerequisiteCourseId   UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Courses(CourseId)
- CreatedAt              DATETIME2(3)     NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy              UNIQUEIDENTIFIER NULL

CONSTRAINTS:
- PK_CoursePrerequisites(CourseId, PrerequisiteCourseId)
- CK_NoSelfPrerequisite CHECK (CourseId <> PrerequisiteCourseId)

INDEX:
- IX_CoursePrerequisites_Prereq(PrerequisiteCourseId)
  NHÓM QUẢN LÝ HỌC KỲ – LỚP HỌC PHẦN – PHÂN CÔNG GIẢNG VIÊN
Terms (Semesters)
- 
