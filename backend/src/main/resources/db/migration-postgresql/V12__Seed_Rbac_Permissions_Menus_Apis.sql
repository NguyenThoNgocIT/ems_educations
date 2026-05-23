INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_SELF_VIEW', 'Sinh viên xem hồ sơ cá nhân', 'Sinh viên xem thông tin của chính mình', 'STUDENT'),
    ('STUDENT_SELF_UPDATE', 'Sinh viên cập nhật hồ sơ cá nhân', 'Sinh viên cập nhật thông tin Persons của chính mình', 'STUDENT'),
    ('INSTRUCTOR_CREATE', 'Tạo giảng viên', 'Tạo giảng viên và tài khoản', 'INSTRUCTOR'),
    ('INSTRUCTOR_VIEW', 'Xem giảng viên', 'Xem danh sách và chi tiết giảng viên', 'INSTRUCTOR'),
    ('INSTRUCTOR_EDIT', 'Sửa giảng viên', 'Cập nhật thông tin giảng viên', 'INSTRUCTOR'),
    ('INSTRUCTOR_DELETE', 'Xóa giảng viên', 'Xóa mềm giảng viên', 'INSTRUCTOR'),
    ('INSTRUCTOR_SELF_VIEW', 'Giảng viên xem hồ sơ cá nhân', 'Giảng viên xem thông tin của chính mình', 'INSTRUCTOR'),
    ('INSTRUCTOR_SELF_UPDATE', 'Giảng viên cập nhật hồ sơ cá nhân', 'Giảng viên cập nhật thông tin Persons của chính mình', 'INSTRUCTOR'),
    ('STAFF_CREATE', 'Tạo nhân viên hành chính', 'Tạo nhân viên hành chính và tài khoản', 'STAFF'),
    ('STAFF_VIEW', 'Xem nhân viên hành chính', 'Xem danh sách và chi tiết nhân viên hành chính', 'STAFF'),
    ('STAFF_EDIT', 'Sửa nhân viên hành chính', 'Cập nhật thông tin nhân viên hành chính', 'STAFF'),
    ('STAFF_DELETE', 'Xóa nhân viên hành chính', 'Xóa mềm nhân viên hành chính', 'STAFF'),
    ('STAFF_SELF_VIEW', 'Nhân viên xem hồ sơ cá nhân', 'Nhân viên xem thông tin của chính mình', 'STAFF'),
    ('STAFF_SELF_UPDATE', 'Nhân viên cập nhật hồ sơ cá nhân', 'Nhân viên cập nhật thông tin Persons của chính mình', 'STAFF'),
    ('MENU_VIEW', 'Xem menu', 'Xem cấu hình menu', 'RBAC'),
    ('MENU_CREATE', 'Tạo menu', 'Tạo menu mới', 'RBAC'),
    ('MENU_EDIT', 'Sửa menu', 'Cập nhật menu', 'RBAC'),
    ('MENU_DELETE', 'Xóa menu', 'Xóa mềm menu', 'RBAC'),
    ('PERMISSION_API_EDIT', 'Cấu hình API theo quyền', 'Tạo và xóa mapping PermissionApis', 'RBAC')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('STUDENT_SELF_VIEW', 'STUDENT_SELF_UPDATE')
WHERE r.Code = 'STUDENT'
ON CONFLICT DO NOTHING;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('INSTRUCTOR_SELF_VIEW', 'INSTRUCTOR_SELF_UPDATE')
WHERE r.Code = 'LECTURER'
ON CONFLICT DO NOTHING;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('STAFF_SELF_VIEW', 'STAFF_SELF_UPDATE')
WHERE r.Code = 'STAFF'
ON CONFLICT DO NOTHING;

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_VIEW', '/api/v1/students/admin/**', 'GET', 'Admin xem sinh viên'),
    ('STUDENT_CREATE', '/api/v1/students/admin/**', 'POST', 'Admin tạo sinh viên'),
    ('STUDENT_EDIT', '/api/v1/students/admin/**', 'PUT', 'Admin sửa sinh viên'),
    ('STUDENT_DELETE', '/api/v1/students/admin/**', 'DELETE', 'Admin xóa sinh viên'),
    ('STUDENT_SELF_VIEW', '/api/v1/students/me', 'GET', 'Sinh viên xem hồ sơ cá nhân'),
    ('STUDENT_SELF_UPDATE', '/api/v1/students/me', 'PUT', 'Sinh viên sửa hồ sơ cá nhân'),
    ('INSTRUCTOR_VIEW', '/api/v1/instructors/admin/**', 'GET', 'Admin xem giảng viên'),
    ('INSTRUCTOR_CREATE', '/api/v1/instructors/admin/**', 'POST', 'Admin tạo giảng viên'),
    ('INSTRUCTOR_EDIT', '/api/v1/instructors/admin/**', 'PUT', 'Admin sửa giảng viên'),
    ('INSTRUCTOR_DELETE', '/api/v1/instructors/admin/**', 'DELETE', 'Admin xóa giảng viên'),
    ('INSTRUCTOR_SELF_VIEW', '/api/v1/instructors/me', 'GET', 'Giảng viên xem hồ sơ cá nhân'),
    ('INSTRUCTOR_SELF_UPDATE', '/api/v1/instructors/me', 'PUT', 'Giảng viên sửa hồ sơ cá nhân'),
    ('STAFF_VIEW', '/api/v1/staffs/admin/**', 'GET', 'Admin xem nhân viên hành chính'),
    ('STAFF_CREATE', '/api/v1/staffs/admin/**', 'POST', 'Admin tạo nhân viên hành chính'),
    ('STAFF_EDIT', '/api/v1/staffs/admin/**', 'PUT', 'Admin sửa nhân viên hành chính'),
    ('STAFF_DELETE', '/api/v1/staffs/admin/**', 'DELETE', 'Admin xóa nhân viên hành chính'),
    ('STAFF_SELF_VIEW', '/api/v1/staffs/me', 'GET', 'Nhân viên xem hồ sơ cá nhân'),
    ('STAFF_SELF_UPDATE', '/api/v1/staffs/me', 'PUT', 'Nhân viên sửa hồ sơ cá nhân'),
    ('USER_VIEW', '/api/v1/users/admin/**', 'GET', 'Admin xem tài khoản'),
    ('USER_EDIT', '/api/v1/users/admin/**', 'PUT', 'Admin sửa tài khoản'),
    ('USER_DELETE', '/api/v1/users/admin/**', 'DELETE', 'Admin xóa tài khoản'),
    ('ROLE_VIEW', '/api/v1/roles/admin/**', 'GET', 'Admin xem vai trò'),
    ('ROLE_CREATE', '/api/v1/roles/admin/**', 'POST', 'Admin tạo vai trò'),
    ('ROLE_EDIT', '/api/v1/roles/admin/**', 'PUT', 'Admin sửa vai trò'),
    ('ROLE_DELETE', '/api/v1/roles/admin/**', 'DELETE', 'Admin xóa vai trò'),
    ('PERMISSION_VIEW', '/api/v1/permissions/admin/**', 'GET', 'Admin xem quyền'),
    ('PERMISSION_CREATE', '/api/v1/permissions/admin/**', 'POST', 'Admin tạo quyền'),
    ('PERMISSION_EDIT', '/api/v1/permissions/admin/**', 'PUT', 'Admin sửa quyền'),
    ('PERMISSION_DELETE', '/api/v1/permissions/admin/**', 'DELETE', 'Admin xóa quyền'),
    ('MENU_VIEW', '/api/v1/menus/admin/**', 'GET', 'Admin xem menu'),
    ('MENU_CREATE', '/api/v1/menus/admin/**', 'POST', 'Admin tạo menu'),
    ('MENU_EDIT', '/api/v1/menus/admin/**', 'PUT', 'Admin sửa menu'),
    ('MENU_DELETE', '/api/v1/menus/admin/**', 'DELETE', 'Admin xóa menu')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId
      AND pa.ApiPath = src.ApiPath
      AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('Sinh viên', '/dashboard/admin/students', 'users', 10, 1, 'STUDENT_VIEW'),
    ('Giảng viên', '/dashboard/admin/instructors', 'graduation-cap', 20, 1, 'INSTRUCTOR_VIEW'),
    ('Nhân viên', '/dashboard/admin/staffs', 'briefcase', 30, 1, 'STAFF_VIEW'),
    ('Tài khoản', '/dashboard/admin/users', 'shield', 40, 1, 'USER_VIEW'),
    ('Vai trò', '/dashboard/admin/roles', 'key-round', 50, 1, 'ROLE_VIEW'),
    ('Quyền', '/dashboard/admin/permissions', 'lock-keyhole', 60, 1, 'PERMISSION_VIEW'),
    ('Menu', '/dashboard/admin/menus', 'menu', 70, 1, 'MENU_VIEW'),
    ('Hồ sơ sinh viên', '/dashboard/student/profile', 'user', 10, 1, 'STUDENT_SELF_VIEW'),
    ('Hồ sơ giảng viên', '/dashboard/instructor/profile', 'user', 10, 1, 'INSTRUCTOR_SELF_VIEW'),
    ('Hồ sơ nhân viên', '/dashboard/staff/profile', 'user', 10, 1, 'STAFF_SELF_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);