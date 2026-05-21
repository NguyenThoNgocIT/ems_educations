-- Course registration, teaching assignment and teaching progress workflow support.

IF COL_LENGTH('CourseClasses', 'StartDate') IS NULL
BEGIN
    ALTER TABLE CourseClasses ADD StartDate DATE NULL;
END

IF COL_LENGTH('CourseClasses', 'EndDate') IS NULL
BEGIN
    ALTER TABLE CourseClasses ADD EndDate DATE NULL;
END

IF OBJECT_ID('TeachingProgressLogs', 'U') IS NULL
BEGIN
    CREATE TABLE TeachingProgressLogs (
        TeachingProgressLogId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_TeachingProgressLogs_Id DEFAULT NEWID(),
        CourseClassId UNIQUEIDENTIFIER NOT NULL,
        ScheduleId UNIQUEIDENTIFIER NULL,
        InstructorId UNIQUEIDENTIFIER NULL,
        TeachingDate DATE NOT NULL,
        PlannedPeriods INT NULL,
        ActualPeriods INT NULL,
        IsInstructorAbsent BIT NULL,
        Status NVARCHAR(30) NULL,
        Note NVARCHAR(255) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_TeachingProgressLogs_IsActive DEFAULT 1,
        CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_TeachingProgressLogs_CreatedAt DEFAULT SYSDATETIME(),
        CreatedBy UNIQUEIDENTIFIER NULL,
        UpdatedAt DATETIME2(3) NULL,
        UpdatedBy UNIQUEIDENTIFIER NULL,
        DeletedAt DATETIME2(3) NULL,
        DeletedBy UNIQUEIDENTIFIER NULL,
        CONSTRAINT PK_TeachingProgressLogs PRIMARY KEY (TeachingProgressLogId),
        CONSTRAINT FK_TPL_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
        CONSTRAINT FK_TPL_Schedules FOREIGN KEY (ScheduleId) REFERENCES Schedules(ScheduleId),
        CONSTRAINT FK_TPL_Instructors FOREIGN KEY (InstructorId) REFERENCES Employees(EmployeeId),
        CONSTRAINT CK_TPL_ActualPeriods CHECK (ActualPeriods IS NULL OR ActualPeriods >= 0),
        CONSTRAINT CK_TPL_PlannedPeriods CHECK (PlannedPeriods IS NULL OR PlannedPeriods >= 0)
    );
END

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT NEWID(), Code, Name, Description, Module, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('TEACHING_ASSIGNMENT_VIEW', N'Xem phân công giảng dạy', N'Admin xem phân công giảng dạy', 'TEACHING'),
    ('TEACHING_ASSIGNMENT_CREATE', N'Phân công giảng dạy', N'Admin phân công giảng viên dạy lớp học phần', 'TEACHING'),
    ('TEACHING_PROGRESS_VIEW', N'Xem tiến độ giảng dạy', N'Admin xem tiến độ giảng dạy', 'TEACHING'),
    ('TEACHING_PROGRESS_CREATE', N'Ghi nhận buổi dạy', N'Admin ghi nhận buổi dạy thực tế', 'TEACHING')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('TEACHING_ASSIGNMENT_VIEW', '/api/v1/teaching-assignments/admin/**', 'GET', N'Admin xem phân công giảng dạy'),
    ('TEACHING_ASSIGNMENT_CREATE', '/api/v1/teaching-assignments/admin/**', 'POST', N'Admin phân công giảng dạy'),
    ('TEACHING_PROGRESS_VIEW', '/api/v1/teaching-progress/admin/**', 'GET', N'Admin xem tiến độ giảng dạy'),
    ('TEACHING_PROGRESS_CREATE', '/api/v1/teaching-progress/admin/**', 'POST', N'Admin ghi nhận buổi dạy')
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
    WHERE p.Code IN ('TEACHING_ASSIGNMENT_VIEW','TEACHING_ASSIGNMENT_CREATE','TEACHING_PROGRESS_VIEW','TEACHING_PROGRESS_CREATE')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @AdminRoleId AND rp.PermissionId = p.PermissionId);
END

IF @SuperAdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @SuperAdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN ('TEACHING_ASSIGNMENT_VIEW','TEACHING_ASSIGNMENT_CREATE','TEACHING_PROGRESS_VIEW','TEACHING_PROGRESS_CREATE')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @SuperAdminRoleId AND rp.PermissionId = p.PermissionId);
END

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT NEWID(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    (N'Phân công giảng dạy', '/dashboard/admin/teaching-assignments', 'clipboard-check', 250, 1, 'TEACHING_ASSIGNMENT_VIEW'),
    (N'Tiến độ giảng dạy', '/dashboard/admin/teaching-progress', 'activity', 260, 1, 'TEACHING_PROGRESS_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);
