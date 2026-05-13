-- ============================================
-- V5__Insert_Data.sql
-- Flyway compatible (SQL Server & H2)
-- SUPER_ADMIN + ADMIN + Permissions
-- ============================================

-- 1. Tạo Roles (nếu chưa có)
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Code = 'SUPER_ADMIN')
BEGIN
INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
VALUES (NEWID(), 'SUPER_ADMIN', N'Super Administrator', N'Super Admin - Toàn quyền tuyệt đối', 0, 1, 1, '#FF0000', 1, CURRENT_TIMESTAMP);
END

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Code = 'ADMIN')
BEGIN
INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
VALUES (NEWID(), 'ADMIN', N'Administrator', N'Quản trị viên hệ thống', 1, 1, 2, '#FF6600', 1, CURRENT_TIMESTAMP);
END

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Code = 'STUDENT')
BEGIN
INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
VALUES (NEWID(), 'STUDENT', N'Sinh viên', N'Quyền sinh viên', 10, 1, 3, '#00AA00', 1, CURRENT_TIMESTAMP);
END

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Code = 'LECTURER')
BEGIN
INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
VALUES (NEWID(), 'LECTURER', N'Giảng viên', N'Quyền giảng viên', 5, 1, 4, '#0000FF', 1, CURRENT_TIMESTAMP);
END

-- 2. Lấy RoleId (dùng SELECT gán biến)
DECLARE @SuperAdminRoleId UNIQUEIDENTIFIER;
DECLARE @AdminRoleId UNIQUEIDENTIFIER;
SELECT @SuperAdminRoleId = RoleId FROM Roles WHERE Code = 'SUPER_ADMIN';
SELECT @AdminRoleId = RoleId FROM Roles WHERE Code = 'ADMIN';

-- 3. Tạo Person cho superadmin & admin (nếu chưa có user tương ứng)
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'superadmin')
BEGIN
INSERT INTO Persons (PersonId, FullName, Gender, ContactEmail, PhoneNumber, PermanentAddress, IsActive, CreatedAt)
VALUES (NEWID(), N'Super Administrator', N'Unknown', 'superadmin@university.edu.vn', '+84000000001', N'Vietnam', 1, CURRENT_TIMESTAMP);
END

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
BEGIN
INSERT INTO Persons (PersonId, FullName, Gender, ContactEmail, PhoneNumber, PermanentAddress, IsActive, CreatedAt)
VALUES (NEWID(), N'Quản Trị Viên Hệ Thống', N'Unknown', 'admin@university.edu.vn', '+84000000000', N'Vietnam', 1, CURRENT_TIMESTAMP);
END

-- 4. Tạo user (password Admin@123 đã hash BCrypt)
-- Lấy PersonId cho superadmin
DECLARE @SuperAdminPersonId UNIQUEIDENTIFIER;
SELECT TOP 1 @SuperAdminPersonId = PersonId FROM Persons WHERE ContactEmail = 'superadmin@university.edu.vn';
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'superadmin') AND @SuperAdminPersonId IS NOT NULL
BEGIN
INSERT INTO Users (UserId, PersonId, Username, PasswordHash, Email, AccessFailedCount, IsActive, CreatedAt)
VALUES (NEWID(), @SuperAdminPersonId, 'superadmin', '$2a$10$ZMnjZS3qB5Vd.RLXYmK/oeCnSXNMaktnK9gFn7Z0zx5jxApLeb7l2', 'superadmin@university.edu.vn', 0, 1, CURRENT_TIMESTAMP);
END

DECLARE @AdminPersonId UNIQUEIDENTIFIER;
SELECT TOP 1 @AdminPersonId = PersonId FROM Persons WHERE ContactEmail = 'admin@university.edu.vn';
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin') AND @AdminPersonId IS NOT NULL
BEGIN
INSERT INTO Users (UserId, PersonId, Username, PasswordHash, Email, AccessFailedCount, IsActive, CreatedAt)
VALUES (NEWID(), @AdminPersonId, 'admin', '$2a$10$eRRntP55ycviVNwRLgqCjeYMIkw4KpJYYerfEWBy8PvJuDEPTLk26', 'admin@university.edu.vn', 0, 1, CURRENT_TIMESTAMP);
END

-- 5. Gán role
DECLARE @SuperAdminUserId UNIQUEIDENTIFIER;
SELECT @SuperAdminUserId = UserId FROM Users WHERE Username = 'superadmin';
IF @SuperAdminUserId IS NOT NULL AND @SuperAdminRoleId IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @SuperAdminUserId AND RoleId = @SuperAdminRoleId)
BEGIN
INSERT INTO UserRoles (UserId, RoleId, IsActive, CreatedAt) VALUES (@SuperAdminUserId, @SuperAdminRoleId, 1, CURRENT_TIMESTAMP);
END

DECLARE @AdminUserId UNIQUEIDENTIFIER;
SELECT @AdminUserId = UserId FROM Users WHERE Username = 'admin';
IF @AdminUserId IS NOT NULL AND @AdminRoleId IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @AdminUserId AND RoleId = @AdminRoleId)
BEGIN
INSERT INTO UserRoles (UserId, RoleId, IsActive, CreatedAt) VALUES (@AdminUserId, @AdminRoleId, 1, CURRENT_TIMESTAMP);
END

-- 6. Tạo Permissions (chỉ insert nếu chưa có)
INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT NEWID(), Code, Name, Description, Module, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('USER_CREATE', N'Tạo người dùng', N'Tạo người dùng mới', 'USER'),
    ('USER_VIEW', N'Xem người dùng', N'Xem danh sách và chi tiết người dùng', 'USER'),
    ('USER_EDIT', N'Sửa người dùng', N'Cập nhật thông tin người dùng', 'USER'),
    ('USER_DELETE', N'Xóa người dùng', N'Xóa người dùng', 'USER'),
    ('ROLE_CREATE', N'Tạo vai trò', N'Tạo vai trò mới', 'ROLE'),
    ('ROLE_VIEW', N'Xem vai trò', N'Xem danh sách vai trò', 'ROLE'),
    ('ROLE_EDIT', N'Sửa vai trò', N'Cập nhật vai trò', 'ROLE'),
    ('ROLE_DELETE', N'Xóa vai trò', N'Xóa vai trò', 'ROLE'),
    ('PERMISSION_CREATE', N'Tạo quyền', N'Tạo quyền mới', 'PERMISSION'),
    ('PERMISSION_VIEW', N'Xem quyền', N'Xem danh sách quyền', 'PERMISSION'),
    ('PERMISSION_EDIT', N'Sửa quyền', N'Cập nhật quyền', 'PERMISSION'),
    ('PERMISSION_DELETE', N'Xóa quyền', N'Xóa quyền', 'PERMISSION'),
    ('STUDENT_CREATE', N'Tạo sinh viên', N'Tạo sinh viên mới', 'STUDENT'),
    ('STUDENT_VIEW', N'Xem sinh viên', N'Xem danh sách sinh viên', 'STUDENT'),
    ('STUDENT_EDIT', N'Sửa sinh viên', N'Cập nhật thông tin sinh viên', 'STUDENT'),
    ('STUDENT_DELETE', N'Xóa sinh viên', N'Xóa sinh viên', 'STUDENT'),
    ('COURSE_CREATE', N'Tạo khóa học', N'Tạo khóa học mới', 'COURSE'),
    ('COURSE_VIEW', N'Xem khóa học', N'Xem danh sách khóa học', 'COURSE'),
    ('COURSE_EDIT', N'Sửa khóa học', N'Cập nhật khóa học', 'COURSE'),
    ('COURSE_DELETE', N'Xóa khóa học', N'Xóa khóa học', 'COURSE'),
    ('REPORT_VIEW', N'Xem báo cáo', N'Xem các báo cáo hệ thống', 'REPORT'),
    ('SYSTEM_CONFIG', N'Cấu hình hệ thống', N'Cấu hình các thiết lập hệ thống', 'SYSTEM')
    ) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

-- 7. Gán tất cả permissions cho ADMIN role
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT @AdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
FROM Permissions p
WHERE NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @AdminRoleId AND rp.PermissionId = p.PermissionId);

-- 8. Dữ liệu mẫu: Khoa, Môn học
IF NOT EXISTS (SELECT 1 FROM Departments WHERE Code = 'CNTT')
    INSERT INTO Departments (DepartmentId, Code, Name, IsActive, CreatedAt) VALUES (NEWID(), 'CNTT', N'Khoa Công nghệ thông tin', 1, CURRENT_TIMESTAMP);

IF NOT EXISTS (SELECT 1 FROM Courses WHERE Code = 'IT101')
BEGIN
    DECLARE @DeptId UNIQUEIDENTIFIER;
SELECT @DeptId = DepartmentId FROM Departments WHERE Code = 'CNTT';
IF @DeptId IS NOT NULL
        INSERT INTO Courses (CourseId, DepartmentId, Code, Name, Credits, IsActive, CreatedAt)
        VALUES (NEWID(), @DeptId, 'IT101', N'Lập trình Java cơ bản', 3, 1, CURRENT_TIMESTAMP);
END