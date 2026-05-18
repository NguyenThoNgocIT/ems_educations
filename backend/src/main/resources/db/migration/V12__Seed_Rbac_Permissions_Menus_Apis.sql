-- Seed RBAC permissions, role-permission defaults, menu entries, and API mappings.

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT NEWID(), Code, Name, Description, Module, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_SELF_VIEW', N'Sinh viên xem hồ sơ cá nhân', N'Sinh viên xem thông tin của chính mình', 'STUDENT'),
    ('STUDENT_SELF_UPDATE', N'Sinh viên cập nhật hồ sơ cá nhân', N'Sinh viên cập nhật thông tin Persons của chính mình', 'STUDENT'),
    ('INSTRUCTOR_CREATE', N'Tạo giảng viên', N'Tạo giảng viên và tài khoản', 'INSTRUCTOR'),
    ('INSTRUCTOR_VIEW', N'Xem giảng viên', N'Xem danh sách và chi tiết giảng viên', 'INSTRUCTOR'),
    ('INSTRUCTOR_EDIT', N'Sửa giảng viên', N'Cập nhật thông tin giảng viên', 'INSTRUCTOR'),
    ('INSTRUCTOR_DELETE', N'Xóa giảng viên', N'Xóa mềm giảng viên', 'INSTRUCTOR'),
    ('INSTRUCTOR_SELF_VIEW', N'Giảng viên xem hồ sơ cá nhân', N'Giảng viên xem thông tin của chính mình', 'INSTRUCTOR'),
    ('INSTRUCTOR_SELF_UPDATE', N'Giảng viên cập nhật hồ sơ cá nhân', N'Giảng viên cập nhật thông tin Persons của chính mình', 'INSTRUCTOR'),
    ('STAFF_CREATE', N'Tạo nhân viên hành chính', N'Tạo nhân viên hành chính và tài khoản', 'STAFF'),
    ('STAFF_VIEW', N'Xem nhân viên hành chính', N'Xem danh sách và chi tiết nhân viên hành chính', 'STAFF'),
    ('STAFF_EDIT', N'Sửa nhân viên hành chính', N'Cập nhật thông tin nhân viên hành chính', 'STAFF'),
    ('STAFF_DELETE', N'Xóa nhân viên hành chính', N'Xóa mềm nhân viên hành chính', 'STAFF'),
    ('STAFF_SELF_VIEW', N'Nhân viên xem hồ sơ cá nhân', N'Nhân viên xem thông tin của chính mình', 'STAFF'),
    ('STAFF_SELF_UPDATE', N'Nhân viên cập nhật hồ sơ cá nhân', N'Nhân viên cập nhật thông tin Persons của chính mình', 'STAFF'),
    ('MENU_VIEW', N'Xem menu', N'Xem cấu hình menu', 'RBAC'),
    ('MENU_CREATE', N'Tạo menu', N'Tạo menu mới', 'RBAC'),
    ('MENU_EDIT', N'Sửa menu', N'Cập nhật menu', 'RBAC'),
    ('MENU_DELETE', N'Xóa menu', N'Xóa mềm menu', 'RBAC'),
    ('PERMISSION_API_EDIT', N'Cấu hình API theo quyền', N'Tạo và xóa mapping PermissionApis', 'RBAC')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

DECLARE @AdminRoleId UNIQUEIDENTIFIER;
DECLARE @SuperAdminRoleId UNIQUEIDENTIFIER;
DECLARE @StudentRoleId UNIQUEIDENTIFIER;
DECLARE @LecturerRoleId UNIQUEIDENTIFIER;
DECLARE @StaffRoleId UNIQUEIDENTIFIER;

SELECT @AdminRoleId = RoleId FROM Roles WHERE Code = 'ADMIN';
SELECT @SuperAdminRoleId = RoleId FROM Roles WHERE Code = 'SUPER_ADMIN';
SELECT @StudentRoleId = RoleId FROM Roles WHERE Code = 'STUDENT';
SELECT @LecturerRoleId = RoleId FROM Roles WHERE Code = 'LECTURER';
SELECT @StaffRoleId = RoleId FROM Roles WHERE Code = 'STAFF';

IF @AdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @AdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @AdminRoleId AND rp.PermissionId = p.PermissionId);

    UPDATE rp SET IsActive = 1
    FROM RolePermissions rp
    WHERE rp.RoleId = @AdminRoleId;
END

IF @SuperAdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @SuperAdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @SuperAdminRoleId AND rp.PermissionId = p.PermissionId);

    UPDATE rp SET IsActive = 1
    FROM RolePermissions rp
    WHERE rp.RoleId = @SuperAdminRoleId;
END

IF @StudentRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @StudentRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN ('STUDENT_SELF_VIEW', 'STUDENT_SELF_UPDATE')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @StudentRoleId AND rp.PermissionId = p.PermissionId);
END

IF @LecturerRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @LecturerRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN ('INSTRUCTOR_SELF_VIEW', 'INSTRUCTOR_SELF_UPDATE')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @LecturerRoleId AND rp.PermissionId = p.PermissionId);
END

IF @StaffRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @StaffRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN ('STAFF_SELF_VIEW', 'STAFF_SELF_UPDATE')
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @StaffRoleId AND rp.PermissionId = p.PermissionId);
END

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_VIEW', '/api/v1/students/admin/**', 'GET', N'Admin xem sinh viên'),
    ('STUDENT_CREATE', '/api/v1/students/admin/**', 'POST', N'Admin tạo sinh viên'),
    ('STUDENT_EDIT', '/api/v1/students/admin/**', 'PUT', N'Admin sửa sinh viên'),
    ('STUDENT_DELETE', '/api/v1/students/admin/**', 'DELETE', N'Admin xóa sinh viên'),
    ('STUDENT_SELF_VIEW', '/api/v1/students/me', 'GET', N'Sinh viên xem hồ sơ cá nhân'),
    ('STUDENT_SELF_UPDATE', '/api/v1/students/me', 'PUT', N'Sinh viên sửa hồ sơ cá nhân'),
    ('INSTRUCTOR_VIEW', '/api/v1/instructors/admin/**', 'GET', N'Admin xem giảng viên'),
    ('INSTRUCTOR_CREATE', '/api/v1/instructors/admin/**', 'POST', N'Admin tạo giảng viên'),
    ('INSTRUCTOR_EDIT', '/api/v1/instructors/admin/**', 'PUT', N'Admin sửa giảng viên'),
    ('INSTRUCTOR_DELETE', '/api/v1/instructors/admin/**', 'DELETE', N'Admin xóa giảng viên'),
    ('INSTRUCTOR_SELF_VIEW', '/api/v1/instructors/me', 'GET', N'Giảng viên xem hồ sơ cá nhân'),
    ('INSTRUCTOR_SELF_UPDATE', '/api/v1/instructors/me', 'PUT', N'Giảng viên sửa hồ sơ cá nhân'),
    ('STAFF_VIEW', '/api/v1/staffs/admin/**', 'GET', N'Admin xem nhân viên hành chính'),
    ('STAFF_CREATE', '/api/v1/staffs/admin/**', 'POST', N'Admin tạo nhân viên hành chính'),
    ('STAFF_EDIT', '/api/v1/staffs/admin/**', 'PUT', N'Admin sửa nhân viên hành chính'),
    ('STAFF_DELETE', '/api/v1/staffs/admin/**', 'DELETE', N'Admin xóa nhân viên hành chính'),
    ('STAFF_SELF_VIEW', '/api/v1/staffs/me', 'GET', N'Nhân viên xem hồ sơ cá nhân'),
    ('STAFF_SELF_UPDATE', '/api/v1/staffs/me', 'PUT', N'Nhân viên sửa hồ sơ cá nhân'),
    ('USER_VIEW', '/api/v1/users/admin/**', 'GET', N'Admin xem tài khoản'),
    ('USER_EDIT', '/api/v1/users/admin/**', 'PUT', N'Admin sửa tài khoản'),
    ('USER_DELETE', '/api/v1/users/admin/**', 'DELETE', N'Admin xóa tài khoản'),
    ('ROLE_VIEW', '/api/v1/roles/admin/**', 'GET', N'Admin xem vai trò'),
    ('ROLE_CREATE', '/api/v1/roles/admin/**', 'POST', N'Admin tạo vai trò'),
    ('ROLE_EDIT', '/api/v1/roles/admin/**', 'PUT', N'Admin sửa vai trò'),
    ('ROLE_DELETE', '/api/v1/roles/admin/**', 'DELETE', N'Admin xóa vai trò'),
    ('PERMISSION_VIEW', '/api/v1/permissions/admin/**', 'GET', N'Admin xem quyền'),
    ('PERMISSION_CREATE', '/api/v1/permissions/admin/**', 'POST', N'Admin tạo quyền'),
    ('PERMISSION_EDIT', '/api/v1/permissions/admin/**', 'PUT', N'Admin sửa quyền'),
    ('PERMISSION_DELETE', '/api/v1/permissions/admin/**', 'DELETE', N'Admin xóa quyền'),
    ('MENU_VIEW', '/api/v1/menus/admin/**', 'GET', N'Admin xem menu'),
    ('MENU_CREATE', '/api/v1/menus/admin/**', 'POST', N'Admin tạo menu'),
    ('MENU_EDIT', '/api/v1/menus/admin/**', 'PUT', N'Admin sửa menu'),
    ('MENU_DELETE', '/api/v1/menus/admin/**', 'DELETE', N'Admin xóa menu')
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
    (N'Sinh viên', '/dashboard/admin/students', 'users', 10, 1, 'STUDENT_VIEW'),
    (N'Giảng viên', '/dashboard/admin/instructors', 'graduation-cap', 20, 1, 'INSTRUCTOR_VIEW'),
    (N'Nhân viên', '/dashboard/admin/staffs', 'briefcase', 30, 1, 'STAFF_VIEW'),
    (N'Tài khoản', '/dashboard/admin/users', 'shield', 40, 1, 'USER_VIEW'),
    (N'Vai trò', '/dashboard/admin/roles', 'key-round', 50, 1, 'ROLE_VIEW'),
    (N'Quyền', '/dashboard/admin/permissions', 'lock-keyhole', 60, 1, 'PERMISSION_VIEW'),
    (N'Menu', '/dashboard/admin/menus', 'menu', 70, 1, 'MENU_VIEW'),
    (N'Hồ sơ sinh viên', '/dashboard/student/profile', 'user', 10, 1, 'STUDENT_SELF_VIEW'),
    (N'Hồ sơ giảng viên', '/dashboard/instructor/profile', 'user', 10, 1, 'INSTRUCTOR_SELF_VIEW'),
    (N'Hồ sơ nhân viên', '/dashboard/staff/profile', 'user', 10, 1, 'STAFF_SELF_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);
