-- Support foundation phase first, then specialization phase later.

IF OBJECT_ID('Specializations', 'U') IS NULL
BEGIN
    CREATE TABLE Specializations (
        SpecializationId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Specializations_SpecializationId DEFAULT NEWID(),
        DepartmentId UNIQUEIDENTIFIER NOT NULL,
        MajorId UNIQUEIDENTIFIER NOT NULL,
        Code NVARCHAR(50) NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(500) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_Specializations_IsActive DEFAULT 1,
        CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Specializations_CreatedAt DEFAULT SYSDATETIME(),
        CreatedBy UNIQUEIDENTIFIER NULL,
        UpdatedAt DATETIME2(3) NULL,
        UpdatedBy UNIQUEIDENTIFIER NULL,
        DeletedAt DATETIME2(3) NULL,
        DeletedBy UNIQUEIDENTIFIER NULL,
        CONSTRAINT PK_Specializations PRIMARY KEY (SpecializationId),
        CONSTRAINT UQ_Specializations_Code UNIQUE (Code),
        CONSTRAINT FK_Specializations_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
        CONSTRAINT FK_Specializations_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId)
    );
END

IF COL_LENGTH('Students', 'DepartmentId') IS NULL
BEGIN
    ALTER TABLE Students ADD DepartmentId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('Students', 'SpecializationId') IS NULL
BEGIN
    ALTER TABLE Students ADD SpecializationId UNIQUEIDENTIFIER NULL;
END

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('Students') AND name = 'TrainingProgramId' AND is_nullable = 0
)
BEGIN
    ALTER TABLE Students ALTER COLUMN TrainingProgramId UNIQUEIDENTIFIER NULL;
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Students_Departments')
BEGIN
    ALTER TABLE Students ADD CONSTRAINT FK_Students_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Students_Specializations')
BEGIN
    ALTER TABLE Students ADD CONSTRAINT FK_Students_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId);
END

IF COL_LENGTH('TrainingPrograms', 'SpecializationId') IS NULL
BEGIN
    ALTER TABLE TrainingPrograms ADD SpecializationId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('TrainingPrograms', 'ProgramPhase') IS NULL
BEGIN
    ALTER TABLE TrainingPrograms ADD ProgramPhase NVARCHAR(30) NULL CONSTRAINT DF_TrainingPrograms_ProgramPhase DEFAULT 'FOUNDATION';
END

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('TrainingPrograms') AND name = 'MajorId' AND is_nullable = 0
)
BEGIN
    ALTER TABLE TrainingPrograms ALTER COLUMN MajorId UNIQUEIDENTIFIER NULL;
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_TrainingPrograms_Specializations')
BEGIN
    ALTER TABLE TrainingPrograms ADD CONSTRAINT FK_TrainingPrograms_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId);
END

IF COL_LENGTH('Classes', 'MajorId') IS NULL
BEGIN
    ALTER TABLE Classes ADD MajorId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('Classes', 'SpecializationId') IS NULL
BEGIN
    ALTER TABLE Classes ADD SpecializationId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('Classes', 'ClassPhase') IS NULL
BEGIN
    ALTER TABLE Classes ADD ClassPhase NVARCHAR(30) NULL CONSTRAINT DF_Classes_ClassPhase DEFAULT 'FOUNDATION';
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Classes_Majors')
BEGIN
    ALTER TABLE Classes ADD CONSTRAINT FK_Classes_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Classes_Specializations')
BEGIN
    ALTER TABLE Classes ADD CONSTRAINT FK_Classes_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId);
END

IF COL_LENGTH('TrainingProgramCourses', 'CoursePhase') IS NULL
BEGIN
    ALTER TABLE TrainingProgramCourses ADD CoursePhase NVARCHAR(30) NULL CONSTRAINT DF_TPC_CoursePhase DEFAULT 'FOUNDATION';
END

IF OBJECT_ID('StudentSpecializationHistories', 'U') IS NULL
BEGIN
    CREATE TABLE StudentSpecializationHistories (
        StudentSpecializationHistoryId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_SSH2_Id DEFAULT NEWID(),
        StudentId UNIQUEIDENTIFIER NOT NULL,
        MajorId UNIQUEIDENTIFIER NOT NULL,
        SpecializationId UNIQUEIDENTIFIER NOT NULL,
        TrainingProgramId UNIQUEIDENTIFIER NOT NULL,
        EffectiveSemesterId UNIQUEIDENTIFIER NOT NULL,
        StartDate DATE NOT NULL,
        EndDate DATE NULL,
        IsCurrent BIT NOT NULL CONSTRAINT DF_SSH2_IsCurrent DEFAULT 1,
        Reason NVARCHAR(255) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_SSH2_IsActive DEFAULT 1,
        CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_SSH2_CreatedAt DEFAULT SYSDATETIME(),
        CreatedBy UNIQUEIDENTIFIER NULL,
        UpdatedAt DATETIME2(3) NULL,
        UpdatedBy UNIQUEIDENTIFIER NULL,
        DeletedAt DATETIME2(3) NULL,
        DeletedBy UNIQUEIDENTIFIER NULL,
        CONSTRAINT PK_StudentSpecializationHistories PRIMARY KEY (StudentSpecializationHistoryId),
        CONSTRAINT FK_SSH2_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
        CONSTRAINT FK_SSH2_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId),
        CONSTRAINT FK_SSH2_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId),
        CONSTRAINT FK_SSH2_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
        CONSTRAINT FK_SSH2_Semesters FOREIGN KEY (EffectiveSemesterId) REFERENCES Semesters(SemesterId),
        CONSTRAINT CK_SSH2_DateRange CHECK (EndDate IS NULL OR StartDate <= EndDate)
    );
END

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT NEWID(), Code, Name, Description, Module, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('SPECIALIZATION_VIEW', N'Xem chuyên ngành', N'Admin xem chuyên ngành theo khoa và ngành', 'ACADEMIC_CATALOG'),
    ('SPECIALIZATION_CREATE', N'Tạo chuyên ngành', N'Admin tạo chuyên ngành', 'ACADEMIC_CATALOG'),
    ('SPECIALIZATION_EDIT', N'Sửa chuyên ngành', N'Admin cập nhật chuyên ngành', 'ACADEMIC_CATALOG'),
    ('SPECIALIZATION_DELETE', N'Xóa chuyên ngành', N'Admin xóa mềm chuyên ngành', 'ACADEMIC_CATALOG'),
    ('STUDENT_SPECIALIZATION_VIEW', N'Xem phân chuyên ngành sinh viên', N'Admin xem lịch sử phân chuyên ngành sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_SPECIALIZATION_ASSIGN', N'Gán chuyên ngành sinh viên', N'Admin gán chuyên ngành và chương trình đào tạo cho sinh viên', 'STUDENT_MANAGEMENT'),
    ('TRAINING_PROGRAM_COURSE_VIEW', N'Xem học phần chương trình đào tạo', N'Admin xem học phần trong chương trình đào tạo', 'ACADEMIC_CATALOG')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('SPECIALIZATION_VIEW', '/api/v1/specializations/admin/**', 'GET', N'Admin xem chuyên ngành'),
    ('SPECIALIZATION_CREATE', '/api/v1/specializations/admin/**', 'POST', N'Admin tạo chuyên ngành'),
    ('SPECIALIZATION_EDIT', '/api/v1/specializations/admin/**', 'PUT', N'Admin sửa chuyên ngành'),
    ('SPECIALIZATION_DELETE', '/api/v1/specializations/admin/**', 'DELETE', N'Admin xóa chuyên ngành'),
    ('STUDENT_SPECIALIZATION_VIEW', '/api/v1/student-specializations/admin/**', 'GET', N'Admin xem phân chuyên ngành'),
    ('STUDENT_SPECIALIZATION_ASSIGN', '/api/v1/student-specializations/admin/**', 'POST', N'Admin gán chuyên ngành'),
    ('TRAINING_PROGRAM_COURSE_VIEW', '/api/v1/training-program-courses/admin/**', 'GET', N'Admin xem học phần chương trình')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId AND pa.ApiPath = src.ApiPath AND pa.HttpMethod = src.HttpMethod
);

DECLARE @AdminRoleId UNIQUEIDENTIFIER;
DECLARE @SuperAdminRoleId UNIQUEIDENTIFIER;

SELECT @AdminRoleId = RoleId FROM Roles WHERE Code = 'ADMIN';
SELECT @SuperAdminRoleId = RoleId FROM Roles WHERE Code = 'SUPER_ADMIN';

IF @AdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @AdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN ('SPECIALIZATION_VIEW','SPECIALIZATION_CREATE','SPECIALIZATION_EDIT','SPECIALIZATION_DELETE',
                     'STUDENT_SPECIALIZATION_VIEW','STUDENT_SPECIALIZATION_ASSIGN','TRAINING_PROGRAM_COURSE_VIEW')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @AdminRoleId AND rp.PermissionId = p.PermissionId);
END

IF @SuperAdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @SuperAdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN ('SPECIALIZATION_VIEW','SPECIALIZATION_CREATE','SPECIALIZATION_EDIT','SPECIALIZATION_DELETE',
                     'STUDENT_SPECIALIZATION_VIEW','STUDENT_SPECIALIZATION_ASSIGN','TRAINING_PROGRAM_COURSE_VIEW')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @SuperAdminRoleId AND rp.PermissionId = p.PermissionId);
END

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT NEWID(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    (N'Chuyên ngành', '/dashboard/admin/specializations', 'git-branch', 220, 1, 'SPECIALIZATION_VIEW'),
    (N'Phân chuyên ngành sinh viên', '/dashboard/admin/student-specializations', 'route', 230, 1, 'STUDENT_SPECIALIZATION_VIEW'),
    (N'Học phần chương trình', '/dashboard/admin/training-program-courses', 'list-tree', 240, 1, 'TRAINING_PROGRAM_COURSE_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);
