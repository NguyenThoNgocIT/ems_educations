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
- PersonId             UNIQUEIDENTIFIER FK NOT NULL REFERENCES Persons(PersonId)
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
- EnrollmentYear     INT                   NULL -- năm nhập hc
- EducationLevel     NVARCHAR(50)          NULL
- TrainingType       NVARCHAR(50)          NULL
- MajorId            UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Majors(MajorId)
- CourseCohort       NVARCHAR(50)          NULL      -- khoá học K20/K21... (đổi tên tránh trùng với "Course" môn học) 
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
- semester       UNIQUEIDENTIFIER FK NOT NULL REFERENCES semester(semesterId)          -- HK1/HK2/HE
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
5) Teaching / phân công giảng dạy
   TABLE: TeachingAssignments (PHAN_CONG_GIANG_DAY)
- AssignmentId   UNIQUEIDENTIFIER  PK  NOT NULL DEFAULT(NEWID())     -- thay INT bằng GUID theo chuẩn bạn chốt
- InstructorId   UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Instructors(EmployeeId)
- course_class_id    UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Courses(CourseId)      -- mon_hoc_id
- ClassId        UNIQUEIDENTIFIER  FK  NOT NULL REFERENCES Classes(ClassId)         -- lop_hoc_id
- semester       UNIQUEIDENTIFIER FK NOT NULL REFERENCES semester(semesterId)          -- HK1/HK2/HE                       -- hoc_ky (VD: HK1, HK2, HE)
- SchoolYear     NVARCHAR(20)          NOT NULL                        -- nam_hoc (VD: 2025-2026)

- Note           NVARCHAR(255)         NULL
- IsActive       BIT                  NOT NULL DEFAULT(1)

- CreatedAt      DATETIME2(3)         NOT NULL DEFAULT(SYSDATETIME())
- CreatedBy      UNIQUEIDENTIFIER     NULL
- UpdatedAt      DATETIME2(3)         NULL
- UpdatedBy      UNIQUEIDENTIFIER     NULL

CONSTRAINTS / INDEX:
- IX_TA_InstructorId(EmployeeId)
- IX_TA_CourseId(CourseId)
- IX_TA_ClassId(ClassId)
- UQ_TA UNIQUE(InstructorId, CourseId, ClassId, Semester, SchoolYear)  -- chống phân công trùng

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
  TABLE: TrainingPrograms chương trình đào tạo theo ngành và khoá 
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
  TABLE: Courses   Môn học / học phần 
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
  V. NHÓM QUẢN LÝ HỌC KỲ – LỚP HỌC PHẦN
  Bảng Semesters
  Tên trường	Kiểu dữ liệu	Ý nghĩa
  semesterId	UUID	Khóa chính
  code	VARCHAR(30)	Mã học kỳ
  name	VARCHAR(150)	Tên học kỳ
  academic_year	VARCHAR (20)	Năm học
  start_date	DATE	Ngày bắt đầu
  end_date	DATE	Ngày kết thúc
  status	BIT/TINYINT/ENUM	Trạng thái học kỳ
  created_at	DATETIME2	Thời điểm tạo
  updated_at	DATETIME2	Thời điểm cập nhật
  description	TEXT	Ghi chú
  deleted_at	DATETIME2	Thời điểm xóa mềm
  created_by	UUID	Người tạo
  updated_by	UUID	Người cập nhật
  deleted_by	UUID	Người xóa
Bảng Course_class   Lớp học phần mở theo học kỳ
  Tên Trường	Kiểu dữ liệu	Ý nghĩa
  CourseClassId	UNIQUEIDENTIFIER	Khóa chính
  class_code	NVARCHAR(50)	Mã lớp học phần
  max_student	INT	Sĩ số tối đa
  current_student	INT	Sĩ số hiện tại
  schedule	NVARCHAR(255)	Lịch học
  room	NVARCHAR(50)	Phòng học
  status	NVARCHAR(20)	Trạng thái lớp
  semester_id	UNIQUEIDENTIFIER (FK)	Học kỳ
  created_at	DATETIME2	Thời điểm tạo
  updated_at	DATETIME2	Thời điểm cập nhật
  deleted_at	DATETIME2 NULL	Thời điểm xóa
  created_by	UNIQUEIDENTIFIER NULL	Người tạo
  updated_by	UNIQUEIDENTIFIER NULL	Người cập nhật
  deleted_by	UNIQUEIDENTIFIER NULL	Người xóa
Bảng lecturer_course_classes
  Tên Trường	Kiểu dữ liệu	Ý Nghĩa
  id	UNIQUEIDENTIFIER	Khóa chính
  lecturer_id	UNIQUEIDENTIFIER NOT NULL	Khóa ngoại tới giảng viên
  course_class_id	UNIQUEIDENTIFIER NOT NULL	Khóa ngoại tới lớp học phần
  role	NVARCHAR(50) NOT NULL	Vai trò giảng viên
  created_at	DATETIME2	Thời điểm tạo
  updated_at	DATETIME2	Thời điểm cập nhật
  created_by	UNIQUEIDENTIFIER	Người tạo
  updated_by	UNIQUEIDENTIFIER	Người cập nhật
  deleted_at	DATETIME2	Thời điểm xóa
  deleted_by	UNIQUEIDENTIFIER	Người xóa
  is_active	BIT	Trạng thái hiệu lực
  Bảng Lecturer
  Tên Trường	Kiểu dữ liệu	Ý Nghĩa
  ID	UNIQUEIDENTIFIER	Khóa chính
  lecturer_code	VARCHAR(20) NOT NULL UNIQUE	Mã giảng viên
  full_name	NVARCHAR(100) NOT NULL	Họ tên giảng viên
  email	VARCHAR(100) UNIQUE	Email
  department_id	UNIQUEIDENTIFIER NULL	Mã khoa/bộ môn
  created_at	DATETIME2	Thời điểm tạo
  updated_at	DATETIME2	Thời điểm cập nhật
  created_by	UNIQUEIDENTIFIER	Người tạo
  updated_by	UNIQUEIDENTIFIER	Người cập nhật
  deleted_at	DATETIME2	Thời điểm xóa
  deleted_by	UNIQUEIDENTIFIER	Người xóa
  is_active	BIT	Trạng thái hiệu lực
  VI. NHÓM ĐĂNG KÝ HỌC PHẦN
  Bảng course_registrations
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UUID	Khóa chính
  2	student_id	UUID	Khóa ngoại, mã sinh viên
  3	course_id	UUID	Khóa ngoại, mã học phần
  4	class_id	UUID	Khóa ngoại, mã lớp học phần
  5	semester_id	UUID	Khóa ngoại, học kỳ
  6	registration_code	VARCHAR(30)	Mã đăng ký học phần
  7	registration_date	DATETIME2	Thời điểm đăng ký
  8	status	TINYINT / ENUM	Trạng thái đăng ký
  9	is_first_time	BIT	Lần đầu hay học lại
  10	attempt	INT	Số lần đăng ký
  11	score_midterm	FLOAT NULL	Điểm giữa kỳ
  12	score_final	FLOAT NULL	Điểm cuối kỳ
  13	score_total	FLOAT NULL	Điểm tổng kết
  14	result	TINYINT / ENUM	Kết quả học phần
  15	note	NVARCHAR(255)	Ghi chú
  16	created_at	DATETIME2	Thời điểm tạo
  17	updated_at	DATETIME2	Thời điểm cập nhật
  18	deleted_at	DATETIME2 NULL	Thời điểm xóa mềm
  19	created_by	BIGINT NULL	Người tạo
  20	updated_by	BIGINT NULL	Người cập nhật
  Bảng registration_periods
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UUID	Khóa chính
  2	code	VARCHAR(30)	Mã đợt đăng ký
  3	name	VARCHAR(150)	Tên đợt đăng ký
  4	semester_id	UUID (FK)	Liên kết học kỳ
  5	start_date	DATETIME	Bắt đầu đăng ký
  6	end_date	DATETIME	Kết thúc đăng ký
  7	status	TINYINT / ENUM	Trạng thái đợt đăng ký
  8	min_credits	INT	Số tín chỉ tối thiểu
  9	max_credits	INT	Số tín chỉ tối đa
  10	description	TEXT	Ghi chú
  11	created_at	DATETIME2	Thời điểm tạo
  12	updated_at	DATETIME2	Thời điểm cập nhật
  13	deleted_at	DATETIME2 NULL	Thời điểm xóa mềm
  14	created_by	BIGINT NULL	Người tạo
  15	updated_by	BIGINT NULL	Người cập nhật
  VII. NHÓM QUẢN LÝ LỊCH HỌC – PHÒNG HỌC
  Bảng rooms
  TÊN TRƯỜNG	KIỂU DỮ LIỆU	CHỨC NĂNG / Ý NGHĨA
  room_id	UNIQUEIDENTIFIER (PK)	Mã định danh
  room_name	VARCHAR	Số phòng
  building_id	UNIQUEIDENTIFIER (FK)	Liên kết đến bảng buildings
  capacity	INT	Sức chứa tối đa
  room_type	ENUM	Loại phòng
  status	VARCHAR(20)	Trạng thái phòng
  created_at	UNIQUEIDENTIFIER	Ngày tạo
  created_by	UNIQUEIDENTIFIER	Người tạo
  updated_at	UNIQUEIDENTIFIER	Ngày cập nhật
  updated_by	UNIQUEIDENTIFIER	Người cập nhật
  deleted_at	UNIQUEIDENTIFIER	Thời điểm xóa
  deleted_by	UNIQUEIDENTIFIER	Người xóa
  is_active	BIT	Trạng thái hiệu lực
  Bảng buildings
  TÊN TRƯỜNG	KIỂU DỮ LIỆU	CHỨC NĂNG / Ý NGHĨA
  building_id	UNIQUEIDENTIFIER (PK)	Mã định danh
  building_name	VARCHAR	Tên tòa nhà
  address	TEXT	Địa chỉ chi tiết
  description	TEXT	Ghi chú
  created_at	UNIQUEIDENTIFIER	Ngày tạo
  created_by	UNIQUEIDENTIFIER	Người tạo
  updated_at	UNIQUEIDENTIFIER	Ngày cập nhật
  updated_by	UNIQUEIDENTIFIER	Người cập nhật
  deleted_at	UNIQUEIDENTIFIER	Thời điểm xóa
  deleted_by	UNIQUEIDENTIFIER	Người xóa
  is_active	BIT	Trạng thái hiệu lực
  Bảng schedules
  TÊN TRƯỜNG	KIỂU DỮ LIỆU	CHỨC NĂNG / Ý NGHĨA
  schedule_id	UNIQUEIDENTIFIER (PK)	Mã định danh
  course_class_id	UNIQUEIDENTIFIER (FK)	Liên kết với lớp học phần
  room_id	UNIQUEIDENTIFIER (FK)	Liên kết với phòng học
  day_of_week	TINYINT	Thứ trong tuần
  start_period	INT	Tiết bắt đầu
  end_period	INT	Tiết kết thúc
  semester_id	UNIQUEIDENTIFIER (FK)	Học kỳ
  created_at	UNIQUEIDENTIFIER	Ngày tạo
  created_by	UNIQUEIDENTIFIER	Người tạo
  updated_at	UNIQUEIDENTIFIER	Ngày cập nhật
  updated_by	UNIQUEIDENTIFIER	Người cập nhật
  deleted_at	UNIQUEIDENTIFIER	Thời điểm xóa
  deleted_by	UNIQUEIDENTIFIER	Người xóa
  is_active	BIT	Trạng thái hiệu lực
  VIII. NHÓM ĐIỂM – ĐÁNH GIÁ HỌC TẬP
  Bảng grade_components
  STT	Tên trường	Kiểu dữ liệu	Chức năng
  1	component_id	UNIQUEIDENTIFIER	Mã thành phần điểm
  2	course_id	UNIQUEIDENTIFIER	Mã học phần
  3	component_name	VARCHAR(100)	Tên thành phần điểm
  4	weight	DECIMAL(5,2)	Phần trăm
  5	description	VARCHAR(255)	Ghi chú
  6	created_at	DATETIME2	Ngày nhập
  7	updated_at	DATETIME2	Ngày cập nhật
  8	delete_at	DATETIME2	Ngày xóa
  9	created_by	UNIQUEIDENTIFIER	Người nhập
  10	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  11	delete_by	UNIQUEIDENTIFIER	Người xóa
  12	is_active	BIT	Trạng thái hiệu lực
  Bảng student_grades
  STT	Tên trường	Kiểu dữ liệu	Chức năng
  1	grade_id	UNIQUEIDENTIFIER	Mã bản ghi điểm
  2	student_id	UNIQUEIDENTIFIER	Mã sinh viên
  3	course_id	UNIQUEIDENTIFIER	Mã học phần
  4	component_id UNIQUEIDENTIFIER	Mã thành phần điểm
  5	score	DECIMAL(4,2)	Điểm thành phần
  6	final_score	DECIMAL(4,2)	Điểm tổng kết
  7	grade_letter	CHAR(2)	Điểm chữ
  8	status	VARCHAR(20)	Trạng thái điểm
  9	attempt	INT	Lần học
  10	created_at	DATETIME2	Ngày nhập
  11	updated_at	DATETIME2	Ngày cập nhật
  12	delete_at	DATETIME2	Ngày xóa
  13	created_by	UNIQUEIDENTIFIER	Người nhập
  14	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  15	delete_by	UNIQUEIDENTIFIER	Người xóa
  16	is_active	BIT	Trạng thái hiệu lực
  Bảng grade_scales
  Tên trường	Kiểu dữ liệu	Chức năng
  scale_id	UNIQUEIDENTIFIER	Mã thang điểm
  scale_name	VARCHAR(100)	Tên thang điểm
  min_score	DECIMAL(4,2)	Điểm thấp nhất
  max_score	DECIMAL(4,2)	Điểm cao nhất
  grade_letter	CHAR(2)	Điểm chữ
  gpa_value	DECIMAL(3,2)	Giá trị GPA
  description	VARCHAR(255)	Ghi chú
  created_at	DATETIME2	Ngày tạo
  updated_at	DATETIME2	Ngày cập nhật
  delete_at	DATETIME2	Ngày xóa
  created_by	UNIQUEIDENTIFIER	Người nhập
  updated_by	UNIQUEIDENTIFIER	Người cập nhật
  delete_by	UNIQUEIDENTIFIER	Người xóa
  is_active	BIT	Trạng thái hiệu lực
  IX. NHÓM HỌC PHÍ – TÀI CHÍNH
  Bảng tuition_fees – Mức học phí
  STT	Tên trường	Kiểu dữ liệu	Mô tả	Ý nghĩa
  1	id	UNIQUEIDENTIFIER (PK, AI)	Khóa chính	Mã định danh duy nhất
  2	program_code	VARCHAR(50)	Mã chương trình đào tạo	VD: IT, KT, QTKD…
  3	program_name	VARCHAR(100)	Tên chương trình	Tên đầy đủ
  4	credit_fee	DECIMAL(10,2)	Học phí / tín chỉ	Mức học phí tính cho một tín chỉ
  5	total_fee	DECIMAL(12,2)	Học phí trọn gói	Tổng học phí trọn gói
  6	training_type	VARCHAR(50)	Chính quy / Liên thông	Loại hình đào tạo
  7	academic_year	VARCHAR(20)	Năm học áp dụng	Năm học áp dụng mức học phí
  8	status	TINYINT	1: áp dụng, 0: ngưng	Trạng thái áp dụng
  9	created_at	DATETIME	Ngày tạo	Thời điểm tạo
  10	updated_at	DATETIME	Ngày cập nhật	Thời điểm cập nhật
  11	created_by	INT	Người tạo	ID người dùng tạo
  12	updated_by	INT	Người cập nhật	ID người dùng cập nhật
  13	deleted_at	DATETIME	Ngày xóa	Thời điểm xóa mềm
  14	deleted_by	INT	Người xóa	ID người dùng xóa
  15	is_active	TINYINT	Trạng thái hoạt động	1: hoạt động, 0: không
  Bảng student_tuition – Học phí sinh viên theo học kỳ
  STT	Tên trường	Kiểu dữ liệu	Mô tả	Ý nghĩa
  1	id	UNIQUEIDENTIFIER (PK, AI)	Khóa chính	Mã định danh học phí
  2	student_id	UNIQUEIDENTIFIER (FK)	Mã sinh viên	Liên kết bảng sinh viên
  3	semester_id	 UNIQUEIDENTIFIER FK REFERENCES semester(SemesterId)
  4	academic_year	VARCHAR(20)	Năm học	Năm học của học kỳ
  5	total_credits	INT	Tổng số tín chỉ	Số tín chỉ đăng ký
  6	tuition_fee	DECIMAL(12,2)	Tổng học phí	Tính theo số tín chỉ
  7	discount	DECIMAL(10,2)	Miễn giảm	Học bổng, chính sách
  8	payable_amount	DECIMAL(12,2)	Số tiền phải đóng	Sau khi giảm
  9	paid_amount	DECIMAL(12,2)	Số tiền đã đóng	Đã đóng
  10	payment_status	VARCHAR(30)	Đã đóng / Chưa đóng	Trạng thái học phí
  11	due_date	DATE	Hạn đóng	Hạn cuối đóng
  12	note	TEXT	Ghi chú	Ghi chú liên quan
  13	created_at	DATETIME	Ngày tạo	Ngày tạo bản ghi
  14	updated_at	DATETIME	Ngày cập nhật	Ngày cập nhật
  15	created_by	INT (FK)	Người tạo	Mã người dùng tạo
  16	updated_by	INT (FK)	Người cập nhật	Mã người dùng cập nhật
  17	deleted_at	DATETIME	Ngày xóa	Xóa mềm
  18	deleted_by	INT (FK)	Người xóa	Mã người dùng xóa
  19	is_active	TINYINT	Trạng thái	1: hoạt động, 0: không
  Bảng payments – Lịch sử thanh toán
  STT	Tên trường	Kiểu dữ liệu	Mô tả	Ý nghĩa
  1	id	UNIQUEIDENTIFIER (PK, AI)	Khóa chính	Mã giao dịch
  2	student_tuition_id	UNIQUEIDENTIFIER (FK)	Liên kết học phí SV	Liên kết đến học phí học kỳ
  3	student_id	UNIQUEIDENTIFIER (FK)	Mã sinh viên	Mã sinh viên thanh toán
  4	payment_date	DATETIME	Ngày thanh toán	Ngày và giờ
  5	amount	DECIMAL(12,2)	Số tiền thanh toán	Số tiền đã thanh toán
  6	payment_method	VARCHAR(50)	Tiền mặt / Chuyển khoản	Phương thức thanh toán
  7	transaction_code	VARCHAR(100)	Mã giao dịch	Nếu chuyển khoản
  8	payment_status	VARCHAR(30)	Thành công / Thất bại	Trạng thái giao dịch
  9	cashier	VARCHAR(100)	Người thu	Người thu tiền
  10	note	TEXT	Ghi chú	Ghi chú bổ sung
  11	created_at	DATETIME	Ngày tạo	Thời điểm ghi nhận
  12	updated_at	DATETIME	Ngày cập nhật	Cập nhật gần nhất
  13	created_by	INT	Người tạo	ID người tạo
  14	updated_by	INT	Người cập nhật	ID người cập nhật
  15	deleted_at	DATETIME	Ngày xóa	Xóa mềm
  16	deleted_by	INT	Người xóa	ID người xóa
  17	is_active	TINYINT	Trạng thái	1: hoạt động, 0: không
  X. NHÓM QUẢN LÝ THI – KHẢO THÍ
  Bảng exam_types
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	name	NVARCHAR(100)	Tên loại kỳ thi
  3	description	NVARCHAR(255)	Mô tả
  4	created_at	DATETIME2	Thời điểm tạo
  5	updated_at	DATETIME2	Thời điểm cập nhật
  6	created_by	UNIQUEIDENTIFIER	Người tạo
  7	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  8	deleted_at	DATETIME2	Thời điểm xóa
  9	deleted_by	UNIQUEIDENTIFIER	Người xóa
  10	is_active	BIT	Trạng thái hiệu lực
  Bảng exams
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	subject_id	UNIQUEIDENTIFIER	Môn học
  3	exam_type_id	UNIQUEIDENTIFIER	Loại kỳ thi
  4	exam_date	DATE	Ngày thi
  5	start_time	TIME	Giờ bắt đầu
  6	end_time	TIME	Giờ kết thúc
  semester_id	 UNIQUEIDENTIFIER FK REFERENCES semester(SemesterId)
  8	school_year	NVARCHAR(20)	Năm học
  9	created_at	DATETIME2	Ngày tạo
  10	updated_at	DATETIME2	Ngày cập nhật
  11	created_by	UNIQUEIDENTIFIER	Người tạo
  12	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  13	deleted_at	DATETIME2	Thời điểm xóa
  14	deleted_by	UNIQUEIDENTIFIER	Người xóa
  15	is_active	BIT	Trạng thái hiệu lực
  Bảng exam_rooms
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	exam_id	UNIQUEIDENTIFIER	Lịch thi
  3	room_name	NVARCHAR(50)	Tên phòng
  4	max_students	INT	Số SV tối đa
  5	note	NVARCHAR(255)	Ghi chú
  6	created_at	DATETIME2	Ngày tạo
  7	updated_at	DATETIME2	Ngày cập nhật
  8	created_by	UNIQUEIDENTIFIER	Người tạo
  9	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  10	deleted_at	DATETIME2	Thời điểm xóa
  11	deleted_by	UNIQUEIDENTIFIER	Người xóa
  12	is_active	BIT	Trạng thái hiệu lực
  XI. NHÓM QUẢN LÝ TỐT NGHIỆP
  Bảng graduation_conditions
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	condition_code	NVARCHAR(50)	Mã điều kiện
  3	condition_name	NVARCHAR(200)	Tên điều kiện
  4	min_credits	INT	Số tín chỉ tối thiểu
  5	min_gpa	FLOAT	GPA tối thiểu
  6	max_failed_courses	INT	Số môn rớt tối đa
  7	required_certificate	NVARCHAR(100)	Chứng chỉ bắt buộc
  8	description	NVARCHAR(255)	Mô tả chi tiết
  9	start_date	DATE	Ngày bắt đầu áp dụng
  10	due_date	DATE	Ngày kết thúc áp dụng
  11	created_at	DATETIME2	Thời điểm tạo
  12	updated_at	DATETIME2	Thời điểm cập nhật
  13	created_by	UNIQUEIDENTIFIER	Người tạo
  14	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  15	deleted_at	DATETIME2	Thời điểm xóa
  16	deleted_by	UNIQUEIDENTIFIER	Người xóa
  17	is_active	BIT	Trạng thái hiệu lực
  Bảng graduation_results
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	student_id	UNIQUEIDENTIFIER	Sinh viên được xét
  3	condition_id	UNIQUEIDENTIFIER	Điều kiện xét áp dụng
  4	total_credits	INT	Tổng tín chỉ đạt
  5	gpa	FLOAT	GPA tại thời điểm xét
  6	failed_courses	INT	Số môn chưa đạt
  7	graduation_status	NVARCHAR(50)	Kết quả xét
  8	graduation_rank	NVARCHAR(50)	Xếp loại tốt nghiệp
  9	decision_number	NVARCHAR(50)	Số quyết định
  10	decision_date	DATE	Ngày ra quyết định
  11	start_date	DATE	Thời điểm hiệu lực
  12	due_date	DATE	Thời điểm hết hiệu lực
  13	created_at	DATETIME2	Thời điểm tạo
  14	updated_at	DATETIME2	Thời điểm cập nhật
  15	created_by	UNIQUEIDENTIFIER	Người tạo
  16	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  17	deleted_at	DATETIME2	Thời điểm xóa
  18	deleted_by	UNIQUEIDENTIFIER	Người xóa
  19	is_active	BIT	Trạng thái hiệu lực
  Bảng graduation_sessions
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	session_code	NVARCHAR(50)	Mã đợt xét
  3	session_name	NVARCHAR(200)	Tên đợt xét
  4	academic_year	NVARCHAR(20)	Năm học
  semester_id	 UNIQUEIDENTIFIER FK REFERENCES semester(SemesterId)
  6	start_date	DATE	Ngày bắt đầu xét
  7	due_date	DATE	Ngày kết thúc xét
  8	description	NVARCHAR(255)	Mô tả
  9	created_at	DATETIME2	Thời điểm tạo
  10	updated_at	DATETIME2	Thời điểm cập nhật
  11	created_by	UNIQUEIDENTIFIER	Người tạo
  12	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  13	deleted_at	DATETIME2	Thời điểm xóa
  14	deleted_by	UNIQUEIDENTIFIER	Người xóa
  15	is_active	BIT	Trạng thái hiệu lực
  Bảng graduation_councils
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	council_code	NVARCHAR(50)	Mã hội đồng
  3	council_name	NVARCHAR(200)	Tên hội đồng
  4	school_year	NVARCHAR(20)	Năm học
  semester_id	 UNIQUEIDENTIFIER FK REFERENCES semester(SemesterId)
  6	decision_number	NVARCHAR(50)	Số quyết định thành lập
  7	decision_date	DATE	Ngày ra quyết định
  8	chairman_id	UNIQUEIDENTIFIER	Chủ tịch hội đồng
  9	secretary_id	UNIQUEIDENTIFIER	Thư ký hội đồng
  10	description	NVARCHAR(255)	Ghi chú
  11	start_date	DATE	Ngày bắt đầu hoạt động
  12	end_date	DATE	Ngày kết thúc
  13	created_at	DATETIME2	Thời điểm tạo
  14	updated_at	DATETIME2	Thời điểm cập nhật
  15	created_by	UNIQUEIDENTIFIER	Người tạo
  16	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  17	deleted_at	DATETIME2	Thời điểm xóa
  18	deleted_by	UNIQUEIDENTIFIER	Người xóa
  19	is_active	BIT	Trạng thái hiệu lực
  Bảng graduation_profiles
  STT	Tên trường	Kiểu dữ liệu	Ý nghĩa
  1	id	UNIQUEIDENTIFIER	Khóa chính
  2	student_id	UNIQUEIDENTIFIER	Sinh viên
  3	council_id	UNIQUEIDENTIFIER	Hội đồng xét
  4	condition_id	UNIQUEIDENTIFIER	Điều kiện xét
  5	profile_code	NVARCHAR(50)	Mã hồ sơ
  6	submission_date	DATE	Ngày nộp hồ sơ
  7	status	NVARCHAR(50)	Trạng thái hồ sơ
  8	reviewer_id	UNIQUEIDENTIFIER	Người kiểm tra
  9	review_date	DATE	Ngày kiểm tra
  10	note	NVARCHAR(255)	Ghi chú
  11	created_at	DATETIME2	Thời điểm tạo
  12	updated_at	DATETIME2	Thời điểm cập nhật
  13	created_by	UNIQUEIDENTIFIER	Người tạo
  14	updated_by	UNIQUEIDENTIFIER	Người cập nhật
  15	deleted_at	DATETIME2	Thời điểm xóa
  16	deleted_by	UNIQUEIDENTIFIER	Người xóa
  17	is_active	BIT	Trạng thái hiệu lực
  XII. NHÓM THÔNG BÁO – HỆ THỐNG
  Bảng Notifications
  STT	Tên trường	Kiểu dữ liệu	Mô tả
  1	id	UNIQUEIDENTIFIER (PK)	ID thông báo
  2	title	NVARCHAR(255)	Tiêu đề thông báo
  3	content	NVARCHAR(MAX)	Nội dung chi tiết
  4	type	VARCHAR(50)	Loại thông báo
  5	priority	VARCHAR(20)	Mức độ
  6	sender_id	UNIQUEIDENTIFIER (FK → users.id)	Người gửi
  7	receiver_id	UNIQUEIDENTIFIER (FK → users.id, NULLABLE)	Người nhận cụ thể
  8	target_role	VARCHAR(50)	Gửi theo vai trò
  9	is_read	BIT	Đã đọc chưa
  10	send_channel	VARCHAR(50)	Kênh gửi
  11	created_at	DATETIME	Thời gian tạo
  12	read_at	DATETIME (NULL)	Thời gian đọc
  13	status	VARCHAR(20)	Trạng thái
  14	related_type	VARCHAR(50)	Liên kết đối tượng
  15	related_id	BIGINT	ID đối tượng liên quan
  Bảng Logs
  STT	Tên trường	Kiểu dữ liệu	Mô tả
  1	id	UNIQUEIDENTIFIER (PK, AI)	Khóa chính
  2	user_id	UNIQUEIDENTIFIER (FK, NULL)	ID người thực hiện
  3	action	VARCHAR(50)	Hành động thực hiện
  4	table_name	VARCHAR(100)	Tên bảng
  5	record_id	INT	ID bản ghi
  6	old_value	JSON	Dữ liệu trước khi thay đổi
  7	new_value	JSON	Dữ liệu sau khi thay đổi
  8	ip_address	VARCHAR(45)	Địa chỉ IP
  9	user_agent	TEXT	Thông tin trình duyệt / thiết bị
  10	created_at	DATETIME	Thời gian xảy ra
  Bảng Settings
  STT	Tên trường	Kiểu dữ liệu	Mô tả
  1	id	UNIQUEIDENTIFIER (PK)	Mã định danh
  2	student_id UNIQUEIDENTIFIER (FK → students.id)	Sinh viên được xét
  3	condition_id	UNIQUEIDENTIFIER (FK → graduation_conditions.id)	Điều kiện xét
  4	total_credits	INT	Tổng số tín chỉ
  5	gpa	DECIMAL(3,2)	Điểm trung bình tích lũy
  6	result_status	VARCHAR(50)	Kết quả xét
  7	graduation_classification	VARCHAR(50)	Xếp loại
  8	evaluated_by	UNIQUEIDENTIFIER (FK → users.id)	Người xét
  9	evaluated_at	DATETIME	Ngày xét
  10 remarks	NVARCHAR(255)	Ghi chú bổ sung
