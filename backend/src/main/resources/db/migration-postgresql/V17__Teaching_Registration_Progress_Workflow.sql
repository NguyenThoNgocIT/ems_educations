ALTER TABLE CourseClasses ADD COLUMN IF NOT EXISTS StartDate DATE NULL;
ALTER TABLE CourseClasses ADD COLUMN IF NOT EXISTS EndDate DATE NULL;

CREATE TABLE IF NOT EXISTS TeachingProgressLogs (
    TeachingProgressLogId UUID NOT NULL DEFAULT gen_random_uuid(),
    CourseClassId UUID NOT NULL,
    ScheduleId UUID NULL,
    InstructorId UUID NULL,
    TeachingDate DATE NOT NULL,
    PlannedPeriods INT NULL,
    ActualPeriods INT NULL,
    IsInstructorAbsent BOOLEAN NULL,
    Status VARCHAR(30) NULL,
    Note VARCHAR(255) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy UUID NULL,
    UpdatedAt TIMESTAMP(3) NULL,
    UpdatedBy UUID NULL,
    DeletedAt TIMESTAMP(3) NULL,
    DeletedBy UUID NULL,
    CONSTRAINT PK_TeachingProgressLogs PRIMARY KEY (TeachingProgressLogId),
    CONSTRAINT FK_TPL_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
    CONSTRAINT FK_TPL_Schedules FOREIGN KEY (ScheduleId) REFERENCES Schedules(ScheduleId),
    CONSTRAINT FK_TPL_Instructors FOREIGN KEY (InstructorId) REFERENCES Employees(EmployeeId),
    CONSTRAINT CK_TPL_ActualPeriods CHECK (ActualPeriods IS NULL OR ActualPeriods >= 0),
    CONSTRAINT CK_TPL_PlannedPeriods CHECK (PlannedPeriods IS NULL OR PlannedPeriods >= 0)
);

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('TEACHING_ASSIGNMENT_VIEW', 'Xem phân công giảng dạy', 'Admin xem phân công giảng dạy', 'TEACHING'),
    ('TEACHING_ASSIGNMENT_CREATE', 'Phân công giảng dạy', 'Admin phân công giảng viên dạy lớp học phần', 'TEACHING'),
    ('TEACHING_PROGRESS_VIEW', 'Xem tiến độ giảng dạy', 'Admin xem tiến độ giảng dạy', 'TEACHING'),
    ('TEACHING_PROGRESS_CREATE', 'Ghi nhận buổi dạy', 'Admin ghi nhận buổi dạy thực tế', 'TEACHING')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('TEACHING_ASSIGNMENT_VIEW', '/api/v1/teaching-assignments/admin/**', 'GET', 'Admin xem phân công giảng dạy'),
    ('TEACHING_ASSIGNMENT_CREATE', '/api/v1/teaching-assignments/admin/**', 'POST', 'Admin phân công giảng dạy'),
    ('TEACHING_PROGRESS_VIEW', '/api/v1/teaching-progress/admin/**', 'GET', 'Admin xem tiến độ giảng dạy'),
    ('TEACHING_PROGRESS_CREATE', '/api/v1/teaching-progress/admin/**', 'POST', 'Admin ghi nhận buổi dạy')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId AND pa.ApiPath = src.ApiPath AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('TEACHING_ASSIGNMENT_VIEW','TEACHING_ASSIGNMENT_CREATE','TEACHING_PROGRESS_VIEW','TEACHING_PROGRESS_CREATE')
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('Phân công giảng dạy', '/dashboard/admin/teaching-assignments', 'clipboard-check', 250, 1, 'TEACHING_ASSIGNMENT_VIEW'),
    ('Tiến độ giảng dạy', '/dashboard/admin/teaching-progress', 'activity', 260, 1, 'TEACHING_PROGRESS_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);