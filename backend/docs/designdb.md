Users/Role/Permission
1) Bảng Users (tài khoản)
   Unique:
   UQ_Users_Username (bắt buộc)
   UQ_Users_Email (nếu email dùng đăng nhập/không cho trùng)
   Index:
   IX_Users_IsActive
   IX_Users_LastLoginAt
   --
   TABLE: Persons là bảng cha của student, staff và introduction
- PersonId           UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- FullName           NVARCHAR(150)         NOT NULL
- Gender             NVARCHAR(20)          NULL
- DateOfBirth        DATE                  NULL
- PlaceOfBirth       NVARCHAR(150)         NULL
- Ethnicity          NVARCHAR(100)         NULL
- personal_identification_number Varchar(20)   CMND/CCCD
- date_of_issue     DATE      ngày cấp
- card_place    NVARCHAR(100)   nơi cấp
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
- PersonId             UNIQUEIDENTIFIER FK NOT NULL REFERENCES Persons(PersonId)
- Username             NVARCHAR(50)       UQ  NOT NULL                                    -- duy nhất
- PasswordHash         NVARCHAR(255)          NOT NULL
- Email                NVARCHAR(150)      UQ  NULL                                        -- tùy policy, có thể NOT NULL
- LastLoginAt          DATETIME2(3)           NULL
- AccessFailedCount    INT                    NOT NULL DEFAULT(0)
- LockoutEndAt         DATETIME2(3)           NULL                                        -- thay cho is_locked + lock_reason dạng cứng
- LockReason           NVARCHAR(255)          NULL
- IsActive             BIT                    NOT NULL DEFAULT(1)
-- Audit
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
-  Username collation case-insensitive
-  email normalized
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
  TABLE: Permissions
- PermissionId    UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- Code            NVARCHAR(100)     UQ  NOT NULL                     -- USER_CREATE...
- Name            NVARCHAR(150)         NOT NULL
- Description     NVARCHAR(255)         NULL
- Module          NVARCHAR(50)          NULL
- ApiPath         NVARCHAR(255)         NULL
- HttpMethod      NVARCHAR(10)          NULL
- Screen          NVARCHAR(100)         NULL
- ScreenAction    NVARCHAR(50)          NULL          -- Hành động trên màn hình (VIEW/CREATE/EDIT/DELETE)
- ParentScreen    NVARCHAR(100)         NULL         -- Menu cha (VD: /students là con của /academic)
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
  TABLE: UserRoles (mapping)
- UserId       UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Users(UserId)
- RoleId       UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Roles(RoleId)
- CreatedAt    DATETIME2(3)              NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy    UNIQUEIDENTIFIER          NULL
- IsActive     BIT                       NOT NULL DEFAULT(1)

CONSTRAINTS / INDEX:
- PK_UserRoles(UserId, RoleId)
- IX_UserRoles_RoleId(RoleId)
  TABLE: RolePermissions (Mappping)
- RoleId        UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES Roles(RoleId)
- PermissionId  UNIQUEIDENTIFIER  PK/FK  NOT NULL  REFERENCES       Permissions(PermissionId)
- CreatedAt     DATETIME2(3)              NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy     UNIQUEIDENTIFIER          NULL
- IsActive      BIT                       NOT NULL DEFAULT(1)

CONSTRAINTS / INDEX:
- PK_RolePermissions(RoleId, PermissionId)
- IX_RolePermissions_PermissionId(PermissionId)
  TABLE: Students (Sinh viên)
- StudentId          UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- PersonId           UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Persons(PersonId)
- StudentCode        NVARCHAR(50)      UQ  NOT NULL
- Note               NVARCHAR(255)         NULL
- TrainingProgramId   FK   UNIQUEIDENTIFIER NOT NULL khoá ngoại với  TrainingPrograms – chương trình đào tạo theo ngành
- IsActive           BIT                   NOT NULL DEFAULT(1)
- CreatedAt          DATETIME2(3)          NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy          UNIQUEIDENTIFIER      NULL
- UpdatedAt          DATETIME2(3)          NULL
- UpdatedBy          UNIQUEIDENTIFIER      NULL
- DeletedAt          DATETIME2(3)          NULL
- DeletedBy          UNIQUEIDENTIFIER      NULL

CONSTRAINTS / INDEX:
- PK_Students(StudentId)
- UQ_Students_PersonId UNIQUE(PersonId)---- 1 person chỉ có 1 Student
- UQ_Students_StudentCode(StudentCode)
  IX_Students_TrainingProgramId(TrainingProgramId)
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
  UQ_StudentStatusCatalog_Code(Code)
  IX_StudentStatusCatalog_IsActive(IsActive)
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
  CK_SSH_DateRange CHECK (EndDate IS NULL OR StartDate <= EndDate)
  Classes (lớp hành chính) + StudentClasses (gán SV vào lớp)
  TABLE: Classes
- ClassId        UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- ClassCode      NVARCHAR(50)     UQ NOT NULL
- ClassName      NVARCHAR(100)       NOT NULL
- DepartmentId   UNIQUEIDENTIFIER    NULL      -- FK Departments(DepartmentId) (thay khoa_id)
- AdvisorId      UNIQUEIDENTIFIER    NULL      -- FK Instructors(InstructorId) (thay co_van_id)
- AcademicCohortId FK UNIQUEIDENTIFIER  → AcademicCohorts
- MaxSize        INT                NULL  (CHECK MaxSize > 0)
- Status        TINYINT       NULL       -- ACTIVE/INACTIVE... (hoặc tinyint enum)
- Note           NVARCHAR(255)       NULL
- IsActive       BIT                NOT NULL DEFAULT(1)
- CreatedAt      DATETIME2(3)       NOT NULL DEFAULT(SYSDATETIME())
- UpdatedAt      DATETIME2(3)       NULL
- DeletedAt      DATETIME2(3)       NULL
- DeletedBy      UNIQUEIDENTIFIER   NULL

TABLE: StudentClasses “ gán sv vào lớp “
- StudentClassId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- StudentId      UNIQUEIDENTIFIER FK NOT NULL REFERENCES Students(StudentId)
- ClassId        UNIQUEIDENTIFIER FK NOT NULL REFERENCES Classes(ClassId)
- SemesterId       UNIQUEIDENTIFIER FK NOT NULL REFERENCES Semesters(SemesterId)          -- HK1/HK2/HE
- RoleInClass    NVARCHAR(50)        NULL          -- SV/LOP_TRUONG...
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
  Departments (Khoa) – thay KHOA
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
  TABLE: Employees ( bảng cha nhân sự + giảng viên)
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
  TABLE: Staffs (bảng con) nhân sự
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
  TABLE:  Positions (Chức vụ)
- PositionId   UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Name         NVARCHAR(150)    NOT NULL
- Allowance    DECIMAL(18,2)    NULL
- IsActive     BIT             NOT NULL DEFAULT(1)
  TABLE:  Degrees (Trình độ) – thay TRINH_DO
- DegreeId      UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Name          NVARCHAR(150)    NOT NULL            -- Cử nhân/Thạc sĩ...
- Major         NVARCHAR(150)    NULL                -- chuyên ngành
- IsActive      BIT             NOT NULL DEFAULT(1)
  InstructorLeaveRequests (Nghỉ phép), InstructorAttendance (Chấm công), Contracts (Hợp đồng)
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

Nghỉ phép, chấm công
TABLE:EmployeeLeaveRequests
- LeaveRequestId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- EmployeeId   UNIQUEIDENTIFIER FK NOT NULL REFERENCES Employees(EmployeeId)

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
- IX_ELR_EmployeeId(EmployeeId)
- IX_ILR_Status(Status)
  TABLE: EmployeeAttendances
- AttendanceId  UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- EmployeeId  UNIQUEIDENTIFIER FK NOT NULL REFERENCES Employees(EmployeeId)

- WorkDate      DATE               NOT NULL
- CheckInTime   TIME(0)            NULL
- CheckOutTime  TIME(0)            NULL
- Status        TINYINT            NOT NULL DEFAULT(0)  -- 0 unknown, 1 present, 2 absent, 3 leave

- CreatedAt     DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy     UNIQUEIDENTIFIER    NULL

CONSTRAINTS / INDEX:
- FK_EA_Employee FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
- UQ_EA_Employee_WorkDate UNIQUE (EmployeeId, WorkDate)  -- 1 ngày 1 bản ghi
- CK_Attendance_Time CHECK (CheckOutTime IS NULL OR CheckInTime IS NULL OR CheckInTime < CheckOutTime)
- IX_IA_WorkDate(WorkDate)

  TABLE: TeachingAssignments (PHAN_CONG_GIANG_DAY)
- AssignmentId   UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID
- InstructorId   UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Instructors(Id)
- CourseClassId    UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES CourseClasses(CourseClassId)      -- lớp học phần
- ClassId        UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Classes(ClassId)         -- lop_hoc hành chính
- SemesterId       UNIQUEIDENTIFIER FK NOT NULL REFERENCES Semesters(SemesterId)          -- code lưu HK1/HK2/HE                       và trong semester nó AcademicYear = '2025-2026'
- Note           NVARCHAR(255)         NULL
- IsActive       BIT                  NOT NULL DEFAULT(1)

- CreatedAt      DATETIME2(3)         NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER     NULL
- UpdatedAt      DATETIME2(3)         NULL
- UpdatedBy      UNIQUEIDENTIFIER     NULL

CONSTRAINTS / INDEX:
- IX_TA_InstructorId(EmployeeId)
- IX_TA_CourseClassId(CoursClassId)
- IX_TA_ClassId(ClassId)
- UQ_TA UNIQUE(InstructorId, CourseId, ClassId, Semesters, SchoolYear)
  TABLE: Majors  “ ngành”
- MajorId      UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())
- DepartmentId NOT NULL FK → Departments(DepartmentId)
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
  TABLE: TrainingPrograms chương trình đào tạo theo ngành và khoá
- TrainingProgramId UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- Code              NVARCHAR(20)     UQ NOT NULL                -- VD: CTDT_CNTT_K20
- Name              NVARCHAR(255)       NOT NULL
- NameEn   NVARCHAR(255) tên chương trình tiếng anh
- MajorId           UNIQUEIDENTIFIER    NOT NULL REFERENCES Majors(MajorId)
- DepartmentId  FK   UNIQUEIDENTIFIER    NOT NULL REFERENCES Department
- AcademicCohortId       FK   UNIQUEIDENTIFIER    NOT NULL REFERENCES      AcademicCohorts            -- K20/K21…
- DegreeLevel  NVARCHAR(50)     bậc đào tạo( đại học, Cao Học, Tiến sĩ)
- EducationType    NVARCHAR(50)   loại hình đào tạo( Chính quy, liên thông,VB2)
- TotalCredits      INT                 NULL   — Tổng tín toàn chương trình
- required_credits  DECIMAL(5,1)  - tín chỉ bắt buộc
- elective_credits    DECIMAL(5,1)     — tín tự chọn
- internship_credits     DECIMAL(5,1)   — tín thực tập
- thesis_credits          DECIMAL(5,1)    - tín khoá luận
- admission_year      DATE                — năm tuyển sinh
- duration_years        DECIMAL(5,1) - - thời gian đào tạo 4,5 năm, 6 năm
- max_duration_years      DECIMAL(5,1)    –Thời gian đào tạo tối đa của ngành này: 4.5 năm, 6.5 năm,..
- effective_date          DATE    - Ngày hiệu lực chương trình
- expiry_date          DATE      - Ngày hết hiệu lực chương trình
- Description       NVARCHAR(MAX)       NULL
- objectives         NVARCHAR(MAX)    - mục tiêu đào tạo
- learning_outcomes         NVARCHAR(MAX)  – chuẩn đầu ra
- version                        NVARCHAR(20)  – phiên bản
- status                 NVARCHAR(20)   - Trạng thái đào tạo: đang đào tạo, dừng đào tạo
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
  TABLE: Courses   Môn học / học phần
- CourseId        UNIQUEIDENTIFIER PK NOT NULL DEFAULT(NEWID())
- DepartmentId FK  UNIQUEIDENTIFIER Departments
- Code            NVARCHAR(20)     UQ NOT NULL
- Name            NVARCHAR(200)       NOT NULL
- NameEn   NVARCHAR(255)  tên tiếng anh
- cource_type VARCHAR(20)  phân loại môn
- Credits       DECIMAL(5,1)                NOT NULL  - số tín chỉ
- TheoryHours    DECIMAL(5,1)                NULL    - số tiết lí thuyết
- PracticeHours  DECIMAL(5,1)                NULL    - số tiết thực hành
- self_study_hours DECIMAL(5,1)        - số giờ tự học
- internship_credits  DECIMAL(5,1)    - số giờ thực tập
- Description     NVARCHAR(1000)      NULL
- IsActive          BIT                 NOT NULL DEFAULT(1)

- CreatedAt         DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy         UNIQUEIDENTIFIER    NULL
- UpdatedAt         DATETIME2(3)        NULL
- UpdatedBy         UNIQUEIDENTIFIER    NULL
- DeleteAt          DATETIME2(3)        NULL
- DeleteBy          UNIQUEIDENTIFIER    NULL

INDEX:
- IX_Courses_IsActive(IsActive)
  TrainingProgramCourses (Môn thuộc chương trình)
  TABLE: TrainingProgramCourses   “ chương trình đào tạo theo môn”
- TrainingProgramId UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES TrainingPrograms(TrainingProgramId)
- CourseId          UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Courses(CourseId)
  CourseCode	 NVARCHAR(20)	FK → courses.code Mã học phần (lưu dư để truy vấn nhanh, tránh join)
  CourseName	NVARCHAR(200)	FK → courses.name Tên học phần
  SemesterId	UNIQUEIDENTIFIER	FK → Semesters.SếmterId Mã học kỳ (HK1_2024_2025)
  SemesterCode    VARCHAR(30)	FK → Semesters.name (Học kỳ 1 năm 2024–2025)
-  is_required BIT   – xđ môn bắt buộc(1) hay tự chọn(0)
   group_code	NVARCHAR(50)	Mã nhóm môn tự chọn (ví dụ: AI, CNPM, HTTT...)
   credits	DECIMAL(5,1)	Số tín chỉ của học phần trong CTĐT
   prerequisite_course_id	UNIQUEIDENTIFIER	Mã môn học trước (chỉ áp dụng nếu 1 môn)
   is_prerequisite_required	BIT	Xác định môn tiên quyết có bắt buộc không
   note	NVARCHAR(500)	Ghi chú thêm về học phần
   sort_order	INT	Thứ tự hiển thị học phần trong chương trình
   status	NVARCHAR(50)	Trạng thái đào tạo: đang đào tạo, dừng đào tạo
- IsActive          BIT                 NOT NULL DEFAULT(1)
- CreatedAt         DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy         UNIQUEIDENTIFIER    NULL
- UpdatedAt         DATETIME2(3)        NULL
- UpdatedBy         UNIQUEIDENTIFIER    NULL
- DeleteAt          DATETIME2(3)        NULL
- DeleteBy          UNIQUEIDENTIFIER    NULL

CONSTRAINTS / INDEX:
- PK_TrainingProgramCourses(TrainingProgramId, CourseId)
- IX_TPC_CourseId(CourseId)
  CoursePrerequisites (Môn tiên quyết)
  TABLE: CoursePrerequisites “ môn tiên quyết”
- CourseId               UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Courses(CourseId)
- PrerequisiteCourseId   UNIQUEIDENTIFIER PK/FK NOT NULL REFERENCES Courses(CourseId)
- CreatedAt         DATETIME2(3)        NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy         UNIQUEIDENTIFIER    NULL
- UpdatedAt         DATETIME2(3)        NULL
- UpdatedBy         UNIQUEIDENTIFIER    NULL
- DeleteAt          DATETIME2(3)        NULL
- DeleteBy          UNIQUEIDENTIFIER    NULL
- IsActive          BIT                 NOT NULL DEFAULT(1)

CONSTRAINTS:
- PK_CoursePrerequisites(CourseId, PrerequisiteCourseId)
- CK_NoSelfPrerequisite CHECK (CourseId <> PrerequisiteCourseId)

INDEX:
- IX_CoursePrerequisites_Prereq(PrerequisiteCourseId)
  V. NHÓM QUẢN LÝ HỌC KỲ – LỚP HỌC PHẦN
  TABLE: SchoolYears “ năm đào tạo ví dụ:2026-2027”
  SchoolYearId (PK) UNIQUEIDENTIFIER
  Code (UQ) NVARCHAR(50)   mã niên khoá:2023-2027; 2024-2028; 2025-2029; …
  Name    NVARCHAR(100) Tên niên khoá nếu cần hiển thị khác code
  StartDate DATE    NOT NULL ngày bắt đầu kì
  EndDate    DATE NOT NULL ngày kết thúc kì
  Description    NVARCHAR(255)  ghi chú
  created_at    DATETIME2  Thời điểm tạo
  updated_at    DATETIME2  Thời điểm cập nhật
  deleted_at    DATETIME2  Thời điểm xóa mềm
  created_by    UUID   Người tạo
  updated_by    UUID   Người cập nhật
  deleted_by    UUID   Người xóa
  Is_active BIT trạng thái hiệu lực
  UQ_SchoolYears_Code(Code)
  CK_SchoolYears_Dates (StartDate < EndDate)
  TABLE: AcademicCohorts “ niên khoá đào tạo: ví dụ:2022-2026”
  AcademicCohortId UNIQUEIDENTIFIER PK DEFAULT NEWSEQUENTIALID()
  Code NVARCHAR(20) NOT NULL — ví dụ: 2023-2027 hoặc K23_4Y
  Name NVARCHAR(100) NULL/NOT NULL — hiển thị (có thể = Code)
  StartYear SMALLINT NOT NULL — 2023
  EndYear SMALLINT NOT NULL — 2027
  StartDate DATE NULL — nếu trường có ngày “bắt đầu khóa” (thường NULL cũng ok)
  EndDate DATE NULL — nếu cần
  Description NVARCHAR(255) NULL
  created_at    DATETIME2  Thời điểm tạo
  updated_at    DATETIME2  Thời điểm cập nhật
  deleted_at    DATETIME2  Thời điểm xóa mềm
  created_by    UUID   Người tạo
  updated_by    UUID   Người cập nhật
  deleted_by    UUID   Người xóa
  Is_active BIT trạng thái hiệu lực
  UQ_AcademicCohorts_Code(Code)
  CK_AcademicCohorts_Years (StartYear < EndYear)
  (Optional) CK_AcademicCohorts_Dates (StartDate IS NULL OR EndDate IS NULL OR StartDate < EndDate)

TABLE: Semesters ( Quản lý học kì)
SemesterId    UUID   Khóa chính
code  VARCHAR(30)    Mã học kỳ
name  VARCHAR(150)   Tên học kỳ
SchoolYearId  UNIQUEIDENTIFIER (FK -> SchoolYears) mã năm học
SchoolYearName    NVARCHAR(100) (FK Name của SchoolYears)
start_date    DATE   Ngày bắt đầu
end_date  DATE   Ngày kết thúc
status    BIT/TINYINT/ENUM   Trạng thái học kỳ
created_at    DATETIME2  Thời điểm tạo
updated_at    DATETIME2  Thời điểm cập nhật
description   TEXT   Ghi chú
deleted_at    DATETIME2  Thời điểm xóa mềm
created_by    UUID   Người tạo
updated_by    UUID   Người cập nhật
deleted_by    UUID   Người xóa
Unique: UQ(SchoolYearId, Code)

TABLE:  Course_class   Lớp học phần mở theo học kỳ
CourseClassId UNIQUEIDENTIFIER   Khóa chính
class_code    NVARCHAR(50)   Mã lớp học phần
max_student   INT    Sĩ số tối đa
current_student   INT    Sĩ số hiện tại
ScheduleId	FK UNIQUEIDENTIFIER  Lịch học
RoomId  FK  UNIQUEIDENTIFIER  Phòng học
status    NVARCHAR(20)   Trạng thái lớp
SemesterId   UNIQUEIDENTIFIER (FK)  Học kỳ
CourseId       UNIQUEIDENTIFIER (FK) môn học phần
created_at    DATETIME2  Thời điểm tạo
updated_at    DATETIME2  Thời điểm cập nhật
deleted_at    DATETIME2 NULL Thời điểm xóa
created_by    UNIQUEIDENTIFIER NULL  Người tạo
updated_by    UNIQUEIDENTIFIER NULL  Người cập nhật
deleted_by    UNIQUEIDENTIFIER NULL  Người xóa
UQ_CourseClasses(SemesterId, CourseId, ClassCode)
VI. NHÓM ĐĂNG KÝ HỌC PHẦN
Bảng course_registrations ( CHI TIẾT ĐĂNG KÍ )
1	CourseRegistrationId	UNIQUEIDENTIFIER	Khóa chính (Default: NEWSEQUENTIALID())
2	StudentId	UNIQUEIDENTIFIER	FK liên kết với bảng students
3	CourseClassId	UNIQUEIDENTIFIER	FK liên kết với bảng course_classes
4	RegistrationPeriodId	UNIQUEIDENTIFIER	FK liên kết với bảng registration_periods
5	registration_type	TINYINT	1: Học mới; 2: Học lại; 3: Cải thiện
6	replaced_grade_id	UNIQUEIDENTIFIER	ID điểm cũ nếu đăng ký học lại/cải thiện
7	registered_at	DATETIME2	Thời điểm thực hiện đăng ký
8	status	TINYINT	1: Thành công; 2: Chờ thanh toán; 3: Đã hủy
9	is_paid	BIT	Đã thanh toán học phí chưa (Đồng bộ từ Nhóm IX)
10	row_version	ROWVERSION	Xử lý tranh chấp đăng ký cùng lúc
11	created_at	DATETIME2	Thời điểm tạo
12	updated_at	DATETIME2	Thời điểm cập nhật
13	created_by	UNIQUEIDENTIFIER	Người tạo
14	updated_by	UNIQUEIDENTIFIER	Người cập nhật
15	deleted_at	DATETIME2	Thời điểm xóa
16	deleted_by	UNIQUEIDENTIFIER	Người xóa

UQ_CourseRegistrations(StudentId, CourseClassId) (mỗi SV chỉ đăng ký 1 lần cho 1 lớp học phần)
UQ_CourseRegistrations_RegistrationCode(RegistrationCode)
IX_CourseRegistrations_StudentId(StudentId)
IX_CourseRegistrations_CourseClassId(CourseClassId)
IX_CourseRegistrations_RegistrationPeriodId(RegistrationPeriodId)
cho phép “hủy rồi đăng ký lại cùng CourseClass” thì dùng unique filtered index:
UNIQUE(StudentId, CourseClassId) WHERE DeletedAt IS NULL AND Status <> 3(Đã hủy) (tuỳ enum)
Bảng equivalent_courses (Môn tương đương)						
1	EquivalentCoursesId	UNIQUEIDENTIFIER	Khóa chính
2	OriginalCourseId	UNIQUEIDENTIFIER	FK liên kết bảng courses (Môn cũ/gốc)
3	EquivalentCourseId	UNIQUEIDENTIFIER	FK liên kết bảng courses (Môn mới/thay thế)
4	equivalence_type	TINYINT	1: Thay thế hoàn toàn; 2: Tương đương song song
5	effect_date	DATE	Ngày bắt đầu áp dụng
6	is_active	BIT	Trạng thái sử dụng (1: Đang áp dụng)
7	note	NVARCHAR(500)	Lý do tương đương
8	created_at	DATETIME2	Thời điểm tạo
9	updated_at	DATETIME2	Thời điểm cập nhật
10	created_by	UNIQUEIDENTIFIER	Người tạo
11	updated_by	UNIQUEIDENTIFIER	Người cập nhật
12	deleted_at	DATETIME2	Thời điểm xóa
13	deleted_by	UNIQUEIDENTIFIER	Người xóa
UQ_EquivalentCourses(OriginalCourseId, EquivalentCourseId)
CHECK OriginalCourseId <> EquivalentCourseId
Index cho cả 2 chiều:
IX_EquivalentCourses_OriginalCourseId
IX_EquivalentCourses_EquivalentCourseId

TABLE registration_periods ( Đợt đăng kí học phần)
1 RegistrationPeriodId UUID   Khóa chính
2 code   VARCHAR(30)    Mã đợt đăng ký
3 name   VARCHAR(150)   Tên đợt đăng ký
4 SemesterId    UUID (FK)  Liên kết học kỳ
5 start_date DATETIME   Bắt đầu đăng ký
6 end_date   DATETIME   Kết thúc đăng ký
target_config	NVARCHAR(MAX)	Lưu cấu hình đối tượng (JSON): Khóa, Khoa....
7 status TINYINT / ENUM Trạng thái đợt đăng ký
8 min_credits    INT    Số tín chỉ tối thiểu
9 max_credits    INT    Số tín chỉ tối đa
allow_retake	BIT	Cho phép học lại/cải thiện hay không.
10    description    TEXT   Ghi chú
11    created_at DATETIME2  Thời điểm tạo
12    updated_at DATETIME2  Thời điểm cập nhật
13    deleted_at DATETIME2 NULL Thời điểm xóa mềm
deleted_by	UNIQUEIDENTIFIER	Người xóa
14    created_by BIGINT NULL    Người tạo
15    updated_by BIGINT NULL    Người cập nhật
is_active	BIT	Trạng thái hiệu lực
VII. NHÓM QUẢN LÝ LỊCH HỌC – PHÒNG HỌC
Bảng Buildings	“ toà học”		
1	BuildingId	PK UNIQUEIDENTIFIER	        Khóa chính
2	code	NVARCHAR(100)	Mã tòa nhà — duy nhất
3	name	NVARCHAR(255)	Tên tòa nhà
4	address	NVARCHAR(200)	Địa chỉ/ vị trí trong khuôn viên trường
5	total_floors	TINYINT	Tổng số tầng
6	building_type	VARCHAR(10)	Loại toà nhà
7	description	NVARCHAR(255)	Mô tả chức năng sử dụng
8	note	NVARCHAR(255)	Ghi chú vận hành
9	created_at	DATETIME2	Thời điểm tạo
10	updated_at	DATETIME2	Thời điểm cập nhật
11	created_by	UNIQUEIDENTIFIER	Người tạo
12	updated_by	UNIQUEIDENTIFIER	Người cập nhật
13	deleted_at	DATETIME2	Thời điểm xóa
14	deleted_by	UNIQUEIDENTIFIER	Người xóa
15	is_active	BIT	Trạng thái hiệu lực

Bảng Floor– Quản lý tầng của tòa nhà			
1	FloorId	PK UNIQUEIDENTIFIER	   Định danh duy nhất cho mỗi phòng
2	code	NVARCHAR(100)	Mã ngắn gọn để nhận diện nhanh (VD: A101)-vd: p707
3	name	NVARCHAR(255)	Tên đầy đủ của phòng (có thể trùng với mã hoặc chi tiết hơn)
4	floornumber	INT	tầng số
5	BuildingId	UNIQUEIDENTIFIER	FK → buildings.id Mã khoa -- liên kết tới bảng buildings
6	description	NVARCHAR(255)	Thông tin bổ sung về phòng
7	created_at	DATETIME2	Thời điểm tạo
8	updated_at	DATETIME2	Thời điểm cập nhật
9	created_by	UNIQUEIDENTIFIER	Người tạo
10	updated_by	UNIQUEIDENTIFIER	Người cập nhật
11	deleted_at	DATETIME2	Thời điểm xóa
12	deleted_by	UNIQUEIDENTIFIER	Người xóa
13	is_active	BIT	Trạng thái hiệu lực
Unique:
UQ_Floors(BuildingId, FloorNumber) (mỗi tòa nhà, mỗi tầng chỉ 1)
UQ_Floors(BuildingId, Code) nếu bạn dùng code tầng (F1/F2…)
Bảng Rooms – Phòng học			
1	RoomId	PK UNIQUEIDENTIFIER	Định danh duy nhất cho mỗi phòngng
2	code	NVARCHAR(100)	Mã ngắn gọn để nhận diện nhanh (VD: A101)-vd: p707
3	name	NVARCHAR(255)	Tên đầy đủ của phòng (có thể trùng với mã hoặc chi tiết hơn)
4	BuildingId	UNIQUEIDENTIFIER	FK → buildings.id Mã khoa  -- liên kết tới bảng buildings
5	floor_floornumber	INT	FK → floors.floornumber Xác định vị trí phòng trong tòa nhà
6	capacity	INT	Số lượng sinh viên tối đa phòng có thể chứa
7	type	NVARCHAR(50)	Phân loại phòng (lý thuyết, lab, phòng máy, xưởng thực thành...)
8	status	NVARCHAR(50)	Tình trạng sử dụng của phòng (đang dùng, bảo trì...)
9	has_projector	BIT	1: có, 0: không
10	has_air_conditioner	BIT	1: có, 0: không
11	has_computer	BIT	1: phòng máy, 0: phòng thường
12	description	NVARCHAR(255)	Thông tin bổ sung về phòng
13	created_at	DATETIME2	Thời điểm tạo
14	updated_at	DATETIME2	Thời điểm cập nhật
15	created_by	UNIQUEIDENTIFIER	Người tạo
16	updated_by	UNIQUEIDENTIFIER	Người cập nhật
17	deleted_at	DATETIME2	Thời điểm xóa
18	deleted_by	UNIQUEIDENTIFIER	Người xóa
19	is_active	BIT	Trạng thái hiệu lực
UQ_Rooms(FloorId, RoomName) 	
Bảng schedules			
1	ScheduleId	PK UNIQUEIDENTIFIER	Khóa chính
2	CourseClassId	 UNIQUEIDENTIFIER	FK → course_sections.id Mã lớp học phần (là lớp ghép hoặc ko ghép)
3	EmployeeId	 UNIQUEIDENTIFIER    NULL      -- FK Instructors(InstructorId Cố vấn học tập
SemesterId FK  UNIQUEIDENTIFIER
4	RoomId	UNIQUEIDENTIFIER	FK  →  rooms.id Phòng
5	day_of_week	INT	Thứ trong tuần
6	date	UNIQUEIDENTIFIER	Ngày cụ thể (dùng cho lịch chi tiết)
7	shift	NVARCHAR(50)	Ca học (Sáng / Chiều / Tối)
TimeSlotId FK  UNIQUEIDENTIFIER  -> TimeSlots
10	number_of_periods	INT	– Số tiết (có thể tính: end - start + 1)
11	start_date	DATETIME2	Thời gian bắt đầu của học phần
12	end_date	DATETIME2	Thời gian kết thúc của học phần
13	mode	NVARCHAR(100)	Hình thức: ONLINE / OFFLINE / HYBRID
14	status	NVARCHAR(255)	Trạng thái:DRAFT (lịch nháp)/OFFICIAL (chính thức)/CANCELLED (hủy)/COMPLETED (đã dạy)
15	description	NVARCHAR(255)	Thông tin bổ sung về phòng
16	schedule_status	VARCHAR(50)	Trạng thái lịch
17	note	NVARCHAR(255)	Ghi chú: Đổi phòng học, đổi giờ học lùi lại, học bù, ...
18	created_at	DATETIME2	Thời điểm tạo
19	updated_at	DATETIME2	Thời điểm cập nhật
20	created_by	UNIQUEIDENTIFIER	Người tạo
21	updated_by	UNIQUEIDENTIFIER	Người cập nhật
22	deleted_at	DATETIME2	Thời điểm xóa
23	deleted_by	UNIQUEIDENTIFIER	Người xóa
24	is_active	BIT	Trạng thái hiệu lực				
Bảng time_slots			
1	TimeSlotId  PK	UNIQUEIDENTIFIER	Khóa chính của ca học.
2	slot_code	NVARCHAR(50)	Mã ca học (Ca1, Ca2, Sáng 1, …).
3	start_time	TIME	Giờ bắt đầu.
4	end_time	TIME	Giờ kết thúc.
5	is_active	BIT	Trạng thái hiệu lực.
6	created_at	DATETIME2	Thời điểm tạo
7	updated_at	DATETIME2	Thời điểm cập nhật
8	created_by	UNIQUEIDENTIFIER	Người tạo
9	updated_by	UNIQUEIDENTIFIER	Người cập nhật
10	deleted_at	DATETIME2	Thời điểm xóa
11	deleted_by	UNIQUEIDENTIFIER	Người xóa
19	is_active	BIT	Trạng thái hiệu lực
VIII. NHÓM ĐIỂM – ĐÁNH GIÁ HỌC TẬP
TABLE grade_components ( Điểm thành phần )
1 GradeComponentId   UNIQUEIDENTIFIER   Mã thành phần điểm
2 CourseId  UNIQUEIDENTIFIER   Mã học phần
component_code	VARCHAR(20)	Mã thành phần (CC,KTTX, GK, CK,...).
3 component_name VARCHAR(100)   Tên thành phần điểm
weight_percentage	DECIMAL(5, 2)	"Trọng số (%) của thành phần điểm= Tổng hết là 100%
(Chuyên cần: 10%, Giữa kỳ:15%, KTTTX:25%, Cuối kỳ:50%)"
min_score	DECIMAL(4, 2)	Điểm tối thiểu để đạt thành phần này.
max_score	DECIMAL(4, 2)	Điểm tối đa (thường là 10.00).
is_required	BIT	1: Bắt buộc phải có điểm; 0: Không bắt buộc.
input_order	INT	Thứ tự hiển thị khi nhập điểm.
5 description    VARCHAR(255)   Ghi chú
6 created_at DATETIME2  Ngày nhập
7 updated_at DATETIME2  Ngày cập nhật
8 delete_at  DATETIME2  Ngày xóa
9 created_by UNIQUEIDENTIFIER   Người nhập
10updated_by UNIQUEIDENTIFIER   Người cập nhật
11delete_by  UNIQUEIDENTIFIER   Người xóa
12is_active  BIT    Trạng thái hiệu lực
unique: UQ_GradeComponents(CourseId, ComponentCode)
IX_GradeComponents_CourseId(CourseId)
GradeComponents(ComponentId PK, CourseId FK, ComponentName, Weight, OrderIndex, ...)

TABLE student_grades ( Điểm sinh viên theo học phần)
CourseRegistrationId PK/FK  UNIQUEIDENTIFIER
GradeComponentId PK/FK UNIQUEIDENTIFIER  Mã thành phần điểm
5 score  DECIMAL(4,2)   Điểm thành phần Điểm số thực tế (0.00 - 10.00).
is_locked	BIT	1: Đã khóa (không được sửa); 0: Đang nhập.
note	NVARCHAR(255)	Ghi chú (Vắng thi, hoãn thi...).
created_at DATETIME2  Ngày nhập
updated_at DATETIME2  Ngày cập nhật
delete_at  DATETIME2  Ngày xóa
created_by UNIQUEIDENTIFIER   Người nhập
updated_by UNIQUEIDENTIFIER   Người cập nhật
delete_by  UNIQUEIDENTIFIER   Người xóa
is_active  BIT    Trạng thái hiệu lực
StudentGrades(CourseRegistrationId, GradeComponentId, Score, …)
Unique: UQ_StudentGrades(CourseRegistrationId, GradeComponentId)
Bảng student_summaries	( tổng kết học phần)		
CourseRegistrationId PK/FK  UNIQUEIDENTIFIER (1-1 với CourseRegistrations)
3	total_score	DECIMAL(4, 2)	Điểm tổng kết hệ 10 (Sau khi nhân trọng số).
4	GradeScaleId FK	UNIQUEIDENTIFIER	Khóa ngoại → grade_scales.id.
5	letter_grade	VARCHAR(2)	Điểm chữ (A, B+, C...).
6	gpa_value	DECIMAL(3, 2)	Điểm hệ 4.
7	result	VARCHAR(10)	Kết quả cuối cùng (PASS/FAIL).
8	is_finalized	BIT	Trạng thái chốt điểm để đưa vào bảng điểm tổng kết.
9	created_at	DATETIME2	Thời điểm tạo.
10	updated_at	DATETIME2	Thời điểm cập nhật.
11	created_by	UNIQUEIDENTIFIER	Người tạo.
12	updated_by	UNIQUEIDENTIFIER	Người cập nhật.
13	deleted_at	DATETIME2	Thời điểm xóa mềm.
14	deleted_by	UNIQUEIDENTIFIER	Người xóa
15	is_active	BIT	Trạng thái hiệu lực
CourseRegistrationId (FK -> course_registrations.CourseRegistrationId, UNIQUE)
TotalScore, GradeScaleId (FK), LetterGrade, GpaValue, Result, IsFinalized
Thực dụng (đồ án, report nhanh): lưu thêm LetterGrade, GpaValue để khỏi join (chấp nhận denormalize).
Nếu làm vậy, hãy đảm bảo service set theo grade_scales.

TABLE grade_scales (Thang điểm 10”A,B,C,F”)
TABLE grade_scales (Thang điểm 10”A,B,C,F”)
GradeScaleId  UNIQUEIDENTIFIER   Mã thang điểm
scale_name    VARCHAR(100)   Tên thang điểm(A,B+,C...)
min_score DECIMAL(4,2)   Điểm thấp nhất
max_score DECIMAL(4,2)   Điểm cao nhất
letter_grade	VARCHAR(2)	Điểm chữ tương ứng.
gpa_value DECIMAL(3,2)   Giá trị GPA
description   VARCHAR(255)   Ghi chú
created_at    DATETIME2  Ngày tạo
updated_at    DATETIME2  Ngày cập nhật
delete_at DATETIME2  Ngày xóa
created_by    UNIQUEIDENTIFIER   Người nhập
updated_by    UNIQUEIDENTIFIER   Người cập nhật
delete_by UNIQUEIDENTIFIER   Người xóa
is_active BIT    Trạng thái hiệu lực
Unique:
UQ_GradeScales_Letter(ScaleCode) hoặc UQ(letter_grade)
thêm CHECK MinScore <= MaxScore
IX. NHÓM HỌC PHÍ – TÀI CHÍNH
TABLE tuition_fees – Mức học phí
1 TuitionFeeId UNIQUEIDENTIFIER (PK, AI)  Khóa chính Mã định danh duy nhất
TrainingProgramId FK   UNIQUEIDENTIFIER  liên kết với bảng chương trình đào tạo  
2 TrainingProgramcode  FK VARCHAR(20)    Mã chương trình đào tạo    VD: IT, KT, QTKD…
3 TrainingProgramname   FK VARCHAR(255)   Tên chương trình   Tên đầy đủ
4 credit_fee DECIMAL(10,2)  Học phí / tín chỉ  Mức học phí tính cho một tín chỉ
5 total_fee  DECIMAL(12,2)  Học phí trọn gói   Tổng học phí trọn gói
6 training_type  VARCHAR(50)    Chính quy / Liên thông Loại hình đào tạo
7 academic_year  VARCHAR(20)    Năm học áp dụng    Năm học áp dụng mức học phí
effective_date	DATE	Ngày bắt đầu áp dụng mức phí.
9 created_at DATETIME   Ngày tạo   Thời điểm tạo
10    updated_at DATETIME   Ngày cập nhật  Thời điểm cập nhật
11    created_by INT    Người tạo  ID người dùng tạo
12    updated_by INT    Người cập nhật ID người dùng cập nhật
13    deleted_at DATETIME   Ngày xóa   Thời điểm xóa mềm
14    deleted_by INT    Người xóa  ID người dùng xóa
15    is_active  TINYINT    Trạng thái hoạt động   1: hoạt động, 0: không
TABLE student_tuition – Học phí sinh viên theo học kỳ
1 StudentTuitionId UNIQUEIDENTIFIER (PK, AI)  Khóa chính Mã định danh học phí
2 StudentId UNIQUEIDENTIFIER (FK)  Mã sinh viên   Liên kết bảng sinh viên
3 SemesterId     UNIQUEIDENTIFIER FK REFERENCES Semesters(SemesterId)
TuitionFeeId	UNIQUEIDENTIFIER	FK -> tuition_fees
5 total_credits  INT    Tổng số tín chỉ    Số tín chỉ đăng ký
7 discount   DECIMAL(10,2)  Miễn giảm  Học bổng, chính sách
raw_amount	DECIMAL(15, 2)	Tổng tiền gốc (tín chỉ x đơn giá).
8 payable_amount DECIMAL(12,2)  Số tiền phải đóng  Sau khi giảm
9 paid_amount    DECIMAL(12,2)  Số tiền đã đóng    Đã đóng
Debt_amount 	DECIMAL(15, 2)	Số tiền còn nợ.
10    payment_status VARCHAR(30)    Đã đóng / Chưa đóng    Trạng thái học phí
11    due_date   DATE   Hạn đóng   Hạn cuối đóng
12    note   TEXT   Ghi chú    Ghi chú liên quan
13    created_at DATETIME   Ngày tạo   Ngày tạo bản ghi
14    updated_at DATETIME   Ngày cập nhật  Ngày cập nhật
15    created_by INT (FK)   Người tạo  Mã người dùng tạo
16    updated_by INT (FK)   Người cập nhật Mã người dùng cập nhật
17    deleted_at DATETIME   Ngày xóa   Xóa mềm
18    deleted_by INT (FK)   Người xóa  Mã người dùng xóa
19    is_active  TINYINT    Trạng thái 1: hoạt động, 0: không
UQ_StudentTuitions(StudentId, SemesterId) (mỗi kỳ 1 bản ghi học phí)
IX_StudentTuitions_SemesterId

TABLE payments – Lịch sử thanh toán
1 PaymentId UNIQUEIDENTIFIER (PK, AI)  Khóa chính Mã giao dịch
2 StudentTuitionId  UNIQUEIDENTIFIER (FK)  Liên kết học phí SV    Liên kết đến học phí học kỳ
4 payment_date   DATETIME   Ngày thanh toán    Ngày và giờ
5 amount DECIMAL(12,2)  Số tiền thanh toán Số tiền đã thanh toán
6 payment_method VARCHAR(50)    Tiền mặt / Chuyển khoản    Phương thức thanh toán
7 transaction_code   VARCHAR(100)   Mã giao dịch   Nếu chuyển khoản
8 payment_status VARCHAR(30)    Thành công / Thất bại  Trạng thái giao dịch
9 cashier    VARCHAR(100)   Người thu  Người thu tiền
10    note   TEXT   Ghi chú    Ghi chú bổ sung
11    created_at DATETIME   Ngày tạo   Thời điểm ghi nhận
12    updated_at DATETIME   Ngày cập nhật  Cập nhật gần nhất
13    created_by INT    Người tạo  ID người tạo
14    updated_by INT    Người cập nhật ID người cập nhật
15    deleted_at DATETIME   Ngày xóa   Xóa mềm
16    deleted_by INT    Người xóa  ID người xóa
IX_Payments_StudentTuitionId
Check constraint:
Amount > 0
PaidAmount <= PayableAmount (cái này khó bằng check nếu PaidAmount là aggregate; thường enforce ở app)

X. NHÓM QUẢN LÝ THI – KHẢO THÍ
1. Bảng exam_types (Loại kỳ thi)			
   1	ExamTypeId  PK	UNIQUEIDENTIFIER	Khóa chính
   2	name	NVARCHAR(100)	Tên loại kỳ thi (Giữa kỳ, Cuối kỳ...)
   3	description	NVARCHAR(MAX)	Mô tả chi tiết
   4	created_at	DATETIME2	Thời điểm tạo
   5	updated_at	DATETIME2	Thời điểm cập nhật
   6	created_by	UNIQUEIDENTIFIER	Người tạo
   7	updated_by	UNIQUEIDENTIFIER	Người cập nhật
   8	deleted_at	DATETIME2	Thời điểm xóa
   9	deleted_by	UNIQUEIDENTIFIER	Người xóa
   10	is_active	BIT	Trạng thái hiệu lực			
   Bảng 2: exams (Lịch thi)			
   1	ExamId	PK  UNIQUEIDENTIFIER	Khóa chính.
   2	ExamTypeId   FK	UNIQUEIDENTIFIER	Khóa ngoại → exam_types.id.
   3	CourseClassId	UNIQUEIDENTIFIER	Khóa ngoại → courses.id
   4	SemesterId	UNIQUEIDENTIFIER	Khóa ngoại → semesters.id
   5	exam_date	DATE	Ngày tổ chức thi.
   6	start_time	TIME	Giờ bắt đầu.
   7	duration_minutes	SMALLINT	Thời gian làm bài
   8	end_time	TIME	Thời gian kết thúc
   9	exam_format	VARCHAR(20)	Thể loại thi( trắc nghiệm, thi máy, vấn đáp, thực hành,..)
   10	exam_status	VARCHAR(20)	Trạng thái thi(Đã lên lịch, đang diễn ra, kết thúc, hoãn thi,...)
   11	supervisor_count	TINYINT	Số lượng cán bộ coi thi
   12	created_at	DATETIME2	Thời điểm tạo.
   13	updated_at	DATETIME2	Thời điểm cập nhật.
   14	created_by	UNIQUEIDENTIFIER	Người tạo.
   15	updated_by	UNIQUEIDENTIFIER	Người cập nhật.
   16	deleted_at	DATETIME2	Thời điểm xóa.
   17	deleted_by	UNIQUEIDENTIFIER	Người xóa.
   18	is_active	BIT	Trạng thái hiệu lực.
   Bảng 3: exam_rooms (Phòng thi)			
   1	ExamRoomId  PK	UNIQUEIDENTIFIER	Khóa chính
   2	ExamId	FK  UNIQUEIDENTIFIER	Khóa ngoại (Liên kết exams)
   3	RoomId	FK    UNIQUEIDENTIFIER	Khóa ngoại (Liên kết rooms.id)
   4	capacity	INT	Sức chứa
   5	created_at	DATETIME2	Thời điểm tạo
   6	updated_at	DATETIME2	Thời điểm cập nhật
   7	created_by	UNIQUEIDENTIFIER	Người tạo
   8	updated_by	UNIQUEIDENTIFIER	Người cập nhật
   9	deleted_at	DATETIME2	Thời điểm xóa
   10	deleted_by	UNIQUEIDENTIFIER	Người xóa
   11	is_active	BIT	Trạng thái hiệu lực		
   Bảng 4: exam_registrations (Danh sách thí sinh)			
   1	ExamRegistrationId   PK	UNIQUEIDENTIFIER	Khóa chính
   2	ExamId	FK   UNIQUEIDENTIFIER	Khóa ngoại (Liên kết exams)
   3	ExamRoomId  FK	UNIQUEIDENTIFIER	Khóa ngoại (Liên kết exam_rooms)
   4	StudentId	FK  UNIQUEIDENTIFIER	ID sinh viên liên kết với Students
   5	roll_number	VARCHAR(20)	Số báo danh
   6	created_at	DATETIME2	Thời điểm tạo
   7	updated_at	DATETIME2	Thời điểm cập nhật
   8	created_by	UNIQUEIDENTIFIER	Người tạo
   9	updated_by	UNIQUEIDENTIFIER	Người cập nhật
   10	deleted_at	DATETIME2	Thời điểm xóa
   11	deleted_by	UNIQUEIDENTIFIER	Người xóa
   12	is_active	BIT	Trạng thái hiệu lực		
   Bảng 5: exam_results (Kết quả thi)			
   1	ExamResultId  PK	UNIQUEIDENTIFIER	Khóa chính
   2	RegistrationId  FK	UNIQUEIDENTIFIER	Khóa ngoại (Liên kết exam_registrations)
   3	score	DECIMAL(4, 2)	Điểm số
   4	status	NVARCHAR(50)	Trạng thái (Đạt, Vắng, Vi phạm...)
   5	graded_by	UNIQUEIDENTIFIER	Người chấm điểm
   6	graded_at	DATETIME	Thời gian chấm điểm
   7	is_locked	BIT	Đã chốt điểm thi
   8	appeal_status	VARCHAR(20)	Trạng thái phúc khảo
   9	created_at	DATETIME2	Thời điểm tạo
   10	updated_at	DATETIME2	Thời điểm cập nhật
   11	created_by	UNIQUEIDENTIFIER	Người tạo
   12	updated_by	UNIQUEIDENTIFIER	Người cập nhật
   13	deleted_at	DATETIME2	Thời điểm xóa
   14	deleted_by	UNIQUEIDENTIFIER	Người xóa
   15	is_active	BIT	Trạng thái hiệu lực			
   Bảng 6: exam_papers (Đề thi)			
   1	ExamPaperId   PK	UNIQUEIDENTIFIER	Khóa chính
   2	ExamId	FK UNIQUEIDENTIFIER	Khóa ngoại (Liên kết exams)
   3	paper_code	VARCHAR(20)	Mã đề thi
   4	file_url	    NVARCHAR(500)	      Đường dẫn file đề
   5	created_at	DATETIME2	Thời điểm tạo
   6	updated_at	DATETIME2	Thời điểm cập nhật
   7	created_by	UNIQUEIDENTIFIER	Người tạo
   8	updated_by	UNIQUEIDENTIFIER	Người cập nhật
   9	deleted_at	DATETIME2	Thời điểm xóa
   10	deleted_by	UNIQUEIDENTIFIER	Người xóa
   11	is_active	BIT	Trạng thái hiệu lực
   XI. NHÓM QUẢN LÝ TỐT NGHIỆP
   TABLE graduation_conditions (Điều kiện xét tốt nghiệp)
   1 GraduationConditionId UNIQUEIDENTIFIER   Khóa chính
   TrainingProgramId  FK UNIQUEIDENTIFIER  liên kết với bảng chương trình đào tạo
   AcademicCohortId    FK UNIQUEIDENTIFIER  liên kết với niên khoá K22/K23
   2 condition_code NVARCHAR(50)   Mã điều kiện
   3 condition_name NVARCHAR(200)  Tên điều kiện
   4 min_credits    INT    Số tín chỉ tối thiểu
   5 min_gpa    FLOAT  GPA tối thiểu
   6 max_failed_courses INT    Số chỉ rớt tối đa
   english_requirement	NVARCHAR(100)	Chuẩn ngoại ngữ
   it_requirement	NVARCHAR(100)	Chuẩn tin học
   conduct_required	NVARCHAR(50)	Hạnh kiểm yêu cầu
   8 description    NVARCHAR(255)  Mô tả chi tiết
   9 start_date DATE   Ngày bắt đầu áp dụng
   10    due_date   DATE   Ngày kết thúc áp dụng
   11    created_at DATETIME2  Thời điểm tạo
   12    updated_at DATETIME2  Thời điểm cập nhật
   13    created_by UNIQUEIDENTIFIER   Người tạo
   14    updated_by UNIQUEIDENTIFIER   Người cập nhật
   15    deleted_at DATETIME2  Thời điểm xóa
   16    deleted_by UNIQUEIDENTIFIER   Người xóa
   17    is_active  BIT    Trạng thái hiệu lực
   TABLE graduation_results (Kết quả xét tốt nghiệp)
   1 GraduationResultId UNIQUEIDENTIFIER   Khóa chính
   2 StudentId FK UNIQUEIDENTIFIER   Sinh viên được xét
   3 GraduationConditionId  FK  UNIQUEIDENTIFIER   Điều kiện xét áp dụng
   4 total_credits  INT    Tổng tín chỉ đạt
   5 gpa    FLOAT  GPA tại thời điểm xét
   6 failed_courses INT    Số môn chưa đạt
   7 graduation_status  NVARCHAR(50)   Kết quả xét
   8 graduation_rank    NVARCHAR(50)   Xếp loại tốt nghiệp
   9 decision_number    NVARCHAR(50)   Số quyết định
   GraduationCouncilId FK	UNIQUEIDENTIFIER	Người/phòng xét
   10    decision_date  DATE   Ngày ra quyết định
   11    start_date DATE   Thời điểm hiệu lực
   12    due_date   DATE   Thời điểm hết hiệu lực
   note	               NVARCHAR(MAX)	Ghi chú
   13    created_at DATETIME2  Thời điểm tạo
   14    updated_at DATETIME2  Thời điểm cập nhật
   15    created_by UNIQUEIDENTIFIER   Người tạo
   16    updated_by UNIQUEIDENTIFIER   Người cập nhật
   17    deleted_at DATETIME2  Thời điểm xóa
   18    deleted_by UNIQUEIDENTIFIER   Người xóa
   19    is_active  BIT    Trạng thái hiệu lực
   TABLE graduation_sessions (Đợt xét tốt nghiệp)
   1 GraduationSessionId UNIQUEIDENTIFIER   Khóa chính
   2 session_code   NVARCHAR(50)   Mã đợt xét
   3 session_name   NVARCHAR(200)  Tên đợt xét
   4 AcademicCohortId FK UNIQUEIDENTIFIER   Năm học
     SemesterId    UNIQUEIDENTIFIER FK REFERENCES semesters(SemesterId)
   6 start_date DATE   Ngày bắt đầu xét
   7 due_date   DATE   Ngày kết thúc xét
   8 description    NVARCHAR(255)  Mô tả
   9 created_at DATETIME2  Thời điểm tạo
   10    updated_at DATETIME2  Thời điểm cập nhật
   11    created_by UNIQUEIDENTIFIER   Người tạo
   12    updated_by UNIQUEIDENTIFIER   Người cập nhật
   13    deleted_at DATETIME2  Thời điểm xóa
   14    deleted_by UNIQUEIDENTIFIER   Người xóa
   15    is_active  BIT    Trạng thái hiệu lực
   TABLE graduation_councils (Hội đồng xét tốt nghiệp)
   1 GraduationCouncilId UNIQUEIDENTIFIER   Khóa chính
   2 council_code   NVARCHAR(50)   Mã hội đồng
   3 council_name   NVARCHAR(200)  Tên hội đồng
   4 AcademicCohortId FK UNIQUEIDENTIFIER     Năm học
   SemesterId    UNIQUEIDENTIFIER FK REFERENCES Semesters(SemesterId)
   6 decision_number    NVARCHAR(50)   Số quyết định thành lập
   7 decision_date  DATE   Ngày ra quyết định
   8 chairman_id    UNIQUEIDENTIFIER   Chủ tịch hội đồng
   9 secretary_id   UNIQUEIDENTIFIER   Thư ký hội đồng
   10    description    NVARCHAR(255)  Ghi chú
   11    start_date DATE   Ngày bắt đầu hoạt động
   12    end_date   DATE   Ngày kết thúc
   13    created_at DATETIME2  Thời điểm tạo
   14    updated_at DATETIME2  Thời điểm cập nhật
   15    created_by UNIQUEIDENTIFIER   Người tạo
   16    updated_by UNIQUEIDENTIFIER   Người cập nhật
   17    deleted_at DATETIME2  Thời điểm xóa
   18    deleted_by UNIQUEIDENTIFIER   Người xóa
   19    is_active  BIT    Trạng thái hiệu lực
   TABLE graduation_profiles (Hồ sơ xét tốt nghiệp)
   1 GraduationProfileId UNIQUEIDENTIFIER   Khóa chính
   2 StudentId FK UNIQUEIDENTIFIER   Sinh viên
   3 council_id UNIQUEIDENTIFIER   Hội đồng xét
   4 GraduationConditionId  FK  UNIQUEIDENTIFIER     Điều kiện xét
   5 profile_code   NVARCHAR(50)   Mã hồ sơ
   6 submission_date    DATE   Ngày nộp hồ sơ
   7 status NVARCHAR(50)   Trạng thái hồ sơ
   8 reviewer_id    UNIQUEIDENTIFIER   Người kiểm tra
   9 review_date    DATE   Ngày kiểm tra
   10    note   NVARCHAR(255)  Ghi chú
   11    created_at DATETIME2  Thời điểm tạo
   12    updated_at DATETIME2  Thời điểm cập nhật
   13    created_by UNIQUEIDENTIFIER   Người tạo
   14    updated_by UNIQUEIDENTIFIER   Người cập nhật
   15    deleted_at DATETIME2  Thời điểm xóa
   16    deleted_by UNIQUEIDENTIFIER   Người xóa
   17    is_active  BIT    Trạng thái hiệu lực
   XII. NHÓM THÔNG BÁO – HỆ THỐNG
   TABLE Notifications (Thông báo hệ thống)
   1  NotificationId UNIQUEIDENTIFIER (PK)  ID thông báo
   2 title  NVARCHAR(255)  Tiêu đề thông báo
   3 content    NVARCHAR(MAX)  Nội dung chi tiết
   4 type_id   VARCHAR(50)    Loại thông báo
   5 priority   VARCHAR(20)    Mức độ
   8 target_role_id   UNIQUEIDENTIFIER FK RoleId    Gửi theo vai trò
   11    created_at DATETIME   Thời gian tạo
   12    update_at    DATETIME (NULL)    Thời điểm cập nhật
   13    created_by UNIQUEIDENTIFIER   Người tạo
   14    updated_by UNIQUEIDENTIFIER   Người cập nhật
   15    deleted_at DATETIME2  Thời điểm xóa
   16    deleted_by UNIQUEIDENTIFIER   Người xóa
   13    is_active BIT trạng thái hiệu lực
   TABLE: UserNotifications
   UserNotificationId UNIQUEIDENTIFIER PK
   UserId        UNIQUEIDENTIFIER FK
   NotifitonId FK UNIQUEIDENTIFIER
   Is_read     BIT (0 chưa đọc, 1 đã đọc)
   Reat_at     DATETIME2 thời điểm người dùng đọc được thông báo
   Is_active    BIT trạng thái hiệu lực
   created_at DATETIME   Thời điểm thông báo gửi đến user
   update_at    DATETIME (NULL)    Thời điểm cập nhật
   updated_by UNIQUEIDENTIFIER   Người cập nhật
   deleted_at DATETIME2  Thời điểm xóa
   deleted_by UNIQUEIDENTIFIER   Người xóa

TABLE Logs ( Nhật ký hoạt động)
1 LogId UNIQUEIDENTIFIER (PK, AI)  Khóa chính
2 Userd    UNIQUEIDENTIFIER (FK, NULL)    ID người thực hiện
3 action VARCHAR(50)    Hành động thực hiện
4 table_name VARCHAR(100)   Tên bảng
5 RecordId UNIQUEIDENTIFIER   bảng ghi liên quan
Description NVARCHAR(MAX)  Mô ta chi tiết
Created_at DATETIME2  thời điểm ghi log
Is_active BIT trạng thái hiệu lực
Updated_at DATETIME2    thời điểm cập nhật trnag thái
Deleted_at DATETIME2  thời điểm xoá
Deleted_by    UNIQUEIDENTIFIER người xoá
Updated_by UNIQUEIDENTIFIER người cập nhật
TABLE Settings ( Cấu hình hệ thống)
SettingId UNIQUEIDENTIFIER (PK)  Mã định danh
Key NVARCHAR(100)  tên khoá cấu hình ví dụ : MAX_CREDITS_PER_SEMESTER
Value NVARCHAR( MAX) giá trị của cấu hình
Description NVARCHAR(255)  mô tả tác dụng cấu hình
Is_active BIT   trạng thái hiệu lực
11    created_at DATETIME2  Thời điểm tạo
12    updated_at DATETIME2  Thời điểm cập nhật
13    created_by UNIQUEIDENTIFIER   Người tạo
14    updated_by UNIQUEIDENTIFIER   Người cập nhật
15    deleted_at DATETIME2  Thời điểm xóa
16    deleted_by UNIQUEIDENTIFIER   Người xóa




