-- V29__Fix_Role_Permissions_Mapping.sql
-- Fix missing RBAC permissions and role mappings due to order of migrations execution.

-- 1. Insert missing permissions into Permissions table
INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
VALUES
  (gen_random_uuid(), 'STUDENT_VIEW', 'Xem sinh viên', 'Admin xem danh sách và chi tiết sinh viên', 'STUDENT', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'STUDENT_CREATE', 'Tạo sinh viên', 'Admin tạo sinh viên', 'STUDENT', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'STUDENT_EDIT', 'Sửa sinh viên', 'Admin cập nhật sinh viên', 'STUDENT', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'STUDENT_DELETE', 'Xóa sinh viên', 'Admin xóa mềm sinh viên', 'STUDENT', TRUE, CURRENT_TIMESTAMP),

  (gen_random_uuid(), 'USER_VIEW', 'Xem tài khoản', 'Admin xem tài khoản', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'USER_EDIT', 'Sửa tài khoản', 'Admin sửa tài khoản', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'USER_DELETE', 'Xóa tài khoản', 'Admin xóa tài khoản', 'RBAC', TRUE, CURRENT_TIMESTAMP),

  (gen_random_uuid(), 'ROLE_VIEW', 'Xem vai trò', 'Admin xem vai trò', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ROLE_CREATE', 'Tạo vai trò', 'Admin tạo vai trò', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ROLE_EDIT', 'Sửa vai trò', 'Admin sửa vai trò', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ROLE_DELETE', 'Xóa vai trò', 'Admin xóa vai trò', 'RBAC', TRUE, CURRENT_TIMESTAMP),

  (gen_random_uuid(), 'PERMISSION_VIEW', 'Xem quyền', 'Admin xem quyền', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'PERMISSION_CREATE', 'Tạo quyền', 'Admin tạo quyền', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'PERMISSION_EDIT', 'Sửa quyền', 'Admin sửa quyền', 'RBAC', TRUE, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'PERMISSION_DELETE', 'Xóa quyền', 'Admin xóa quyền', 'RBAC', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (Code) DO NOTHING;

-- 2. Insert missing mappings into PermissionApis
INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_VIEW', '/api/v1/students/admin/**', 'GET', 'Admin xem sinh viên'),
    ('STUDENT_CREATE', '/api/v1/students/admin/**', 'POST', 'Admin tạo sinh viên'),
    ('STUDENT_EDIT', '/api/v1/students/admin/**', 'PUT', 'Admin sửa sinh viên'),
    ('STUDENT_DELETE', '/api/v1/students/admin/**', 'DELETE', 'Admin xóa sinh viên'),
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
    ('PERMISSION_DELETE', '/api/v1/permissions/admin/**', 'DELETE', 'Admin xóa quyền')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
ON CONFLICT (PermissionId, ApiPath, HttpMethod) DO NOTHING;

-- 3. Insert missing mappings into Menus
INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('Sinh viên', '/dashboard/admin/students', 'users', 10, 1, 'STUDENT_VIEW'),
    ('Tài khoản', '/dashboard/admin/users', 'shield', 40, 1, 'USER_VIEW'),
    ('Vai trò', '/dashboard/admin/roles', 'key-round', 50, 1, 'ROLE_VIEW'),
    ('Quyền', '/dashboard/admin/permissions', 'lock-keyhole', 60, 1, 'PERMISSION_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);

-- 4. Map all permissions to ADMIN and SUPER_ADMIN roles in RolePermissions
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT (RoleId, PermissionId) DO NOTHING;

-- 5. Map student self permissions to STUDENT role in RolePermissions
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('STUDENT_SELF_VIEW', 'STUDENT_SELF_UPDATE', 'COURSE_REGISTRATION_RETAKE')
WHERE r.Code = 'STUDENT'
ON CONFLICT (RoleId, PermissionId) DO NOTHING;

-- 6. Map lecturer permissions to LECTURER role in RolePermissions
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'INSTRUCTOR_SELF_VIEW', 
    'INSTRUCTOR_SELF_UPDATE', 
    'GRADE_INPUT', 
    'SCHEDULE_ADJUSTMENT_VIEW', 
    'SCHEDULE_ADJUSTMENT_CREATE', 
    'SCHEDULE_ADJUSTMENT_VALIDATE'
)
WHERE r.Code = 'LECTURER'
ON CONFLICT (RoleId, PermissionId) DO NOTHING;

-- 7. Map staff permissions to STAFF role in RolePermissions
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('STAFF_SELF_VIEW', 'STAFF_SELF_UPDATE')
WHERE r.Code = 'STAFF'
ON CONFLICT (RoleId, PermissionId) DO NOTHING;
