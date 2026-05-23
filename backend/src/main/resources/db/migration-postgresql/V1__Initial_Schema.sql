-- ============================================
-- PERSONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Persons (
PersonId UUID NOT NULL CONSTRAINT DF_Persons_PersonId DEFAULT gen_random_uuid(),
FullName VARCHAR(150) NOT NULL,
Gender VARCHAR(20) NULL,
DateOfBirth DATE NULL,
PlaceOfBirth VARCHAR(150) NULL,
Ethnicity VARCHAR(100) NULL,
PersonalIdentificationNumber VARCHAR(20) NULL,
DateOfIssue DATE NULL,
CardPlace VARCHAR(100) NULL,
Nationality VARCHAR(100) NULL,
ContactEmail VARCHAR(150) NULL,
PhoneNumber VARCHAR(20) NULL,
PermanentAddress VARCHAR(255) NULL,
TemporaryAddress VARCHAR(255) NULL,
AvatarUrl VARCHAR(255) NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Persons_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Persons_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Persons PRIMARY KEY (PersonId)
);

CREATE INDEX IX_Persons_FullName ON Persons(FullName);
CREATE INDEX IX_Persons_PhoneNumber ON Persons(PhoneNumber);
CREATE INDEX IX_Persons_CreatedAt ON Persons(CreatedAt);
CREATE INDEX IX_Persons_UpdatedAt ON Persons(UpdatedAt);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Users (
UserId UUID NOT NULL CONSTRAINT DF_Users_UserId DEFAULT gen_random_uuid(),
PersonId UUID NOT NULL,
Username VARCHAR(50) NOT NULL,
PasswordHash VARCHAR(255) NOT NULL,
Email VARCHAR(150) NULL,
LastLoginAt TIMESTAMP(3) NULL,
AccessFailedCount INT NOT NULL CONSTRAINT DF_Users_AccessFailedCount DEFAULT 0,
LockoutEndAt TIMESTAMP(3) NULL,
LockReason VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
RequirePasswordChange BOOLEAN NOT NULL CONSTRAINT DF_Users_RequirePasswordChange DEFAULT TRUE,
CONSTRAINT PK_Users PRIMARY KEY (UserId),
CONSTRAINT FK_Users_Persons FOREIGN KEY (PersonId) REFERENCES Persons(PersonId),
CONSTRAINT UQ_Users_Username UNIQUE (Username),
CONSTRAINT UQ_Users_Email UNIQUE (Email),
CONSTRAINT UQ_Users_PersonId UNIQUE (PersonId)
);

CREATE INDEX IX_Users_IsActive ON Users(IsActive);
CREATE INDEX IX_Users_LastLoginAt ON Users(LastLoginAt);
CREATE INDEX IX_Users_CreatedAt ON Users(CreatedAt);
CREATE INDEX IX_Users_UpdatedAt ON Users(UpdatedAt);

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Roles (
RoleId UUID NOT NULL CONSTRAINT DF_Roles_RoleId DEFAULT gen_random_uuid(),
Code VARCHAR(50) NOT NULL,
Name VARCHAR(100) NOT NULL,
Description VARCHAR(255) NULL,
Level INT NULL,
IsSystem BOOLEAN NOT NULL CONSTRAINT DF_Roles_IsSystem DEFAULT FALSE,
DisplayOrder INT NULL,
Color VARCHAR(20) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Roles_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Roles_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Roles PRIMARY KEY (RoleId),
CONSTRAINT UQ_Roles_Code UNIQUE (Code)
);

CREATE INDEX IX_Roles_IsActive ON Roles(IsActive);
CREATE INDEX IX_Roles_CreatedAt ON Roles(CreatedAt);

-- ============================================
-- PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Permissions (
PermissionId UUID NOT NULL DEFAULT gen_random_uuid(),
Code VARCHAR(100) NOT NULL,
Name VARCHAR(150) NOT NULL,
Description VARCHAR(255) NULL,
Module VARCHAR(50) NULL,
IsActive BOOLEAN NOT NULL DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Permissions PRIMARY KEY (PermissionId),
CONSTRAINT UQ_Permissions_Code UNIQUE (Code)
);

CREATE INDEX IX_Permissions_Module ON Permissions(Module);
CREATE INDEX IX_Permissions_CreatedAt ON Permissions(CreatedAt);

-- ============================================
-- MENU
-- ============================================
CREATE TABLE IF NOT EXISTS Menus (
MenuId UUID NOT NULL DEFAULT gen_random_uuid(),
ParentId UUID NULL,
MenuTitle VARCHAR(100) NULL,
MenuUrl VARCHAR(255) NULL,
MenuIcon VARCHAR(50) NULL,
OrderIndex INT NULL,
MenuType INT NULL,
PermissionId UUID NULL,
IsActive BOOLEAN NOT NULL DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Menus PRIMARY KEY (MenuId),
CONSTRAINT FK_Menus_Parent FOREIGN KEY (ParentId) REFERENCES Menus(MenuId),
CONSTRAINT FK_Menus_Permission FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId)
);

-- ============================================
-- PERMISSIONAPIS
-- ============================================
CREATE TABLE IF NOT EXISTS PermissionApis (
PermissionId UUID NOT NULL,
ApiPath VARCHAR(255) NOT NULL,
HttpMethod VARCHAR(10) NOT NULL,
IsActive BOOLEAN NOT NULL DEFAULT TRUE,
Description VARCHAR(255) NULL,
CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_PermissionApis PRIMARY KEY (PermissionId, ApiPath, HttpMethod),
CONSTRAINT FK_PermissionApis_Permission FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId)
);

-- ============================================
-- USER ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS UserRoles (
UserId UUID NOT NULL,
RoleId UUID NOT NULL,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_UserRoles_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_UserRoles_IsActive DEFAULT TRUE,
CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

CREATE INDEX IX_UserRoles_RoleId ON UserRoles(RoleId);

-- ============================================
-- ROLE PERMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS RolePermissions (
RoleId UUID NOT NULL,
PermissionId UUID NOT NULL,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_RolePermissions_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_RolePermissions_IsActive DEFAULT TRUE,
CONSTRAINT PK_RolePermissions PRIMARY KEY (RoleId, PermissionId),
CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId),
CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId)
);

CREATE INDEX IX_RolePermissions_PermissionId ON RolePermissions(PermissionId);

-- ============================================
-- USERSESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS UserSessions (
SessionId UUID NOT NULL DEFAULT gen_random_uuid(),
UserId UUID NOT NULL,
RefreshTokenHash BYTEA NOT NULL,
RefreshTokenSalt BYTEA NULL,
ExpiresAt TIMESTAMP(3) NOT NULL,
RevokedAt TIMESTAMP(3) NULL,
RevokeReason VARCHAR(100) NULL,
DeviceInfo VARCHAR(255) NULL,
IpAddress VARCHAR(45) NULL,
CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP(3) NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_UserSessions PRIMARY KEY (SessionId),
CONSTRAINT FK_UserSessions_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_UserSessions_UserId_Revoked ON UserSessions(UserId, RevokedAt);

-- ============================================
-- DEPARTMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS Departments (
DepartmentId UUID NOT NULL CONSTRAINT DF_Departments_DepartmentId DEFAULT gen_random_uuid(),
Code VARCHAR(50) NOT NULL,
Name VARCHAR(150) NOT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Departments_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Departments_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP(3) NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Departments PRIMARY KEY (DepartmentId),
CONSTRAINT UQ_Departments_Code UNIQUE (Code)
);

-- ============================================
-- ACADEMIC COHORTS
-- ============================================
CREATE TABLE IF NOT EXISTS AcademicCohorts (
AcademicCohortId UUID NOT NULL CONSTRAINT DF_AcademicCohorts_AcademicCohortId DEFAULT gen_random_uuid(),
Code VARCHAR(20) NOT NULL,
Name VARCHAR(100) NULL,
StartYear SMALLINT NOT NULL,
EndYear SMALLINT NOT NULL,
StartDate DATE NULL,
EndDate DATE NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_AcademicCohorts_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_AcademicCohorts_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeletedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_AcademicCohorts PRIMARY KEY (AcademicCohortId),
CONSTRAINT UQ_AcademicCohorts_Code UNIQUE (Code),
CONSTRAINT CK_AcademicCohorts_Years CHECK (StartYear < EndYear)
);

-- ============================================
-- MAJORS
-- ============================================
CREATE TABLE IF NOT EXISTS Majors (
MajorId UUID NOT NULL CONSTRAINT DF_Majors_MajorId DEFAULT gen_random_uuid(),
DepartmentId UUID NOT NULL,
Code VARCHAR(20) NOT NULL,
Name VARCHAR(255) NOT NULL,
Description TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Majors_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Majors_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP NULL,
UpdatedBy UUID NULL,
DeleteAt TIMESTAMP NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_Majors PRIMARY KEY (MajorId),
CONSTRAINT FK_Majors_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
CONSTRAINT UQ_Majors_Code UNIQUE (Code)
);

CREATE INDEX IX_Majors_IsActive ON Majors(IsActive);

-- ============================================
-- TRAINING PROGRAMS
-- ============================================
CREATE TABLE IF NOT EXISTS TrainingPrograms (
TrainingProgramId UUID NOT NULL CONSTRAINT DF_TrainingPrograms_TrainingProgramId DEFAULT gen_random_uuid(),
Code VARCHAR(20) NOT NULL,
Name VARCHAR(255) NOT NULL,
NameEn VARCHAR(255) NULL,
MajorId UUID NOT NULL,
DepartmentId UUID NOT NULL,
AcademicCohortId UUID NOT NULL,
DegreeLevel VARCHAR(50) NULL,
EducationType VARCHAR(50) NULL,
TotalCredits INT NULL,
RequiredCredits DECIMAL(5,1) NULL,
ElectiveCredits DECIMAL(5,1) NULL,
InternshipCredits DECIMAL(5,1) NULL,
ThesisCredits DECIMAL(5,1) NULL,
AdmissionYear DATE NULL,
DurationYears DECIMAL(5,1) NULL,
MaxDurationYears DECIMAL(5,1) NULL,
EffectiveDate DATE NULL,
ExpiryDate DATE NULL,
Description TEXT NULL,
Objectives TEXT NULL,
LearningOutcomes TEXT NULL,
Version VARCHAR(20) NULL,
Status VARCHAR(20) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_TrainingPrograms_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_TrainingPrograms_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP NULL,
UpdatedBy UUID NULL,
DeleteAt TIMESTAMP NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_TrainingPrograms PRIMARY KEY (TrainingProgramId),
CONSTRAINT FK_TrainingPrograms_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId),
CONSTRAINT FK_TrainingPrograms_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
CONSTRAINT FK_TrainingPrograms_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
CONSTRAINT UQ_TrainingPrograms_Code UNIQUE (Code)
);

CREATE INDEX IX_TrainingPrograms_MajorId ON TrainingPrograms(MajorId);
CREATE INDEX IX_TrainingPrograms_AcademicCohortId ON TrainingPrograms(AcademicCohortId);

-- ============================================
-- STUDENTS
-- ============================================
CREATE TABLE IF NOT EXISTS Students (
StudentId UUID NOT NULL CONSTRAINT DF_Students_StudentId DEFAULT gen_random_uuid(),
PersonId UUID NOT NULL,
StudentCode VARCHAR(50) NOT NULL,
Note VARCHAR(255) NULL,
TrainingProgramId UUID NOT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Students_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Students_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Students PRIMARY KEY (StudentId),
CONSTRAINT FK_Students_Persons FOREIGN KEY (PersonId) REFERENCES Persons(PersonId),
CONSTRAINT FK_Students_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
CONSTRAINT UQ_Students_PersonId UNIQUE (PersonId),
CONSTRAINT UQ_Students_StudentCode UNIQUE (StudentCode)
);

CREATE INDEX IX_Students_TrainingProgramId ON Students(TrainingProgramId);
CREATE INDEX IX_Students_CreatedAt ON Students(CreatedAt);

-- ============================================
-- STUDENT STATUS CATALOG
-- ============================================
CREATE TABLE IF NOT EXISTS StudentStatusCatalog (
StudentStatusId UUID NOT NULL CONSTRAINT DF_StudentStatusCatalog_StudentStatusId DEFAULT gen_random_uuid(),
Code VARCHAR(50) NOT NULL,
Name VARCHAR(100) NOT NULL,
Description VARCHAR(255) NULL,
StatusType VARCHAR(50) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_StudentStatusCatalog_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_StudentStatusCatalog_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_StudentStatusCatalog PRIMARY KEY (StudentStatusId),
CONSTRAINT UQ_StudentStatusCatalog_Code UNIQUE (Code)
);

CREATE INDEX IX_StudentStatusCatalog_IsActive ON StudentStatusCatalog(IsActive);

-- ============================================
-- STUDENT STATUS HISTORIES
-- ============================================
CREATE TABLE IF NOT EXISTS StudentStatusHistories (
StudentStatusHistoryId UUID NOT NULL CONSTRAINT DF_StudentStatusHistories_StudentStatusHistoryId DEFAULT gen_random_uuid(),
StudentId UUID NOT NULL,
StudentStatusId UUID NOT NULL,
StartDate DATE NOT NULL,
EndDate DATE NULL,
IsCurrent BOOLEAN NOT NULL CONSTRAINT DF_StudentStatusHistories_IsCurrent DEFAULT FALSE,
Reason VARCHAR(255) NULL,
DecisionNo VARCHAR(50) NULL,
DecisionDate DATE NULL,
DecidedBy VARCHAR(150) NULL,
WarningLevel INT NULL,
AllowRegister BOOLEAN NOT NULL CONSTRAINT DF_StudentStatusHistories_AllowRegister DEFAULT TRUE,
AllowExam BOOLEAN NOT NULL CONSTRAINT DF_StudentStatusHistories_AllowExam DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_StudentStatusHistories_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_StudentStatusHistories PRIMARY KEY (StudentStatusHistoryId),
CONSTRAINT FK_SSH_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
CONSTRAINT FK_SSH_StudentStatusCatalog FOREIGN KEY (StudentStatusId) REFERENCES StudentStatusCatalog(StudentStatusId),
CONSTRAINT CK_SSH_DateRange CHECK (EndDate IS NULL OR StartDate <= EndDate)
);

CREATE INDEX IX_SSH_StudentId ON StudentStatusHistories(StudentId);
CREATE INDEX IX_SSH_StatusId ON StudentStatusHistories(StudentStatusId);
CREATE INDEX IX_SSH_IsCurrent ON StudentStatusHistories(StudentId, IsCurrent);

-- ============================================
-- SCHOOL YEARS
-- ============================================
CREATE TABLE IF NOT EXISTS SchoolYears (
SchoolYearId UUID NOT NULL CONSTRAINT DF_SchoolYears_SchoolYearId DEFAULT gen_random_uuid(),
Code VARCHAR(50) NOT NULL,
Name VARCHAR(100) NULL,
StartDate DATE NOT NULL,
EndDate DATE NOT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_SchoolYears_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_SchoolYears_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeletedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_SchoolYears PRIMARY KEY (SchoolYearId),
CONSTRAINT UQ_SchoolYears_Code UNIQUE (Code),
CONSTRAINT CK_SchoolYears_Dates CHECK (StartDate < EndDate)
);

-- ============================================
-- SEMESTERS
-- ============================================
CREATE TABLE IF NOT EXISTS Semesters (
SemesterId UUID NOT NULL CONSTRAINT DF_Semesters_SemesterId DEFAULT gen_random_uuid(),
Code VARCHAR(30) NOT NULL,
Name VARCHAR(150) NOT NULL,
SchoolYearId UUID NOT NULL,
StartDate DATE NOT NULL,
EndDate DATE NOT NULL,
Status BOOLEAN NULL,
Description TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Semesters_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Semesters_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeletedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Semesters PRIMARY KEY (SemesterId),
CONSTRAINT FK_Semesters_SchoolYears FOREIGN KEY (SchoolYearId) REFERENCES SchoolYears(SchoolYearId),
CONSTRAINT UQ_Semesters_SchoolYear_Code UNIQUE (SchoolYearId, Code)
);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS Courses (
CourseId UUID NOT NULL CONSTRAINT DF_Courses_CourseId DEFAULT gen_random_uuid(),
DepartmentId UUID NULL,
Code VARCHAR(20) NOT NULL,
Name VARCHAR(200) NOT NULL,
NameEn VARCHAR(255) NULL,
CourseType VARCHAR(20) NULL,
Credits DECIMAL(5,1) NOT NULL,
TheoryHours DECIMAL(5,1) NULL,
PracticeHours DECIMAL(5,1) NULL,
SelfStudyHours DECIMAL(5,1) NULL,
InternshipCredits DECIMAL(5,1) NULL,
Description VARCHAR(1000) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Courses_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Courses_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP NULL,
UpdatedBy UUID NULL,
DeleteAt TIMESTAMP NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_Courses PRIMARY KEY (CourseId),
CONSTRAINT FK_Courses_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
CONSTRAINT UQ_Courses_Code UNIQUE (Code)
);

CREATE INDEX IX_Courses_IsActive ON Courses(IsActive);
CREATE INDEX IX_Courses_CreatedAt ON Courses(CreatedAt);

-- ============================================
-- TRAINING PROGRAM COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS TrainingProgramCourses (
TrainingProgramId UUID NOT NULL,
CourseId UUID NOT NULL,
SemesterId UUID NULL,
IsRequired BOOLEAN NULL,
GroupCode VARCHAR(50) NULL,
Credits DECIMAL(5,1) NULL,
PrerequisiteCourseId UUID NULL,
IsPrerequisiteRequired BOOLEAN NULL,
Note VARCHAR(500) NULL,
SortOrder INT NULL,
Status VARCHAR(50) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_TrainingProgramCourses_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_TrainingProgramCourses_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP NULL,
UpdatedBy UUID NULL,
DeleteAt TIMESTAMP NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_TrainingProgramCourses PRIMARY KEY (TrainingProgramId, CourseId),
CONSTRAINT FK_TPC_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
CONSTRAINT FK_TPC_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
CONSTRAINT FK_TPC_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

CREATE INDEX IX_TPC_CourseId ON TrainingProgramCourses(CourseId);

-- ============================================
-- COURSE PREREQUISITES
-- ============================================
CREATE TABLE IF NOT EXISTS CoursePrerequisites (
CourseId UUID NOT NULL,
PrerequisiteCourseId UUID NOT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_CoursePrerequisites_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_CoursePrerequisites_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP NULL,
UpdatedBy UUID NULL,
DeleteAt TIMESTAMP NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_CoursePrerequisites PRIMARY KEY (CourseId, PrerequisiteCourseId),
CONSTRAINT FK_CP_Course FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
CONSTRAINT FK_CP_PrerequisiteCourse FOREIGN KEY (PrerequisiteCourseId) REFERENCES Courses(CourseId),
CONSTRAINT CK_NoSelfPrerequisite CHECK (CourseId <> PrerequisiteCourseId)
);

CREATE INDEX IX_CoursePrerequisites_Prereq ON CoursePrerequisites(PrerequisiteCourseId);

-- ============================================
-- CLASSES
-- ============================================
CREATE TABLE IF NOT EXISTS Classes (
ClassId UUID NOT NULL CONSTRAINT DF_Classes_ClassId DEFAULT gen_random_uuid(),
ClassCode VARCHAR(50) NOT NULL,
ClassName VARCHAR(100) NOT NULL,
DepartmentId UUID NULL,
AdvisorId UUID NULL,
AcademicCohortId UUID NULL,
MaxSize INT NULL,
Status SMALLINT NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Classes_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Classes_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP(3) NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Classes PRIMARY KEY (ClassId),
CONSTRAINT UQ_Classes_ClassCode UNIQUE (ClassCode),
CONSTRAINT FK_Classes_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
CONSTRAINT FK_Classes_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
CONSTRAINT CK_Classes_MaxSize CHECK (MaxSize IS NULL OR MaxSize > 0)
);

-- ============================================
-- COURSE CLASSES
-- ============================================
CREATE TABLE IF NOT EXISTS CourseClasses (
CourseClassId UUID NOT NULL CONSTRAINT DF_CourseClasses_CourseClassId DEFAULT gen_random_uuid(),
ClassCode VARCHAR(50) NOT NULL,
MaxStudent INT NULL,
CurrentStudent INT NULL,
RoomId UUID NULL,
Status VARCHAR(20) NULL,
SemesterId UUID NOT NULL,
CourseId UUID NOT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_CourseClasses_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_CourseClasses_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeletedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_CourseClasses PRIMARY KEY (CourseClassId),
CONSTRAINT FK_CourseClasses_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
CONSTRAINT FK_CourseClasses_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
CONSTRAINT UQ_CourseClasses UNIQUE (SemesterId, CourseId, ClassCode)
);

-- ============================================
-- STUDENT CLASSES
-- ============================================
CREATE TABLE IF NOT EXISTS StudentClasses (
StudentClassId UUID NOT NULL CONSTRAINT DF_StudentClasses_StudentClassId DEFAULT gen_random_uuid(),
StudentId UUID NOT NULL,
ClassId UUID NOT NULL,
SemesterId UUID NOT NULL,
RoleInClass VARCHAR(50) NULL,
Status VARCHAR(50) NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_StudentClasses_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_StudentClasses_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_StudentClasses PRIMARY KEY (StudentClassId),
CONSTRAINT FK_StudentClasses_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
CONSTRAINT FK_StudentClasses_Classes FOREIGN KEY (ClassId) REFERENCES Classes(ClassId),
CONSTRAINT FK_StudentClasses_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
CONSTRAINT UQ_StudentClasses UNIQUE (StudentId, ClassId, SemesterId)
);

CREATE INDEX IX_StudentClasses_ClassId ON StudentClasses(ClassId);

-- ============================================
-- EMPLOYEES
-- ============================================
CREATE TABLE IF NOT EXISTS Employees (
EmployeeId UUID NOT NULL CONSTRAINT DF_Employees_EmployeeId DEFAULT gen_random_uuid(),
PersonId UUID NOT NULL,
EmployeeCode VARCHAR(50) NOT NULL,
StartWorkDate DATE NULL,
Status VARCHAR(50) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Employees_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Employees_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Employees PRIMARY KEY (EmployeeId),
CONSTRAINT FK_Employees_Persons FOREIGN KEY (PersonId) REFERENCES Persons(PersonId),
CONSTRAINT UQ_Employees_PersonId UNIQUE (PersonId),
CONSTRAINT UQ_Employees_EmployeeCode UNIQUE (EmployeeCode)
);

-- ============================================
-- DEGREES
-- ============================================
CREATE TABLE IF NOT EXISTS Degrees (
DegreeId UUID NOT NULL CONSTRAINT DF_Degrees_DegreeId DEFAULT gen_random_uuid(),
Name VARCHAR(150) NOT NULL,
Major VARCHAR(150) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Degrees_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Degrees_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Degrees PRIMARY KEY (DegreeId)
);

-- ============================================
-- INSTRUCTORS
-- ============================================
CREATE TABLE IF NOT EXISTS Instructors (
EmployeeId UUID NOT NULL,
InstructorCode VARCHAR(50) NOT NULL,
DepartmentId UUID NULL,
DegreeId UUID NULL,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Instructors_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Instructors PRIMARY KEY (EmployeeId),
CONSTRAINT FK_Instructors_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
CONSTRAINT FK_Instructors_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
CONSTRAINT FK_Instructors_Degrees FOREIGN KEY (DegreeId) REFERENCES Degrees(DegreeId),
CONSTRAINT UQ_Instructors_InstructorCode UNIQUE (InstructorCode)
);
CREATE INDEX IX_Instructors_DepartmentId ON Instructors(DepartmentId);
CREATE INDEX IX_Instructors_DegreeId ON Instructors(DegreeId);
CREATE INDEX IX_Instructors_DeletedAt ON Instructors(DeletedAt);

ALTER TABLE Classes
ADD CONSTRAINT FK_Classes_Instructors_Advisor
FOREIGN KEY (AdvisorId) REFERENCES Instructors(EmployeeId);

-- ============================================
-- POSITIONS
-- ============================================
CREATE TABLE IF NOT EXISTS Positions (
PositionId UUID NOT NULL CONSTRAINT DF_Positions_PositionId DEFAULT gen_random_uuid(),
Name VARCHAR(150) NOT NULL,
Allowance DECIMAL(18,2) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Positions_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Positions_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Positions PRIMARY KEY (PositionId)
);

-- ============================================
-- DIVISIONS
-- ============================================
CREATE TABLE IF NOT EXISTS Divisions (
DivisionId UUID NOT NULL CONSTRAINT DF_Divisions_DivisionId DEFAULT gen_random_uuid(),
Code VARCHAR(50) NOT NULL,
Name VARCHAR(150) NOT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Divisions_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Divisions_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP(3) NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Divisions PRIMARY KEY (DivisionId),
CONSTRAINT UQ_Divisions_Code UNIQUE (Code)
);

-- ============================================
-- STAFFS
-- ============================================
CREATE TABLE IF NOT EXISTS Staffs (
EmployeeId UUID NOT NULL,
StaffCode VARCHAR(50) NOT NULL,
DivisionId UUID NULL,
PositionId UUID NULL,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Staffs_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Staffs PRIMARY KEY (EmployeeId),
CONSTRAINT FK_Staffs_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
CONSTRAINT FK_Staffs_Divisions FOREIGN KEY (DivisionId) REFERENCES Divisions(DivisionId),
CONSTRAINT FK_Staffs_Positions FOREIGN KEY (PositionId) REFERENCES Positions(PositionId),
CONSTRAINT UQ_Staffs_StaffCode UNIQUE (StaffCode)
);

-- ============================================
-- CONTRACTS
-- ============================================
CREATE TABLE IF NOT EXISTS Contracts (
ContractId UUID NOT NULL CONSTRAINT DF_Contracts_ContractId DEFAULT gen_random_uuid(),
EmployeeId UUID NOT NULL,
ContractNo VARCHAR(50) NULL,
ContractType VARCHAR(100) NOT NULL,
SignedDate DATE NULL,
EffectiveDate DATE NULL,
ExpiredDate DATE NULL,
BaseSalary DECIMAL(18,2) NULL,
Status SMALLINT NOT NULL CONSTRAINT DF_Contracts_Status DEFAULT 1,
Note VARCHAR(255) NULL,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_Contracts_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Contracts PRIMARY KEY (ContractId),
CONSTRAINT FK_Contracts_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId)
);

CREATE INDEX IX_Contracts_EmployeeId ON Contracts(EmployeeId);
CREATE INDEX IX_Contracts_Status ON Contracts(Status);

-- ============================================
-- EMPLOYEE LEAVE REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS EmployeeLeaveRequests (
LeaveRequestId UUID NOT NULL CONSTRAINT DF_EmployeeLeaveRequests_LeaveRequestId DEFAULT gen_random_uuid(),
EmployeeId UUID NOT NULL,
FromDate DATE NOT NULL,
ToDate DATE NOT NULL,
Reason VARCHAR(255) NULL,
Status SMALLINT NOT NULL CONSTRAINT DF_EmployeeLeaveRequests_Status DEFAULT 0,
ApprovedBy UUID NULL,
ApprovedAt TIMESTAMP(3) NULL,
Note VARCHAR(255) NULL,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_EmployeeLeaveRequests_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_EmployeeLeaveRequests PRIMARY KEY (LeaveRequestId),
CONSTRAINT FK_ELR_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
CONSTRAINT FK_ELR_ApprovedBy_Employees FOREIGN KEY (ApprovedBy) REFERENCES Employees(EmployeeId),
CONSTRAINT CK_LeaveRequest_DateRange CHECK (FromDate <= ToDate)
);

CREATE INDEX IX_ELR_EmployeeId ON EmployeeLeaveRequests(EmployeeId);
CREATE INDEX IX_ELR_Status ON EmployeeLeaveRequests(Status);

-- ============================================
-- EMPLOYEE ATTENDANCES
-- ============================================
CREATE TABLE IF NOT EXISTS EmployeeAttendances (
AttendanceId UUID NOT NULL CONSTRAINT DF_EmployeeAttendances_AttendanceId DEFAULT gen_random_uuid(),
EmployeeId UUID NOT NULL,
WorkDate DATE NOT NULL,
CheckInTime TIME(0) NULL,
CheckOutTime TIME(0) NULL,
Status SMALLINT NOT NULL CONSTRAINT DF_EmployeeAttendances_Status DEFAULT 0,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_EmployeeAttendances_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_EmployeeAttendances PRIMARY KEY (AttendanceId),
CONSTRAINT FK_EA_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
CONSTRAINT UQ_EA_Employee_WorkDate UNIQUE (EmployeeId, WorkDate),
CONSTRAINT CK_Attendance_Time CHECK (CheckOutTime IS NULL OR CheckInTime IS NULL OR CheckInTime < CheckOutTime)
);

CREATE INDEX IX_IA_WorkDate ON EmployeeAttendances(WorkDate);

-- ============================================
-- TEACHING ASSIGNMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS TeachingAssignments (
AssignmentId UUID NOT NULL CONSTRAINT DF_TeachingAssignments_AssignmentId DEFAULT gen_random_uuid(),
InstructorId UUID NOT NULL,
CourseClassId UUID NOT NULL,
ClassId UUID NOT NULL,
SemesterId UUID NOT NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_TeachingAssignments_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP(3) NOT NULL CONSTRAINT DF_TeachingAssignments_CreatedAt DEFAULT CURRENT_TIMESTAMP,
CreatedBy UUID NULL,
UpdatedAt TIMESTAMP(3) NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP(3) NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_TeachingAssignments PRIMARY KEY (AssignmentId),
CONSTRAINT FK_TA_Instructors FOREIGN KEY (InstructorId) REFERENCES Instructors(EmployeeId),
CONSTRAINT FK_TA_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
CONSTRAINT FK_TA_Classes FOREIGN KEY (ClassId) REFERENCES Classes(ClassId),
CONSTRAINT FK_TA_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
CONSTRAINT UQ_TA UNIQUE (InstructorId, CourseClassId, ClassId, SemesterId)
);

CREATE INDEX IX_TA_InstructorId ON TeachingAssignments(InstructorId);
CREATE INDEX IX_TA_CourseClassId ON TeachingAssignments(CourseClassId);
CREATE INDEX IX_TA_ClassId ON TeachingAssignments(ClassId);

-- ============================================
-- REGISTRATION PERIODS
-- ============================================
CREATE TABLE IF NOT EXISTS RegistrationPeriods (
RegistrationPeriodId UUID NOT NULL CONSTRAINT DF_RegistrationPeriods_RegistrationPeriodId DEFAULT gen_random_uuid(),
Code VARCHAR(30) NOT NULL,
Name VARCHAR(150) NOT NULL,
SemesterId UUID NOT NULL,
StartDate TIMESTAMP NOT NULL,
EndDate TIMESTAMP NOT NULL,
TargetConfig TEXT NULL,
Status SMALLINT NULL,
MinCredits INT NULL,
MaxCredits INT NULL,
AllowRetake BOOLEAN NULL,
Description TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_RegistrationPeriods_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_RegistrationPeriods_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeletedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_RegistrationPeriods PRIMARY KEY (RegistrationPeriodId),
CONSTRAINT FK_RegistrationPeriods_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
CONSTRAINT UQ_RegistrationPeriods_Code UNIQUE (Code)
);

-- ============================================
-- COURSE REGISTRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS CourseRegistrations (
CourseRegistrationId UUID NOT NULL CONSTRAINT DF_CourseRegistrations_CourseRegistrationId DEFAULT gen_random_uuid(),
StudentId UUID NOT NULL,
CourseClassId UUID NOT NULL,
RegistrationPeriodId UUID NOT NULL,
RegistrationType SMALLINT NULL,
ReplacedGradeId UUID NULL,
RegisteredAt TIMESTAMP NULL,
Status SMALLINT NULL,
IsPaid BOOLEAN NULL,
BYTEA BYTEA,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_CourseRegistrations_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_CourseRegistrations PRIMARY KEY (CourseRegistrationId),
CONSTRAINT FK_CR_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
CONSTRAINT FK_CR_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
CONSTRAINT FK_CR_RegistrationPeriods FOREIGN KEY (RegistrationPeriodId) REFERENCES RegistrationPeriods(RegistrationPeriodId)
);

CREATE INDEX IX_CourseRegistrations_StudentId ON CourseRegistrations(StudentId);
CREATE INDEX IX_CourseRegistrations_CourseClassId ON CourseRegistrations(CourseClassId);
CREATE INDEX IX_CourseRegistrations_RegistrationPeriodId ON CourseRegistrations(RegistrationPeriodId);
CREATE INDEX IX_CourseRegistrations_CreatedAt ON CourseRegistrations(CreatedAt);
CREATE INDEX IX_CourseRegistrations_UpdatedAt ON CourseRegistrations(UpdatedAt);

-- ============================================
-- EQUIVALENT COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS EquivalentCourses (
EquivalentCoursesId UUID NOT NULL CONSTRAINT DF_EquivalentCourses_EquivalentCoursesId DEFAULT gen_random_uuid(),
OriginalCourseId UUID NOT NULL,
EquivalentCourseId UUID NOT NULL,
EquivalenceType SMALLINT NULL,
EffectDate DATE NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_EquivalentCourses_IsActive DEFAULT TRUE,
Note VARCHAR(500) NULL,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_EquivalentCourses_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_EquivalentCourses PRIMARY KEY (EquivalentCoursesId),
CONSTRAINT FK_EC_OriginalCourse FOREIGN KEY (OriginalCourseId) REFERENCES Courses(CourseId),
CONSTRAINT FK_EC_EquivalentCourse FOREIGN KEY (EquivalentCourseId) REFERENCES Courses(CourseId),
CONSTRAINT UQ_EquivalentCourses UNIQUE (OriginalCourseId, EquivalentCourseId),
CONSTRAINT CK_EquivalentCourses_NoSelf CHECK (OriginalCourseId <> EquivalentCourseId)
);

CREATE INDEX IX_EquivalentCourses_OriginalCourseId ON EquivalentCourses(OriginalCourseId);
CREATE INDEX IX_EquivalentCourses_EquivalentCourseId ON EquivalentCourses(EquivalentCourseId);

-- ============================================
-- BUILDINGS
-- ============================================
CREATE TABLE IF NOT EXISTS Buildings (
BuildingId UUID NOT NULL CONSTRAINT DF_Buildings_BuildingId DEFAULT gen_random_uuid(),
Code VARCHAR(100) NOT NULL,
Name VARCHAR(255) NOT NULL,
Address VARCHAR(200) NULL,
TotalFloors SMALLINT NULL,
BuildingType VARCHAR(10) NULL,
Description VARCHAR(255) NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Buildings_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Buildings_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Buildings PRIMARY KEY (BuildingId),
CONSTRAINT UQ_Buildings_Code UNIQUE (Code)
);

-- ============================================
-- FLOORS
-- ============================================
CREATE TABLE IF NOT EXISTS Floors (
FloorId UUID NOT NULL CONSTRAINT DF_Floors_FloorId DEFAULT gen_random_uuid(),
Code VARCHAR(100) NOT NULL,
Name VARCHAR(255) NULL,
FloorNumber INT NOT NULL,
BuildingId UUID NOT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Floors_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Floors_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Floors PRIMARY KEY (FloorId),
CONSTRAINT FK_Floors_Buildings FOREIGN KEY (BuildingId) REFERENCES Buildings(BuildingId),
CONSTRAINT UQ_Floors_Building_FloorNumber UNIQUE (BuildingId, FloorNumber),
CONSTRAINT UQ_Floors_Building_Code UNIQUE (BuildingId, Code)
);

-- ============================================
-- ROOMS
-- ============================================
CREATE TABLE IF NOT EXISTS Rooms (
RoomId UUID NOT NULL CONSTRAINT DF_Rooms_RoomId DEFAULT gen_random_uuid(),
Code VARCHAR(100) NOT NULL,
Name VARCHAR(255) NULL,
BuildingId UUID NOT NULL,
FloorNumber INT NULL,
Capacity INT NULL,
Type VARCHAR(50) NULL,
Status VARCHAR(50) NULL,
HasProjector BOOLEAN NULL,
HasAirConditioner BOOLEAN NULL,
HasComputer BOOLEAN NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Rooms_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Rooms_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Rooms PRIMARY KEY (RoomId),
CONSTRAINT FK_Rooms_Buildings FOREIGN KEY (BuildingId) REFERENCES Buildings(BuildingId),
CONSTRAINT UQ_Rooms_Code UNIQUE (Code)
);

-- ============================================
-- TIME SLOTS
-- ============================================
CREATE TABLE IF NOT EXISTS TimeSlots (
TimeSlotId UUID NOT NULL CONSTRAINT DF_TimeSlots_TimeSlotId DEFAULT gen_random_uuid(),
SlotCode VARCHAR(50) NOT NULL,
StartTime TIME NOT NULL,
EndTime TIME NOT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_TimeSlots_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_TimeSlots_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_TimeSlots PRIMARY KEY (TimeSlotId),
CONSTRAINT UQ_TimeSlots_Code UNIQUE (SlotCode)
);

-- ============================================
-- SCHEDULES
-- ============================================
CREATE TABLE IF NOT EXISTS Schedules (
ScheduleId UUID NOT NULL CONSTRAINT DF_Schedules_ScheduleId DEFAULT gen_random_uuid(),
CourseClassId UUID NOT NULL,
EmployeeId UUID NULL,
SemesterId UUID NOT NULL,
RoomId UUID NOT NULL,
DayOfWeek INT NOT NULL,
Date DATE NULL,
Shift VARCHAR(50) NULL,
TimeSlotId UUID NOT NULL,
NumberOfPeriods INT NULL,
StartDate TIMESTAMP NULL,
EndDate TIMESTAMP NULL,
Mode VARCHAR(100) NULL,
Status VARCHAR(255) NULL,
Description VARCHAR(255) NULL,
ScheduleStatus VARCHAR(50) NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Schedules_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Schedules_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Schedules PRIMARY KEY (ScheduleId),
CONSTRAINT FK_Schedules_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
CONSTRAINT FK_Schedules_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
CONSTRAINT FK_Schedules_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId),
CONSTRAINT FK_Schedules_TimeSlots FOREIGN KEY (TimeSlotId) REFERENCES TimeSlots(TimeSlotId),
CONSTRAINT UQ_Schedules_CourseClass_Day_Time UNIQUE (CourseClassId, DayOfWeek, TimeSlotId),
CONSTRAINT UQ_Schedules_Room_Semester_Day_Time UNIQUE (RoomId, SemesterId, DayOfWeek, TimeSlotId),
CONSTRAINT FK_Schedules_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId)
);

CREATE INDEX IX_Schedules_CreatedAt ON Schedules(CreatedAt);
CREATE INDEX IX_Schedules_UpdatedAt ON Schedules(UpdatedAt);

-- ============================================
-- GRADE COMPONENTS
-- ============================================
CREATE TABLE IF NOT EXISTS GradeComponents (
GradeComponentId UUID NOT NULL CONSTRAINT DF_GradeComponents_GradeComponentId DEFAULT gen_random_uuid(),
CourseId UUID NOT NULL,
ComponentCode VARCHAR(20) NOT NULL,
ComponentName VARCHAR(100) NOT NULL,
WeightPercentage DECIMAL(5,2) NULL,
MinScore DECIMAL(4,2) NULL,
MaxScore DECIMAL(4,2) NULL,
IsRequired BOOLEAN NULL,
InputOrder INT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GradeComponents_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GradeComponents_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeleteAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_GradeComponents PRIMARY KEY (GradeComponentId),
CONSTRAINT FK_GradeComponents_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
CONSTRAINT UQ_GradeComponents_Course_Code UNIQUE (CourseId, ComponentCode)
);

CREATE INDEX IX_GradeComponents_CourseId ON GradeComponents(CourseId);

-- ============================================
-- STUDENT GRADES
-- ============================================
CREATE TABLE IF NOT EXISTS StudentGrades (
CourseRegistrationId UUID NOT NULL,
GradeComponentId UUID NOT NULL,
Score DECIMAL(4,2) NULL,
IsLocked BOOLEAN NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_StudentGrades_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_StudentGrades_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeleteAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_StudentGrades PRIMARY KEY (CourseRegistrationId, GradeComponentId),
CONSTRAINT FK_SG_CourseRegistrations FOREIGN KEY (CourseRegistrationId) REFERENCES CourseRegistrations(CourseRegistrationId),
CONSTRAINT FK_SG_GradeComponents FOREIGN KEY (GradeComponentId) REFERENCES GradeComponents(GradeComponentId)
);

-- ============================================
-- GRADE SCALES
-- ============================================
CREATE TABLE IF NOT EXISTS GradeScales (
GradeScaleId UUID NOT NULL CONSTRAINT DF_GradeScales_GradeScaleId DEFAULT gen_random_uuid(),
ScaleName VARCHAR(100) NOT NULL,
MinScore DECIMAL(4,2) NOT NULL,
MaxScore DECIMAL(4,2) NOT NULL,
LetterGrade VARCHAR(2) NOT NULL,
GpaValue DECIMAL(3,2) NOT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GradeScales_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GradeScales_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeleteAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeleteBy UUID NULL,
CONSTRAINT PK_GradeScales PRIMARY KEY (GradeScaleId),
CONSTRAINT CK_GradeScales_MinMax CHECK (MinScore <= MaxScore)
);

-- ============================================
-- STUDENT SUMMARIES
-- ============================================
CREATE TABLE IF NOT EXISTS StudentSummaries (
CourseRegistrationId UUID NOT NULL,
TotalScore DECIMAL(4,2) NULL,
GradeScaleId UUID NULL,
LetterGrade VARCHAR(2) NULL,
GpaValue DECIMAL(3,2) NULL,
Result VARCHAR(10) NULL,
IsFinalized BOOLEAN NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_StudentSummaries_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_StudentSummaries_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_StudentSummaries PRIMARY KEY (CourseRegistrationId),
CONSTRAINT FK_SS_CourseRegistrations FOREIGN KEY (CourseRegistrationId) REFERENCES CourseRegistrations(CourseRegistrationId),
CONSTRAINT FK_SS_GradeScales FOREIGN KEY (GradeScaleId) REFERENCES GradeScales(GradeScaleId)
);

-- ============================================
-- TUITION FEES
-- ============================================
CREATE TABLE IF NOT EXISTS TuitionFees (
TuitionFeeId UUID NOT NULL CONSTRAINT DF_TuitionFees_TuitionFeeId DEFAULT gen_random_uuid(),
TrainingProgramId UUID NOT NULL,
TrainingProgramCode VARCHAR(20) NULL,
TrainingProgramName VARCHAR(255) NULL,
CreditFee DECIMAL(10,2) NULL,
TotalFee DECIMAL(12,2) NULL,
TrainingType VARCHAR(50) NULL,
AcademicYear VARCHAR(20) NULL,
EffectiveDate DATE NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_TuitionFees_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_TuitionFees_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_TuitionFees PRIMARY KEY (TuitionFeeId),
CONSTRAINT FK_TuitionFees_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId)
);

-- ============================================
-- STUDENT TUITION
-- ============================================
CREATE TABLE IF NOT EXISTS StudentTuition (
StudentTuitionId UUID NOT NULL CONSTRAINT DF_StudentTuition_StudentTuitionId DEFAULT gen_random_uuid(),
StudentId UUID NOT NULL,
SemesterId UUID NOT NULL,
TuitionFeeId UUID NOT NULL,
TotalCredits INT NULL,
Discount DECIMAL(10,2) NULL,
RawAmount DECIMAL(15,2) NULL,
PayableAmount DECIMAL(12,2) NULL,
PaidAmount DECIMAL(12,2) NULL,
DebtAmount DECIMAL(15,2) NULL,
PaymentStatus VARCHAR(30) NULL,
DueDate DATE NULL,
Note TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_StudentTuition_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_StudentTuition_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_StudentTuition PRIMARY KEY (StudentTuitionId),
CONSTRAINT FK_ST_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
CONSTRAINT FK_ST_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
CONSTRAINT FK_ST_TuitionFees FOREIGN KEY (TuitionFeeId) REFERENCES TuitionFees(TuitionFeeId),
CONSTRAINT UQ_StudentTuitions UNIQUE (StudentId, SemesterId)
);

CREATE INDEX IX_StudentTuitions_SemesterId ON StudentTuition(SemesterId);
CREATE INDEX IX_StudentTuition_CreatedAt ON StudentTuition(CreatedAt);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS Payments (
PaymentId UUID NOT NULL CONSTRAINT DF_Payments_PaymentId DEFAULT gen_random_uuid(),
StudentTuitionId UUID NOT NULL,
PaymentDate TIMESTAMP NOT NULL,
Amount DECIMAL(12,2) NOT NULL,
PaymentMethod VARCHAR(50) NULL,
TransactionCode VARCHAR(100) NULL,
PaymentStatus VARCHAR(30) NULL,
Cashier VARCHAR(100) NULL,
Note TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Payments_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Payments_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),
CONSTRAINT FK_Payments_StudentTuition FOREIGN KEY (StudentTuitionId) REFERENCES StudentTuition(StudentTuitionId),
CONSTRAINT CK_Payments_Amount CHECK (Amount > 0)
);

CREATE INDEX IX_Payments_StudentTuitionId ON Payments(StudentTuitionId);
CREATE INDEX IX_Payments_CreatedAt ON Payments(CreatedAt);
CREATE INDEX IX_Payments_UpdatedAt ON Payments(UpdatedAt);

-- ============================================
-- EXAM TYPES
-- ============================================
CREATE TABLE IF NOT EXISTS ExamTypes (
ExamTypeId UUID NOT NULL CONSTRAINT DF_ExamTypes_ExamTypeId DEFAULT gen_random_uuid(),
Name VARCHAR(100) NOT NULL,
Description TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_ExamTypes_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_ExamTypes_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_ExamTypes PRIMARY KEY (ExamTypeId)
);

-- ============================================
-- EXAMS
-- ============================================
CREATE TABLE IF NOT EXISTS Exams (
ExamId UUID NOT NULL CONSTRAINT DF_Exams_ExamId DEFAULT gen_random_uuid(),
ExamTypeId UUID NOT NULL,
CourseClassId UUID NOT NULL,
SemesterId UUID NOT NULL,
ExamDate DATE NOT NULL,
StartTime TIME NOT NULL,
DurationMinutes SMALLINT NULL,
EndTime TIME NULL,
ExamFormat VARCHAR(20) NULL,
ExamStatus VARCHAR(20) NULL,
SupervisorCount SMALLINT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Exams_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Exams_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Exams PRIMARY KEY (ExamId),
CONSTRAINT FK_Exams_ExamTypes FOREIGN KEY (ExamTypeId) REFERENCES ExamTypes(ExamTypeId),
CONSTRAINT FK_Exams_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
CONSTRAINT FK_Exams_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

CREATE INDEX IX_Exams_CreatedAt ON Exams(CreatedAt);
CREATE INDEX IX_Exams_UpdatedAt ON Exams(UpdatedAt);

-- ============================================
-- EXAM ROOMS
-- ============================================
CREATE TABLE IF NOT EXISTS ExamRooms (
ExamRoomId UUID NOT NULL CONSTRAINT DF_ExamRooms_ExamRoomId DEFAULT gen_random_uuid(),
ExamId UUID NOT NULL,
RoomId UUID NOT NULL,
Capacity INT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_ExamRooms_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_ExamRooms_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_ExamRooms PRIMARY KEY (ExamRoomId),
CONSTRAINT FK_ExamRooms_Exams FOREIGN KEY (ExamId) REFERENCES Exams(ExamId),
CONSTRAINT FK_ExamRooms_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId)
);

-- ============================================
-- EXAM REGISTRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS ExamRegistrations (
ExamRegistrationId UUID NOT NULL CONSTRAINT DF_ExamRegistrations_ExamRegistrationId DEFAULT gen_random_uuid(),
ExamId UUID NOT NULL,
ExamRoomId UUID NOT NULL,
StudentId UUID NOT NULL,
RollNumber VARCHAR(20) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_ExamRegistrations_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_ExamRegistrations_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_ExamRegistrations PRIMARY KEY (ExamRegistrationId),
CONSTRAINT FK_ER_Exams FOREIGN KEY (ExamId) REFERENCES Exams(ExamId),
CONSTRAINT FK_ER_ExamRooms FOREIGN KEY (ExamRoomId) REFERENCES ExamRooms(ExamRoomId),
CONSTRAINT FK_ER_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId)
);

-- ============================================
-- EXAM PAPERS
-- ============================================
CREATE TABLE IF NOT EXISTS ExamPapers (
ExamPaperId UUID NOT NULL CONSTRAINT DF_ExamPapers_ExamPaperId DEFAULT gen_random_uuid(),
ExamId UUID NOT NULL,
PaperCode VARCHAR(20) NULL,
FileUrl VARCHAR(500) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_ExamPapers_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_ExamPapers_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_ExamPapers PRIMARY KEY (ExamPaperId),
CONSTRAINT FK_ExamPapers_Exams FOREIGN KEY (ExamId) REFERENCES Exams(ExamId)
);

-- ============================================
-- EXAM RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS ExamResults (
ExamResultId UUID NOT NULL CONSTRAINT DF_ExamResults_ExamResultId DEFAULT gen_random_uuid(),
RegistrationId UUID NOT NULL,
Score DECIMAL(4,2) NULL,
Status VARCHAR(50) NULL,
GradedByUserId UUID NULL,
GradedAt TIMESTAMP NULL,
IsLocked BOOLEAN NULL,
AppealStatus VARCHAR(20) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_ExamResults_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_ExamResults_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_ExamResults PRIMARY KEY (ExamResultId),
CONSTRAINT FK_ExamResults_ExamRegistrations FOREIGN KEY (RegistrationId) REFERENCES ExamRegistrations(ExamRegistrationId),
CONSTRAINT FK_ExamResults_Instructors FOREIGN KEY (GradedByUserId) REFERENCES Users(UserId)
);

-- ============================================
-- GRADUATION CONDITIONS
-- ============================================
CREATE TABLE IF NOT EXISTS GraduationConditions (
GraduationConditionId UUID NOT NULL CONSTRAINT DF_GraduationConditions_GraduationConditionId DEFAULT gen_random_uuid(),
TrainingProgramId UUID NOT NULL,
AcademicCohortId UUID NULL,
ConditionCode VARCHAR(50) NOT NULL,
ConditionName VARCHAR(200) NOT NULL,
MinCredits INT NULL,
MinGpa FLOAT NULL,
MaxFailedCourses INT NULL,
EnglishRequirement VARCHAR(100) NULL,
ItRequirement VARCHAR(100) NULL,
ConductRequired VARCHAR(50) NULL,
Description VARCHAR(255) NULL,
StartDate DATE NULL,
DueDate DATE NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GraduationConditions_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GraduationConditions_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_GraduationConditions PRIMARY KEY (GraduationConditionId),
CONSTRAINT FK_GC_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
CONSTRAINT FK_GC_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId)
);

-- ============================================
-- GRADUATION SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS GraduationSessions (
GraduationSessionId UUID NOT NULL CONSTRAINT DF_GraduationSessions_GraduationSessionId DEFAULT gen_random_uuid(),
SessionCode VARCHAR(50) NOT NULL,
SessionName VARCHAR(200) NOT NULL,
AcademicCohortId UUID NULL,
SemesterId UUID NULL,
StartDate DATE NULL,
DueDate DATE NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GraduationSessions_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GraduationSessions_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_GraduationSessions PRIMARY KEY (GraduationSessionId),
CONSTRAINT FK_GS_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
CONSTRAINT FK_GS_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

-- ============================================
-- GRADUATION COUNCILS
-- ============================================
CREATE TABLE IF NOT EXISTS GraduationCouncils (
GraduationCouncilId UUID NOT NULL CONSTRAINT DF_GraduationCouncils_GraduationCouncilId DEFAULT gen_random_uuid(),
CouncilCode VARCHAR(50) NOT NULL,
CouncilName VARCHAR(200) NOT NULL,
AcademicCohortId UUID NULL,
SemesterId UUID NULL,
DecisionNumber VARCHAR(50) NULL,
DecisionDate DATE NULL,
ChairmanId UUID NULL,
SecretaryId UUID NULL,
Description VARCHAR(255) NULL,
StartDate DATE NULL,
EndDate DATE NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GraduationCouncils_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GraduationCouncils_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_GraduationCouncils PRIMARY KEY (GraduationCouncilId),
CONSTRAINT FK_GradCouncil_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
CONSTRAINT FK_GradCouncil_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

-- ============================================
-- GRADUATION RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS GraduationResults (
GraduationResultId UUID NOT NULL CONSTRAINT DF_GraduationResults_GraduationResultId DEFAULT gen_random_uuid(),
StudentId UUID NOT NULL,
GraduationConditionId UUID NOT NULL,
TotalCredits INT NULL,
Gpa FLOAT NULL,
FailedCourses INT NULL,
GraduationStatus VARCHAR(50) NULL,
GraduationRank VARCHAR(50) NULL,
DecisionNumber VARCHAR(50) NULL,
GraduationCouncilId UUID NULL,
DecisionDate DATE NULL,
StartDate DATE NULL,
DueDate DATE NULL,
Note TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GraduationResults_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GraduationResults_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_GraduationResults PRIMARY KEY (GraduationResultId),
CONSTRAINT FK_GR_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
CONSTRAINT FK_GR_GraduationConditions FOREIGN KEY (GraduationConditionId) REFERENCES GraduationConditions(GraduationConditionId),
CONSTRAINT FK_GR_GraduationCouncils FOREIGN KEY (GraduationCouncilId) REFERENCES GraduationCouncils(GraduationCouncilId)
);

CREATE INDEX IX_GraduationResults_CreatedAt ON GraduationResults(CreatedAt);

-- ============================================
-- GRADUATION PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS GraduationProfiles (
GraduationProfileId UUID NOT NULL CONSTRAINT DF_GraduationProfiles_GraduationProfileId DEFAULT gen_random_uuid(),
StudentId UUID NOT NULL,
CouncilId UUID NOT NULL,
GraduationConditionId UUID NOT NULL,
ProfileCode VARCHAR(50) NOT NULL,
SubmissionDate DATE NULL,
Status VARCHAR(50) NULL,
ReviewerId UUID NULL,
ReviewDate DATE NULL,
Note VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_GraduationProfiles_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_GraduationProfiles_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_GraduationProfiles PRIMARY KEY (GraduationProfileId),
CONSTRAINT FK_GP_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
CONSTRAINT FK_GP_GraduationCouncils FOREIGN KEY (CouncilId) REFERENCES GraduationCouncils(GraduationCouncilId),
CONSTRAINT FK_GP_GraduationConditions FOREIGN KEY (GraduationConditionId) REFERENCES GraduationConditions(GraduationConditionId)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS Notifications (
NotificationId UUID NOT NULL CONSTRAINT DF_Notifications_NotificationId DEFAULT gen_random_uuid(),
Title VARCHAR(255) NOT NULL,
Content TEXT NOT NULL,
TypeId VARCHAR(50) NULL,
Priority VARCHAR(20) NULL,
TargetRoleId UUID NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Notifications_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Notifications_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdateAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Notifications PRIMARY KEY (NotificationId),
CONSTRAINT FK_Notifications_Roles FOREIGN KEY (TargetRoleId) REFERENCES Roles(RoleId),
CONSTRAINT FK_Notifications_Users_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- ============================================
-- USER NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS UserNotifications (
UserNotificationId UUID NOT NULL CONSTRAINT DF_UserNotifications_UserNotificationId DEFAULT gen_random_uuid(),
UserId UUID NOT NULL,
NotificationId UUID NOT NULL,
IsRead BOOLEAN NOT NULL CONSTRAINT DF_UserNotifications_IsRead DEFAULT FALSE,
ReadAt TIMESTAMP NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_UserNotifications_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_UserNotifications_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdateAt TIMESTAMP NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_UserNotifications PRIMARY KEY (UserNotificationId),
CONSTRAINT FK_UN_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
CONSTRAINT FK_UN_Notifications FOREIGN KEY (NotificationId) REFERENCES Notifications(NotificationId),
CONSTRAINT FK_UserNotifications_Users_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(UserId)
);

-- ============================================
-- LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS Logs (
LogId UUID NOT NULL CONSTRAINT DF_Logs_LogId DEFAULT gen_random_uuid(),
UserId UUID NULL,
Action VARCHAR(50) NOT NULL,
TableName VARCHAR(100) NULL,
RecordId UUID NULL,
Description TEXT NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Logs_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Logs_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
UpdatedBy UUID NULL,
CONSTRAINT PK_Logs PRIMARY KEY (LogId),
CONSTRAINT FK_Logs_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_Logs_CreatedAt ON Logs(CreatedAt);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS Settings (
SettingId UUID NOT NULL CONSTRAINT DF_Settings_SettingId DEFAULT gen_random_uuid(),
SettingKey VARCHAR(100) NOT NULL,
SettingValue TEXT NULL,
Description VARCHAR(255) NULL,
IsActive BOOLEAN NOT NULL CONSTRAINT DF_Settings_IsActive DEFAULT TRUE,
CreatedAt TIMESTAMP NOT NULL CONSTRAINT DF_Settings_CreatedAt DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP NULL,
CreatedBy UUID NULL,
UpdatedBy UUID NULL,
DeletedAt TIMESTAMP NULL,
DeletedBy UUID NULL,
CONSTRAINT PK_Settings PRIMARY KEY (SettingId),
CONSTRAINT UQ_Settings_Key UNIQUE (SettingKey)
);
