-- Seed RBAC for student class assignment and student status management.

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT NEWID(), Code, Name, Description, Module, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_CLASS_VIEW', N'Xem lớp hành chính của sinh viên', N'Admin xem quan hệ sinh viên và lớp hành chính theo học kỳ', 'STUDENT_MANAGEMENT'),
    ('STUDENT_CLASS_CREATE', N'Gán lớp hành chính cho sinh viên', N'Admin gán sinh viên vào lớp hành chính theo học kỳ', 'STUDENT_MANAGEMENT'),
    ('STUDENT_CLASS_EDIT', N'Sửa lớp hành chính của sinh viên', N'Admin cập nhật quan hệ sinh viên và lớp hành chính', 'STUDENT_MANAGEMENT'),
    ('STUDENT_CLASS_DELETE', N'Xóa lớp hành chính của sinh viên', N'Admin xóa mềm quan hệ sinh viên và lớp hành chính', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_VIEW', N'Xem danh mục trạng thái sinh viên', N'Admin xem danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_CREATE', N'Tạo danh mục trạng thái sinh viên', N'Admin tạo danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_EDIT', N'Sửa danh mục trạng thái sinh viên', N'Admin cập nhật danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_DELETE', N'Xóa danh mục trạng thái sinh viên', N'Admin xóa mềm danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_VIEW', N'Xem lịch sử trạng thái sinh viên', N'Admin xem lịch sử trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_CREATE', N'Gán trạng thái sinh viên', N'Admin ghi nhận trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_EDIT', N'Sửa lịch sử trạng thái sinh viên', N'Admin cập nhật lịch sử trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_DELETE', N'Xóa lịch sử trạng thái sinh viên', N'Admin xóa mềm lịch sử trạng thái sinh viên', 'STUDENT_MANAGEMENT')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

DECLARE @AdminRoleId UNIQUEIDENTIFIER;
DECLARE @SuperAdminRoleId UNIQUEIDENTIFIER;

SELECT @AdminRoleId = RoleId FROM Roles WHERE Code = 'ADMIN';
SELECT @SuperAdminRoleId = RoleId FROM Roles WHERE Code = 'SUPER_ADMIN';

IF @AdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @AdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN (
        'STUDENT_CLASS_VIEW','STUDENT_CLASS_CREATE','STUDENT_CLASS_EDIT','STUDENT_CLASS_DELETE',
        'STUDENT_STATUS_CATALOG_VIEW','STUDENT_STATUS_CATALOG_CREATE','STUDENT_STATUS_CATALOG_EDIT','STUDENT_STATUS_CATALOG_DELETE',
        'STUDENT_STATUS_HISTORY_VIEW','STUDENT_STATUS_HISTORY_CREATE','STUDENT_STATUS_HISTORY_EDIT','STUDENT_STATUS_HISTORY_DELETE'
    )
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @AdminRoleId AND rp.PermissionId = p.PermissionId);
END

IF @SuperAdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @SuperAdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN (
        'STUDENT_CLASS_VIEW','STUDENT_CLASS_CREATE','STUDENT_CLASS_EDIT','STUDENT_CLASS_DELETE',
        'STUDENT_STATUS_CATALOG_VIEW','STUDENT_STATUS_CATALOG_CREATE','STUDENT_STATUS_CATALOG_EDIT','STUDENT_STATUS_CATALOG_DELETE',
        'STUDENT_STATUS_HISTORY_VIEW','STUDENT_STATUS_HISTORY_CREATE','STUDENT_STATUS_HISTORY_EDIT','STUDENT_STATUS_HISTORY_DELETE'
    )
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @SuperAdminRoleId AND rp.PermissionId = p.PermissionId);
END

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_CLASS_VIEW', '/api/v1/student-classes/admin/**', 'GET', N'Admin xem lớp hành chính của sinh viên'),
    ('STUDENT_CLASS_CREATE', '/api/v1/student-classes/admin/**', 'POST', N'Admin gán lớp hành chính cho sinh viên'),
    ('STUDENT_CLASS_EDIT', '/api/v1/student-classes/admin/**', 'PUT', N'Admin sửa lớp hành chính của sinh viên'),
    ('STUDENT_CLASS_DELETE', '/api/v1/student-classes/admin/**', 'DELETE', N'Admin xóa lớp hành chính của sinh viên'),
    ('STUDENT_STATUS_CATALOG_VIEW', '/api/v1/student-status-catalog/admin/**', 'GET', N'Admin xem danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_CATALOG_CREATE', '/api/v1/student-status-catalog/admin/**', 'POST', N'Admin tạo danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_CATALOG_EDIT', '/api/v1/student-status-catalog/admin/**', 'PUT', N'Admin sửa danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_CATALOG_DELETE', '/api/v1/student-status-catalog/admin/**', 'DELETE', N'Admin xóa danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_VIEW', '/api/v1/student-status-histories/admin/**', 'GET', N'Admin xem lịch sử trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_CREATE', '/api/v1/student-status-histories/admin/**', 'POST', N'Admin gán trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_EDIT', '/api/v1/student-status-histories/admin/**', 'PUT', N'Admin sửa lịch sử trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_DELETE', '/api/v1/student-status-histories/admin/**', 'DELETE', N'Admin xóa lịch sử trạng thái sinh viên')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId
      AND pa.ApiPath = src.ApiPath
      AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT NEWID(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    (N'Lớp sinh viên theo học kỳ', '/dashboard/admin/student-classes', 'user-round-check', 190, 1, 'STUDENT_CLASS_VIEW'),
    (N'Trạng thái sinh viên', '/dashboard/admin/student-status-catalog', 'list-checks', 200, 1, 'STUDENT_STATUS_CATALOG_VIEW'),
    (N'Lịch sử trạng thái sinh viên', '/dashboard/admin/student-status-histories', 'history', 210, 1, 'STUDENT_STATUS_HISTORY_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);
