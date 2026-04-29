-- ============================================
-- DATABASE CREATION
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'UniversityManagement')
BEGIN
    CREATE DATABASE UniversityManagement;
END
GO

USE UniversityManagement;
GO

-- ============================================
-- PERSONS TABLE
-- ============================================
CREATE TABLE Persons (
    PersonId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Persons_PersonId DEFAULT NEWID(),
    FullName NVARCHAR(150) NOT NULL,
    Gender NVARCHAR(20) NULL,
    DateOfBirth DATE NULL,
    PlaceOfBirth NVARCHAR(150) NULL,
    Ethnicity NVARCHAR(100) NULL,
    PersonalIdentificationNumber VARCHAR(20) NULL,
    DateOfIssue DATE NULL,
    CardPlace NVARCHAR(100) NULL,
    Nationality NVARCHAR(100) NULL,
    ContactEmail NVARCHAR(150) NULL,
    PhoneNumber NVARCHAR(20) NULL,
    PermanentAddress NVARCHAR(255) NULL,
    TemporaryAddress NVARCHAR(255) NULL,
    AvatarUrl NVARCHAR(255) NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Persons_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Persons_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Persons PRIMARY KEY (PersonId)
);

CREATE INDEX IX_Persons_FullName ON Persons(FullName);
CREATE INDEX IX_Persons_PhoneNumber ON Persons(PhoneNumber);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Users_UserId DEFAULT NEWID(),
    PersonId UNIQUEIDENTIFIER NOT NULL,
    Username NVARCHAR(50) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(150) NULL,
    LastLoginAt DATETIME2(3) NULL,
    AccessFailedCount INT NOT NULL CONSTRAINT DF_Users_AccessFailedCount DEFAULT 0,
    LockoutEndAt DATETIME2(3) NULL,
    LockReason NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Users PRIMARY KEY (UserId),
    CONSTRAINT FK_Users_Persons FOREIGN KEY (PersonId) REFERENCES Persons(PersonId),
    CONSTRAINT UQ_Users_Username UNIQUE (Username),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT UQ_Users_PersonId UNIQUE (PersonId)
);

CREATE INDEX IX_Users_IsActive ON Users(IsActive);
CREATE INDEX IX_Users_LastLoginAt ON Users(LastLoginAt);

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE Roles (
    RoleId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Roles_RoleId DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    Level INT NULL,
    IsSystem BIT NOT NULL CONSTRAINT DF_Roles_IsSystem DEFAULT 0,
    DisplayOrder INT NULL,
    Color NVARCHAR(20) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Roles_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Roles_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Roles PRIMARY KEY (RoleId),
    CONSTRAINT UQ_Roles_Code UNIQUE (Code)
);

CREATE INDEX IX_Roles_IsActive ON Roles(IsActive);

-- ============================================
-- PERMISSIONS TABLE
-- ============================================
CREATE TABLE Permissions (
    PermissionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Permissions_PermissionId DEFAULT NEWID(),
    Code NVARCHAR(100) NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255) NULL,
    Module NVARCHAR(50) NULL,
    ApiPath NVARCHAR(255) NULL,
    HttpMethod NVARCHAR(10) NULL,
    Screen NVARCHAR(100) NULL,
    ScreenAction NVARCHAR(50) NULL,
    ParentScreen NVARCHAR(100) NULL,
    IsMenu BIT NOT NULL CONSTRAINT DF_Permissions_IsMenu DEFAULT 0,
    OrderIndex INT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Permissions_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Permissions_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Permissions PRIMARY KEY (PermissionId),
    CONSTRAINT UQ_Permissions_Code UNIQUE (Code)
);

CREATE INDEX IX_Permissions_Module ON Permissions(Module);

-- ============================================
-- USER ROLES
-- ============================================
CREATE TABLE UserRoles (
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_UserRoles_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_UserRoles_IsActive DEFAULT 1,
    CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

CREATE INDEX IX_UserRoles_RoleId ON UserRoles(RoleId);

-- ============================================
-- ROLE PERMISSIONS
-- ============================================
CREATE TABLE RolePermissions (
    RoleId UNIQUEIDENTIFIER NOT NULL,
    PermissionId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_RolePermissions_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_RolePermissions_IsActive DEFAULT 1,
    CONSTRAINT PK_RolePermissions PRIMARY KEY (RoleId, PermissionId),
    CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId),
    CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId)
);

CREATE INDEX IX_RolePermissions_PermissionId ON RolePermissions(PermissionId);

-- ============================================
-- DEPARTMENTS
-- ============================================
CREATE TABLE Departments (
    DepartmentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Departments_DepartmentId DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Departments_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Departments_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(3) NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Departments PRIMARY KEY (DepartmentId),
    CONSTRAINT UQ_Departments_Code UNIQUE (Code)
);

-- ============================================
-- ACADEMIC COHORTS
-- ============================================
CREATE TABLE AcademicCohorts (
    AcademicCohortId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_AcademicCohorts_AcademicCohortId DEFAULT NEWSEQUENTIALID(),
    Code NVARCHAR(20) NOT NULL,
    Name NVARCHAR(100) NULL,
    StartYear SMALLINT NOT NULL,
    EndYear SMALLINT NOT NULL,
    StartDate DATE NULL,
    EndDate DATE NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_AcademicCohorts_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_AcademicCohorts_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_AcademicCohorts PRIMARY KEY (AcademicCohortId),
    CONSTRAINT UQ_AcademicCohorts_Code UNIQUE (Code),
    CONSTRAINT CK_AcademicCohorts_Years CHECK (StartYear < EndYear)
);

-- ============================================
-- MAJORS
-- ============================================
CREATE TABLE Majors (
    MajorId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Majors_MajorId DEFAULT NEWID(),
    DepartmentId UNIQUEIDENTIFIER NOT NULL,
    Code NVARCHAR(20) NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Majors_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Majors_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2 NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteAt DATETIME2 NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Majors PRIMARY KEY (MajorId),
    CONSTRAINT FK_Majors_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT UQ_Majors_Code UNIQUE (Code)
);

CREATE INDEX IX_Majors_IsActive ON Majors(IsActive);

-- ============================================
-- TRAINING PROGRAMS
-- ============================================
CREATE TABLE TrainingPrograms (
    TrainingProgramId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_TrainingPrograms_TrainingProgramId DEFAULT NEWID(),
    Code NVARCHAR(20) NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    NameEn NVARCHAR(255) NULL,
    MajorId UNIQUEIDENTIFIER NOT NULL,
    DepartmentId UNIQUEIDENTIFIER NOT NULL,
    AcademicCohortId UNIQUEIDENTIFIER NOT NULL,
    DegreeLevel NVARCHAR(50) NULL,
    EducationType NVARCHAR(50) NULL,
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
    Description NVARCHAR(MAX) NULL,
    Objectives NVARCHAR(MAX) NULL,
    LearningOutcomes NVARCHAR(MAX) NULL,
    Version NVARCHAR(20) NULL,
    Status NVARCHAR(20) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_TrainingPrograms_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_TrainingPrograms_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2 NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteAt DATETIME2 NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
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
CREATE TABLE Students (
    StudentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Students_StudentId DEFAULT NEWID(),
    PersonId UNIQUEIDENTIFIER NOT NULL,
    StudentCode NVARCHAR(50) NOT NULL,
    Note NVARCHAR(255) NULL,
    TrainingProgramId UNIQUEIDENTIFIER NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Students_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Students_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Students PRIMARY KEY (StudentId),
    CONSTRAINT FK_Students_Persons FOREIGN KEY (PersonId) REFERENCES Persons(PersonId),
    CONSTRAINT FK_Students_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
    CONSTRAINT UQ_Students_PersonId UNIQUE (PersonId),
    CONSTRAINT UQ_Students_StudentCode UNIQUE (StudentCode)
);

CREATE INDEX IX_Students_TrainingProgramId ON Students(TrainingProgramId);

-- ============================================
-- STUDENT STATUS CATALOG
-- ============================================
CREATE TABLE StudentStatusCatalog (
    StudentStatusId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_StudentStatusCatalog_StudentStatusId DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    StatusType NVARCHAR(50) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_StudentStatusCatalog_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_StudentStatusCatalog_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_StudentStatusCatalog PRIMARY KEY (StudentStatusId),
    CONSTRAINT UQ_StudentStatusCatalog_Code UNIQUE (Code)
);

CREATE INDEX IX_StudentStatusCatalog_IsActive ON StudentStatusCatalog(IsActive);

-- ============================================
-- STUDENT STATUS HISTORIES
-- ============================================
CREATE TABLE StudentStatusHistories (
    StudentStatusHistoryId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_StudentStatusHistories_StudentStatusHistoryId DEFAULT NEWID(),
    StudentId UNIQUEIDENTIFIER NOT NULL,
    StudentStatusId UNIQUEIDENTIFIER NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NULL,
    IsCurrent BIT NOT NULL CONSTRAINT DF_StudentStatusHistories_IsCurrent DEFAULT 0,
    Reason NVARCHAR(255) NULL,
    DecisionNo NVARCHAR(50) NULL,
    DecisionDate DATE NULL,
    DecidedBy NVARCHAR(150) NULL,
    WarningLevel INT NULL,
    AllowRegister BIT NOT NULL CONSTRAINT DF_StudentStatusHistories_AllowRegister DEFAULT 1,
    AllowExam BIT NOT NULL CONSTRAINT DF_StudentStatusHistories_AllowExam DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_StudentStatusHistories_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
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
CREATE TABLE SchoolYears (
    SchoolYearId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_SchoolYears_SchoolYearId DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL,
    Name NVARCHAR(100) NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_SchoolYears_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_SchoolYears_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_SchoolYears PRIMARY KEY (SchoolYearId),
    CONSTRAINT UQ_SchoolYears_Code UNIQUE (Code),
    CONSTRAINT CK_SchoolYears_Dates CHECK (StartDate < EndDate)
);

-- ============================================
-- SEMESTERS
-- ============================================
CREATE TABLE Semesters (
    SemesterId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Semesters_SemesterId DEFAULT NEWID(),
    Code VARCHAR(30) NOT NULL,
    Name VARCHAR(150) NOT NULL,
    SchoolYearId UNIQUEIDENTIFIER NOT NULL,
    SchoolYearName NVARCHAR(100) NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status BIT NULL,
    Description TEXT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Semesters_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Semesters_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Semesters PRIMARY KEY (SemesterId),
    CONSTRAINT FK_Semesters_SchoolYears FOREIGN KEY (SchoolYearId) REFERENCES SchoolYears(SchoolYearId),
    CONSTRAINT UQ_Semesters_SchoolYear_Code UNIQUE (SchoolYearId, Code)
);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE Courses (
    CourseId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Courses_CourseId DEFAULT NEWID(),
    DepartmentId UNIQUEIDENTIFIER NULL,
    Code NVARCHAR(20) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    NameEn NVARCHAR(255) NULL,
    CourseType VARCHAR(20) NULL,
    Credits DECIMAL(5,1) NOT NULL,
    TheoryHours DECIMAL(5,1) NULL,
    PracticeHours DECIMAL(5,1) NULL,
    SelfStudyHours DECIMAL(5,1) NULL,
    InternshipCredits DECIMAL(5,1) NULL,
    Description NVARCHAR(1000) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Courses_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Courses_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2 NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteAt DATETIME2 NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Courses PRIMARY KEY (CourseId),
    CONSTRAINT FK_Courses_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT UQ_Courses_Code UNIQUE (Code)
);

CREATE INDEX IX_Courses_IsActive ON Courses(IsActive);

-- ============================================
-- TRAINING PROGRAM COURSES
-- ============================================
CREATE TABLE TrainingProgramCourses (
    TrainingProgramId UNIQUEIDENTIFIER NOT NULL,
    CourseId UNIQUEIDENTIFIER NOT NULL,
    CourseCode NVARCHAR(20) NULL,
    CourseName NVARCHAR(200) NULL,
    SemesterId UNIQUEIDENTIFIER NULL,
    SemesterCode VARCHAR(30) NULL,
    IsRequired BIT NULL,
    GroupCode NVARCHAR(50) NULL,
    Credits DECIMAL(5,1) NULL,
    PrerequisiteCourseId UNIQUEIDENTIFIER NULL,
    IsPrerequisiteRequired BIT NULL,
    Note NVARCHAR(500) NULL,
    SortOrder INT NULL,
    Status NVARCHAR(50) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_TrainingProgramCourses_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_TrainingProgramCourses_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2 NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteAt DATETIME2 NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_TrainingProgramCourses PRIMARY KEY (TrainingProgramId, CourseId),
    CONSTRAINT FK_TPC_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
    CONSTRAINT FK_TPC_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
    CONSTRAINT FK_TPC_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

CREATE INDEX IX_TPC_CourseId ON TrainingProgramCourses(CourseId);

-- ============================================
-- COURSE PREREQUISITES
-- ============================================
CREATE TABLE CoursePrerequisites (
    CourseId UNIQUEIDENTIFIER NOT NULL,
    PrerequisiteCourseId UNIQUEIDENTIFIER NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_CoursePrerequisites_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_CoursePrerequisites_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2 NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteAt DATETIME2 NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_CoursePrerequisites PRIMARY KEY (CourseId, PrerequisiteCourseId),
    CONSTRAINT FK_CP_Course FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
    CONSTRAINT FK_CP_PrerequisiteCourse FOREIGN KEY (PrerequisiteCourseId) REFERENCES Courses(CourseId),
    CONSTRAINT CK_NoSelfPrerequisite CHECK (CourseId <> PrerequisiteCourseId)
);

CREATE INDEX IX_CoursePrerequisites_Prereq ON CoursePrerequisites(PrerequisiteCourseId);

-- ============================================
-- CLASSES
-- ============================================
CREATE TABLE Classes (
    ClassId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Classes_ClassId DEFAULT NEWID(),
    ClassCode NVARCHAR(50) NOT NULL,
    ClassName NVARCHAR(100) NOT NULL,
    DepartmentId UNIQUEIDENTIFIER NULL,
    AdvisorId UNIQUEIDENTIFIER NULL,
    AcademicCohortId UNIQUEIDENTIFIER NULL,
    MaxSize INT NULL,
    Status TINYINT NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Classes_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Classes_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(3) NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Classes PRIMARY KEY (ClassId),
    CONSTRAINT UQ_Classes_ClassCode UNIQUE (ClassCode),
    CONSTRAINT FK_Classes_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT FK_Classes_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
    CONSTRAINT CK_Classes_MaxSize CHECK (MaxSize IS NULL OR MaxSize > 0)
);

-- ============================================
-- COURSE CLASSES
-- ============================================
CREATE TABLE CourseClasses (
    CourseClassId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_CourseClasses_CourseClassId DEFAULT NEWID(),
    ClassCode NVARCHAR(50) NOT NULL,
    MaxStudent INT NULL,
    CurrentStudent INT NULL,
    RoomId UNIQUEIDENTIFIER NULL,
    Status NVARCHAR(20) NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    CourseId UNIQUEIDENTIFIER NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_CourseClasses_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_CourseClasses_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_CourseClasses PRIMARY KEY (CourseClassId),
    CONSTRAINT FK_CourseClasses_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
    CONSTRAINT FK_CourseClasses_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
    CONSTRAINT UQ_CourseClasses UNIQUE (SemesterId, CourseId, ClassCode)
);

-- ============================================
-- STUDENT CLASSES
-- ============================================
CREATE TABLE StudentClasses (
    StudentClassId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_StudentClasses_StudentClassId DEFAULT NEWID(),
    StudentId UNIQUEIDENTIFIER NOT NULL,
    ClassId UNIQUEIDENTIFIER NOT NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    RoleInClass NVARCHAR(50) NULL,
    Status NVARCHAR(50) NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_StudentClasses_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_StudentClasses_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
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
CREATE TABLE Employees (
    EmployeeId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Employees_EmployeeId DEFAULT NEWID(),
    PersonId UNIQUEIDENTIFIER NOT NULL,
    EmployeeCode NVARCHAR(50) NOT NULL,
    StartWorkDate DATE NULL,
    Status NVARCHAR(50) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Employees_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Employees_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Employees PRIMARY KEY (EmployeeId),
    CONSTRAINT FK_Employees_Persons FOREIGN KEY (PersonId) REFERENCES Persons(PersonId),
    CONSTRAINT UQ_Employees_PersonId UNIQUE (PersonId),
    CONSTRAINT UQ_Employees_EmployeeCode UNIQUE (EmployeeCode)
);

-- ============================================
-- DEGREES
-- ============================================
CREATE TABLE Degrees (
    DegreeId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Degrees_DegreeId DEFAULT NEWID(),
    Name NVARCHAR(150) NOT NULL,
    Major NVARCHAR(150) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Degrees_IsActive DEFAULT 1,
    CONSTRAINT PK_Degrees PRIMARY KEY (DegreeId)
);

-- ============================================
-- INSTRUCTORS
-- ============================================
CREATE TABLE Instructors (
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    InstructorCode NVARCHAR(50) NOT NULL,
    DepartmentId UNIQUEIDENTIFIER NULL,
    DegreeId UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Instructors_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Instructors PRIMARY KEY (EmployeeId),
    CONSTRAINT FK_Instructors_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
    CONSTRAINT FK_Instructors_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT FK_Instructors_Degrees FOREIGN KEY (DegreeId) REFERENCES Degrees(DegreeId),
    CONSTRAINT UQ_Instructors_InstructorCode UNIQUE (InstructorCode)
);

-- ============================================
-- POSITIONS
-- ============================================
CREATE TABLE Positions (
    PositionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Positions_PositionId DEFAULT NEWID(),
    Name NVARCHAR(150) NOT NULL,
    Allowance DECIMAL(18,2) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Positions_IsActive DEFAULT 1,
    CONSTRAINT PK_Positions PRIMARY KEY (PositionId)
);

-- ============================================
-- DIVISIONS
-- ============================================
CREATE TABLE Divisions (
    DivisionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Divisions_DivisionId DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Divisions_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Divisions_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(3) NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Divisions PRIMARY KEY (DivisionId),
    CONSTRAINT UQ_Divisions_Code UNIQUE (Code)
);

-- ============================================
-- STAFFS
-- ============================================
CREATE TABLE Staffs (
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    StaffCode NVARCHAR(50) NOT NULL,
    DivisionId UNIQUEIDENTIFIER NULL,
    PositionId UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Staffs_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2(3) NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Staffs PRIMARY KEY (EmployeeId),
    CONSTRAINT FK_Staffs_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
    CONSTRAINT FK_Staffs_Divisions FOREIGN KEY (DivisionId) REFERENCES Divisions(DivisionId),
    CONSTRAINT FK_Staffs_Positions FOREIGN KEY (PositionId) REFERENCES Positions(PositionId),
    CONSTRAINT UQ_Staffs_StaffCode UNIQUE (StaffCode)
);

-- ============================================
-- CONTRACTS
-- ============================================
CREATE TABLE Contracts (
    ContractId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Contracts_ContractId DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    ContractNo NVARCHAR(50) NULL,
    ContractType NVARCHAR(100) NOT NULL,
    SignedDate DATE NULL,
    EffectiveDate DATE NULL,
    ExpiredDate DATE NULL,
    BaseSalary DECIMAL(18,2) NULL,
    Status TINYINT NOT NULL CONSTRAINT DF_Contracts_Status DEFAULT 1,
    Note NVARCHAR(255) NULL,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Contracts_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Contracts PRIMARY KEY (ContractId),
    CONSTRAINT FK_Contracts_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId)
);

CREATE INDEX IX_Contracts_EmployeeId ON Contracts(EmployeeId);
CREATE INDEX IX_Contracts_Status ON Contracts(Status);

-- ============================================
-- EMPLOYEE LEAVE REQUESTS
-- ============================================
CREATE TABLE EmployeeLeaveRequests (
    LeaveRequestId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_EmployeeLeaveRequests_LeaveRequestId DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    Reason NVARCHAR(255) NULL,
    Status TINYINT NOT NULL CONSTRAINT DF_EmployeeLeaveRequests_Status DEFAULT 0,
    ApprovedBy UNIQUEIDENTIFIER NULL,
    ApprovedAt DATETIME2(3) NULL,
    Note NVARCHAR(255) NULL,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_EmployeeLeaveRequests_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_EmployeeLeaveRequests PRIMARY KEY (LeaveRequestId),
    CONSTRAINT FK_ELR_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
    CONSTRAINT FK_ELR_ApprovedBy FOREIGN KEY (ApprovedBy) REFERENCES Staffs(EmployeeId),
    CONSTRAINT CK_LeaveRequest_DateRange CHECK (FromDate <= ToDate)
);

CREATE INDEX IX_ELR_EmployeeId ON EmployeeLeaveRequests(EmployeeId);
CREATE INDEX IX_ELR_Status ON EmployeeLeaveRequests(Status);

-- ============================================
-- EMPLOYEE ATTENDANCES
-- ============================================
CREATE TABLE EmployeeAttendances (
    AttendanceId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_EmployeeAttendances_AttendanceId DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    WorkDate DATE NOT NULL,
    CheckInTime TIME(0) NULL,
    CheckOutTime TIME(0) NULL,
    Status TINYINT NOT NULL CONSTRAINT DF_EmployeeAttendances_Status DEFAULT 0,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_EmployeeAttendances_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_EmployeeAttendances PRIMARY KEY (AttendanceId),
    CONSTRAINT FK_EA_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
    CONSTRAINT UQ_EA_Employee_WorkDate UNIQUE (EmployeeId, WorkDate),
    CONSTRAINT CK_Attendance_Time CHECK (CheckOutTime IS NULL OR CheckInTime IS NULL OR CheckInTime < CheckOutTime)
);

CREATE INDEX IX_IA_WorkDate ON EmployeeAttendances(WorkDate);

-- ============================================
-- TEACHING ASSIGNMENTS
-- ============================================
CREATE TABLE TeachingAssignments (
    AssignmentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_TeachingAssignments_AssignmentId DEFAULT NEWID(),
    InstructorId UNIQUEIDENTIFIER NOT NULL,
    CourseClassId UNIQUEIDENTIFIER NOT NULL,
    ClassId UNIQUEIDENTIFIER NOT NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_TeachingAssignments_IsActive DEFAULT 1,
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_TeachingAssignments_CreatedAt DEFAULT SYSDATETIME(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2(3) NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
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
CREATE TABLE RegistrationPeriods (
    RegistrationPeriodId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_RegistrationPeriods_RegistrationPeriodId DEFAULT NEWID(),
    Code VARCHAR(30) NOT NULL,
    Name VARCHAR(150) NOT NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    TargetConfig NVARCHAR(MAX) NULL,
    Status TINYINT NULL,
    MinCredits INT NULL,
    MaxCredits INT NULL,
    AllowRetake BIT NULL,
    Description TEXT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_RegistrationPeriods_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_RegistrationPeriods_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_RegistrationPeriods PRIMARY KEY (RegistrationPeriodId),
    CONSTRAINT FK_RegistrationPeriods_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
    CONSTRAINT UQ_RegistrationPeriods_Code UNIQUE (Code)
);

-- ============================================
-- COURSE REGISTRATIONS
-- ============================================
CREATE TABLE CourseRegistrations (
    CourseRegistrationId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_CourseRegistrations_CourseRegistrationId DEFAULT NEWSEQUENTIALID(),
    StudentId UNIQUEIDENTIFIER NOT NULL,
    CourseClassId UNIQUEIDENTIFIER NOT NULL,
    RegistrationPeriodId UNIQUEIDENTIFIER NOT NULL,
    RegistrationType TINYINT NULL,
    ReplacedGradeId UNIQUEIDENTIFIER NULL,
    RegisteredAt DATETIME2 NULL,
    Status TINYINT NULL,
    IsPaid BIT NULL,
    RowVersion ROWVERSION,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_CourseRegistrations_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_CourseRegistrations PRIMARY KEY (CourseRegistrationId),
    CONSTRAINT FK_CR_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_CR_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
    CONSTRAINT FK_CR_RegistrationPeriods FOREIGN KEY (RegistrationPeriodId) REFERENCES RegistrationPeriods(RegistrationPeriodId)
);

CREATE INDEX IX_CourseRegistrations_StudentId ON CourseRegistrations(StudentId);
CREATE INDEX IX_CourseRegistrations_CourseClassId ON CourseRegistrations(CourseClassId);
CREATE INDEX IX_CourseRegistrations_RegistrationPeriodId ON CourseRegistrations(RegistrationPeriodId);

-- ============================================
-- EQUIVALENT COURSES
-- ============================================
CREATE TABLE EquivalentCourses (
    EquivalentCoursesId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_EquivalentCourses_EquivalentCoursesId DEFAULT NEWID(),
    OriginalCourseId UNIQUEIDENTIFIER NOT NULL,
    EquivalentCourseId UNIQUEIDENTIFIER NOT NULL,
    EquivalenceType TINYINT NULL,
    EffectDate DATE NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_EquivalentCourses_IsActive DEFAULT 1,
    Note NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_EquivalentCourses_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
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
CREATE TABLE Buildings (
    BuildingId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Buildings_BuildingId DEFAULT NEWID(),
    Code NVARCHAR(100) NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Address NVARCHAR(200) NULL,
    TotalFloors TINYINT NULL,
    BuildingType VARCHAR(10) NULL,
    Description NVARCHAR(255) NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Buildings_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Buildings_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Buildings PRIMARY KEY (BuildingId),
    CONSTRAINT UQ_Buildings_Code UNIQUE (Code)
);

-- ============================================
-- FLOORS
-- ============================================
CREATE TABLE Floors (
    FloorId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Floors_FloorId DEFAULT NEWID(),
    Code NVARCHAR(100) NOT NULL,
    Name NVARCHAR(255) NULL,
    FloorNumber INT NOT NULL,
    BuildingId UNIQUEIDENTIFIER NOT NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Floors_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Floors_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Floors PRIMARY KEY (FloorId),
    CONSTRAINT FK_Floors_Buildings FOREIGN KEY (BuildingId) REFERENCES Buildings(BuildingId),
    CONSTRAINT UQ_Floors_Building_FloorNumber UNIQUE (BuildingId, FloorNumber),
    CONSTRAINT UQ_Floors_Building_Code UNIQUE (BuildingId, Code)
);

-- ============================================
-- ROOMS
-- ============================================
CREATE TABLE Rooms (
    RoomId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Rooms_RoomId DEFAULT NEWID(),
    Code NVARCHAR(100) NOT NULL,
    Name NVARCHAR(255) NULL,
    BuildingId UNIQUEIDENTIFIER NOT NULL,
    FloorFloorNumber INT NULL,
    Capacity INT NULL,
    Type NVARCHAR(50) NULL,
    Status NVARCHAR(50) NULL,
    HasProjector BIT NULL,
    HasAirConditioner BIT NULL,
    HasComputer BIT NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Rooms_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Rooms_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Rooms PRIMARY KEY (RoomId),
    CONSTRAINT FK_Rooms_Buildings FOREIGN KEY (BuildingId) REFERENCES Buildings(BuildingId),
    CONSTRAINT UQ_Rooms_Code UNIQUE (Code)
);

-- ============================================
-- TIME SLOTS
-- ============================================
CREATE TABLE TimeSlots (
    TimeSlotId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_TimeSlots_TimeSlotId DEFAULT NEWID(),
    SlotCode NVARCHAR(50) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_TimeSlots_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_TimeSlots_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_TimeSlots PRIMARY KEY (TimeSlotId),
    CONSTRAINT UQ_TimeSlots_Code UNIQUE (SlotCode)
);

-- ============================================
-- SCHEDULES
-- ============================================
CREATE TABLE Schedules (
    ScheduleId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Schedules_ScheduleId DEFAULT NEWID(),
    CourseClassId UNIQUEIDENTIFIER NOT NULL,
    EmployeeId UNIQUEIDENTIFIER NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL,
    DayOfWeek INT NOT NULL,
    Date DATE NULL,
    Shift NVARCHAR(50) NULL,
    TimeSlotId UNIQUEIDENTIFIER NOT NULL,
    NumberOfPeriods INT NULL,
    StartDate DATETIME2 NULL,
    EndDate DATETIME2 NULL,
    Mode NVARCHAR(100) NULL,
    Status NVARCHAR(255) NULL,
    Description NVARCHAR(255) NULL,
    ScheduleStatus VARCHAR(50) NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Schedules_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Schedules_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Schedules PRIMARY KEY (ScheduleId),
    CONSTRAINT FK_Schedules_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
    CONSTRAINT FK_Schedules_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
    CONSTRAINT FK_Schedules_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId),
    CONSTRAINT FK_Schedules_TimeSlots FOREIGN KEY (TimeSlotId) REFERENCES TimeSlots(TimeSlotId),
    CONSTRAINT UQ_Schedules_CourseClass_Day_Time UNIQUE (CourseClassId, DayOfWeek, TimeSlotId),
    CONSTRAINT UQ_Schedules_Room_Semester_Day_Time UNIQUE (RoomId, SemesterId, DayOfWeek, TimeSlotId)
);

-- ============================================
-- GRADE COMPONENTS
-- ============================================
CREATE TABLE GradeComponents (
    GradeComponentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GradeComponents_GradeComponentId DEFAULT NEWID(),
    CourseId UNIQUEIDENTIFIER NOT NULL,
    ComponentCode VARCHAR(20) NOT NULL,
    ComponentName VARCHAR(100) NOT NULL,
    WeightPercentage DECIMAL(5,2) NULL,
    MinScore DECIMAL(4,2) NULL,
    MaxScore DECIMAL(4,2) NULL,
    IsRequired BIT NULL,
    InputOrder INT NULL,
    Description VARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GradeComponents_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GradeComponents_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeleteAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GradeComponents PRIMARY KEY (GradeComponentId),
    CONSTRAINT FK_GradeComponents_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId),
    CONSTRAINT UQ_GradeComponents_Course_Code UNIQUE (CourseId, ComponentCode)
);

CREATE INDEX IX_GradeComponents_CourseId ON GradeComponents(CourseId);

-- ============================================
-- STUDENT GRADES
-- ============================================
CREATE TABLE StudentGrades (
    CourseRegistrationId UNIQUEIDENTIFIER NOT NULL,
    GradeComponentId UNIQUEIDENTIFIER NOT NULL,
    Score DECIMAL(4,2) NULL,
    IsLocked BIT NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_StudentGrades_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentGrades_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeleteAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_StudentGrades PRIMARY KEY (CourseRegistrationId, GradeComponentId),
    CONSTRAINT FK_SG_CourseRegistrations FOREIGN KEY (CourseRegistrationId) REFERENCES CourseRegistrations(CourseRegistrationId),
    CONSTRAINT FK_SG_GradeComponents FOREIGN KEY (GradeComponentId) REFERENCES GradeComponents(GradeComponentId)
);

-- ============================================
-- GRADE SCALES
-- ============================================
CREATE TABLE GradeScales (
    GradeScaleId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GradeScales_GradeScaleId DEFAULT NEWID(),
    ScaleName VARCHAR(100) NOT NULL,
    MinScore DECIMAL(4,2) NOT NULL,
    MaxScore DECIMAL(4,2) NOT NULL,
    LetterGrade VARCHAR(2) NOT NULL,
    GpaValue DECIMAL(3,2) NOT NULL,
    Description VARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GradeScales_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GradeScales_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeleteAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeleteBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GradeScales PRIMARY KEY (GradeScaleId),
    CONSTRAINT CK_GradeScales_MinMax CHECK (MinScore <= MaxScore)
);

-- ============================================
-- STUDENT SUMMARIES
-- ============================================
CREATE TABLE StudentSummaries (
    CourseRegistrationId UNIQUEIDENTIFIER NOT NULL,
    TotalScore DECIMAL(4,2) NULL,
    GradeScaleId UNIQUEIDENTIFIER NULL,
    LetterGrade VARCHAR(2) NULL,
    GpaValue DECIMAL(3,2) NULL,
    Result VARCHAR(10) NULL,
    IsFinalized BIT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_StudentSummaries_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentSummaries_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_StudentSummaries PRIMARY KEY (CourseRegistrationId),
    CONSTRAINT FK_SS_CourseRegistrations FOREIGN KEY (CourseRegistrationId) REFERENCES CourseRegistrations(CourseRegistrationId),
    CONSTRAINT FK_SS_GradeScales FOREIGN KEY (GradeScaleId) REFERENCES GradeScales(GradeScaleId)
);

-- ============================================
-- TUITION FEES
-- ============================================
CREATE TABLE TuitionFees (
    TuitionFeeId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_TuitionFees_TuitionFeeId DEFAULT NEWID(),
    TrainingProgramId UNIQUEIDENTIFIER NOT NULL,
    TrainingProgramCode VARCHAR(20) NULL,
    TrainingProgramName VARCHAR(255) NULL,
    CreditFee DECIMAL(10,2) NULL,
    TotalFee DECIMAL(12,2) NULL,
    TrainingType VARCHAR(50) NULL,
    AcademicYear VARCHAR(20) NULL,
    EffectiveDate DATE NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_TuitionFees_IsActive DEFAULT 1,
    CreatedAt DATETIME NOT NULL CONSTRAINT DF_TuitionFees_CreatedAt DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedAt DATETIME NULL,
    DeletedBy INT NULL,
    CONSTRAINT PK_TuitionFees PRIMARY KEY (TuitionFeeId),
    CONSTRAINT FK_TuitionFees_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId)
);

-- ============================================
-- STUDENT TUITION
-- ============================================
CREATE TABLE StudentTuition (
    StudentTuitionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_StudentTuition_StudentTuitionId DEFAULT NEWID(),
    StudentId UNIQUEIDENTIFIER NOT NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    TuitionFeeId UNIQUEIDENTIFIER NOT NULL,
    TotalCredits INT NULL,
    Discount DECIMAL(10,2) NULL,
    RawAmount DECIMAL(15,2) NULL,
    PayableAmount DECIMAL(12,2) NULL,
    PaidAmount DECIMAL(12,2) NULL,
    DebtAmount DECIMAL(15,2) NULL,
    PaymentStatus VARCHAR(30) NULL,
    DueDate DATE NULL,
    Note TEXT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_StudentTuition_IsActive DEFAULT 1,
    CreatedAt DATETIME NOT NULL CONSTRAINT DF_StudentTuition_CreatedAt DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedAt DATETIME NULL,
    DeletedBy INT NULL,
    CONSTRAINT PK_StudentTuition PRIMARY KEY (StudentTuitionId),
    CONSTRAINT FK_ST_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_ST_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId),
    CONSTRAINT FK_ST_TuitionFees FOREIGN KEY (TuitionFeeId) REFERENCES TuitionFees(TuitionFeeId),
    CONSTRAINT UQ_StudentTuitions UNIQUE (StudentId, SemesterId)
);

CREATE INDEX IX_StudentTuitions_SemesterId ON StudentTuition(SemesterId);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE Payments (
    PaymentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Payments_PaymentId DEFAULT NEWID(),
    StudentTuitionId UNIQUEIDENTIFIER NOT NULL,
    PaymentDate DATETIME NOT NULL,
    Amount DECIMAL(12,2) NOT NULL,
    PaymentMethod VARCHAR(50) NULL,
    TransactionCode VARCHAR(100) NULL,
    PaymentStatus VARCHAR(30) NULL,
    Cashier VARCHAR(100) NULL,
    Note TEXT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Payments_IsActive DEFAULT 1,
    CreatedAt DATETIME NOT NULL CONSTRAINT DF_Payments_CreatedAt DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedAt DATETIME NULL,
    DeletedBy INT NULL,
    CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),
    CONSTRAINT FK_Payments_StudentTuition FOREIGN KEY (StudentTuitionId) REFERENCES StudentTuition(StudentTuitionId),
    CONSTRAINT CK_Payments_Amount CHECK (Amount > 0)
);

CREATE INDEX IX_Payments_StudentTuitionId ON Payments(StudentTuitionId);

-- ============================================
-- EXAM TYPES
-- ============================================
CREATE TABLE ExamTypes (
    ExamTypeId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ExamTypes_ExamTypeId DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_ExamTypes_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ExamTypes_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_ExamTypes PRIMARY KEY (ExamTypeId)
);

-- ============================================
-- EXAMS
-- ============================================
CREATE TABLE Exams (
    ExamId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Exams_ExamId DEFAULT NEWID(),
    ExamTypeId UNIQUEIDENTIFIER NOT NULL,
    CourseClassId UNIQUEIDENTIFIER NOT NULL,
    SemesterId UNIQUEIDENTIFIER NOT NULL,
    ExamDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    DurationMinutes SMALLINT NULL,
    EndTime TIME NULL,
    ExamFormat VARCHAR(20) NULL,
    ExamStatus VARCHAR(20) NULL,
    SupervisorCount TINYINT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Exams_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Exams_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Exams PRIMARY KEY (ExamId),
    CONSTRAINT FK_Exams_ExamTypes FOREIGN KEY (ExamTypeId) REFERENCES ExamTypes(ExamTypeId),
    CONSTRAINT FK_Exams_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
    CONSTRAINT FK_Exams_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

-- ============================================
-- EXAM ROOMS
-- ============================================
CREATE TABLE ExamRooms (
    ExamRoomId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ExamRooms_ExamRoomId DEFAULT NEWID(),
    ExamId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL,
    Capacity INT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_ExamRooms_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ExamRooms_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_ExamRooms PRIMARY KEY (ExamRoomId),
    CONSTRAINT FK_ExamRooms_Exams FOREIGN KEY (ExamId) REFERENCES Exams(ExamId),
    CONSTRAINT FK_ExamRooms_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId)
);

-- ============================================
-- EXAM REGISTRATIONS
-- ============================================
CREATE TABLE ExamRegistrations (
    ExamRegistrationId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ExamRegistrations_ExamRegistrationId DEFAULT NEWID(),
    ExamId UNIQUEIDENTIFIER NOT NULL,
    ExamRoomId UNIQUEIDENTIFIER NOT NULL,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    RollNumber VARCHAR(20) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_ExamRegistrations_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ExamRegistrations_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_ExamRegistrations PRIMARY KEY (ExamRegistrationId),
    CONSTRAINT FK_ER_Exams FOREIGN KEY (ExamId) REFERENCES Exams(ExamId),
    CONSTRAINT FK_ER_ExamRooms FOREIGN KEY (ExamRoomId) REFERENCES ExamRooms(ExamRoomId),
    CONSTRAINT FK_ER_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId)
);

-- ============================================
-- EXAM PAPERS
-- ============================================
CREATE TABLE ExamPapers (
    ExamPaperId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ExamPapers_ExamPaperId DEFAULT NEWID(),
    ExamId UNIQUEIDENTIFIER NOT NULL,
    PaperCode VARCHAR(20) NULL,
    FileUrl NVARCHAR(500) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_ExamPapers_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ExamPapers_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_ExamPapers PRIMARY KEY (ExamPaperId),
    CONSTRAINT FK_ExamPapers_Exams FOREIGN KEY (ExamId) REFERENCES Exams(ExamId)
);

-- ============================================
-- EXAM RESULTS
-- ============================================
CREATE TABLE ExamResults (
    ExamResultId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ExamResults_ExamResultId DEFAULT NEWID(),
    RegistrationId UNIQUEIDENTIFIER NOT NULL,
    Score DECIMAL(4,2) NULL,
    Status NVARCHAR(50) NULL,
    GradedBy UNIQUEIDENTIFIER NULL,
    GradedAt DATETIME NULL,
    IsLocked BIT NULL,
    AppealStatus VARCHAR(20) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_ExamResults_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ExamResults_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_ExamResults PRIMARY KEY (ExamResultId),
    CONSTRAINT FK_ExamResults_ExamRegistrations FOREIGN KEY (RegistrationId) REFERENCES ExamRegistrations(ExamRegistrationId)
);

-- ============================================
-- GRADUATION CONDITIONS
-- ============================================
CREATE TABLE GraduationConditions (
    GraduationConditionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GraduationConditions_GraduationConditionId DEFAULT NEWID(),
    TrainingProgramId UNIQUEIDENTIFIER NOT NULL,
    AcademicCohortId UNIQUEIDENTIFIER NULL,
    ConditionCode NVARCHAR(50) NOT NULL,
    ConditionName NVARCHAR(200) NOT NULL,
    MinCredits INT NULL,
    MinGpa FLOAT NULL,
    MaxFailedCourses INT NULL,
    EnglishRequirement NVARCHAR(100) NULL,
    ItRequirement NVARCHAR(100) NULL,
    ConductRequired NVARCHAR(50) NULL,
    Description NVARCHAR(255) NULL,
    StartDate DATE NULL,
    DueDate DATE NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GraduationConditions_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GraduationConditions_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GraduationConditions PRIMARY KEY (GraduationConditionId),
    CONSTRAINT FK_GC_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
    CONSTRAINT FK_GC_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId)
);

-- ============================================
-- GRADUATION SESSIONS
-- ============================================
CREATE TABLE GraduationSessions (
    GraduationSessionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GraduationSessions_GraduationSessionId DEFAULT NEWID(),
    SessionCode NVARCHAR(50) NOT NULL,
    SessionName NVARCHAR(200) NOT NULL,
    AcademicCohortId UNIQUEIDENTIFIER NULL,
    SemesterId UNIQUEIDENTIFIER NULL,
    StartDate DATE NULL,
    DueDate DATE NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GraduationSessions_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GraduationSessions_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GraduationSessions PRIMARY KEY (GraduationSessionId),
    CONSTRAINT FK_GS_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
    CONSTRAINT FK_GS_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

-- ============================================
-- GRADUATION COUNCILS
-- ============================================
CREATE TABLE GraduationCouncils (
    GraduationCouncilId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GraduationCouncils_GraduationCouncilId DEFAULT NEWID(),
    CouncilCode NVARCHAR(50) NOT NULL,
    CouncilName NVARCHAR(200) NOT NULL,
    AcademicCohortId UNIQUEIDENTIFIER NULL,
    SemesterId UNIQUEIDENTIFIER NULL,
    DecisionNumber NVARCHAR(50) NULL,
    DecisionDate DATE NULL,
    ChairmanId UNIQUEIDENTIFIER NULL,
    SecretaryId UNIQUEIDENTIFIER NULL,
    Description NVARCHAR(255) NULL,
    StartDate DATE NULL,
    EndDate DATE NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GraduationCouncils_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GraduationCouncils_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GraduationCouncils PRIMARY KEY (GraduationCouncilId),
    CONSTRAINT FK_GradCouncil_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId),
    CONSTRAINT FK_GradCouncil_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(SemesterId)
);

-- ============================================
-- GRADUATION RESULTS
-- ============================================
CREATE TABLE GraduationResults (
    GraduationResultId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GraduationResults_GraduationResultId DEFAULT NEWID(),
    StudentId UNIQUEIDENTIFIER NOT NULL,
    GraduationConditionId UNIQUEIDENTIFIER NOT NULL,
    TotalCredits INT NULL,
    Gpa FLOAT NULL,
    FailedCourses INT NULL,
    GraduationStatus NVARCHAR(50) NULL,
    GraduationRank NVARCHAR(50) NULL,
    DecisionNumber NVARCHAR(50) NULL,
    GraduationCouncilId UNIQUEIDENTIFIER NULL,
    DecisionDate DATE NULL,
    StartDate DATE NULL,
    DueDate DATE NULL,
    Note NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GraduationResults_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GraduationResults_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GraduationResults PRIMARY KEY (GraduationResultId),
    CONSTRAINT FK_GR_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_GR_GraduationConditions FOREIGN KEY (GraduationConditionId) REFERENCES GraduationConditions(GraduationConditionId),
    CONSTRAINT FK_GR_GraduationCouncils FOREIGN KEY (GraduationCouncilId) REFERENCES GraduationCouncils(GraduationCouncilId)
);

-- ============================================
-- GRADUATION PROFILES
-- ============================================
CREATE TABLE GraduationProfiles (
    GraduationProfileId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_GraduationProfiles_GraduationProfileId DEFAULT NEWID(),
    StudentId UNIQUEIDENTIFIER NOT NULL,
    CouncilId UNIQUEIDENTIFIER NOT NULL,
    GraduationConditionId UNIQUEIDENTIFIER NOT NULL,
    ProfileCode NVARCHAR(50) NOT NULL,
    SubmissionDate DATE NULL,
    Status NVARCHAR(50) NULL,
    ReviewerId UNIQUEIDENTIFIER NULL,
    ReviewDate DATE NULL,
    Note NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_GraduationProfiles_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_GraduationProfiles_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_GraduationProfiles PRIMARY KEY (GraduationProfileId),
    CONSTRAINT FK_GP_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_GP_GraduationCouncils FOREIGN KEY (CouncilId) REFERENCES GraduationCouncils(GraduationCouncilId),
    CONSTRAINT FK_GP_GraduationConditions FOREIGN KEY (GraduationConditionId) REFERENCES GraduationConditions(GraduationConditionId)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE Notifications (
    NotificationId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Notifications_NotificationId DEFAULT NEWID(),
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    TypeId VARCHAR(50) NULL,
    Priority VARCHAR(20) NULL,
    TargetRoleId UNIQUEIDENTIFIER NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Notifications_IsActive DEFAULT 1,
    CreatedAt DATETIME NOT NULL CONSTRAINT DF_Notifications_CreatedAt DEFAULT GETDATE(),
    UpdateAt DATETIME NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Notifications PRIMARY KEY (NotificationId),
    CONSTRAINT FK_Notifications_Roles FOREIGN KEY (TargetRoleId) REFERENCES Roles(RoleId)
);

-- ============================================
-- USER NOTIFICATIONS
-- ============================================
CREATE TABLE UserNotifications (
    UserNotificationId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_UserNotifications_UserNotificationId DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    NotificationId UNIQUEIDENTIFIER NOT NULL,
    IsRead BIT NOT NULL CONSTRAINT DF_UserNotifications_IsRead DEFAULT 0,
    ReadAt DATETIME2 NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_UserNotifications_IsActive DEFAULT 1,
    CreatedAt DATETIME NOT NULL CONSTRAINT DF_UserNotifications_CreatedAt DEFAULT GETDATE(),
    UpdateAt DATETIME NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_UserNotifications PRIMARY KEY (UserNotificationId),
    CONSTRAINT FK_UN_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_UN_Notifications FOREIGN KEY (NotificationId) REFERENCES Notifications(NotificationId)
);

-- ============================================
-- LOGS
-- ============================================
CREATE TABLE Logs (
    LogId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Logs_LogId DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    Action VARCHAR(50) NOT NULL,
    TableName VARCHAR(100) NULL,
    RecordId UNIQUEIDENTIFIER NULL,
    Description NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Logs_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Logs_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Logs PRIMARY KEY (LogId),
    CONSTRAINT FK_Logs_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE Settings (
    SettingId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Settings_SettingId DEFAULT NEWID(),
    SettingKey NVARCHAR(100) NOT NULL,
    SettingValue NVARCHAR(MAX) NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Settings_IsActive DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Settings_CreatedAt DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_Settings PRIMARY KEY (SettingId),
    CONSTRAINT UQ_Settings_Key UNIQUE (SettingKey)
);