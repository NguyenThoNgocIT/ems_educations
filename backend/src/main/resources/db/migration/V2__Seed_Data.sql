-- ============================================
-- SEED DATA V2
-- ============================================

-- 1. Thêm Roles cơ bản
DECLARE @AdminRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @StudentRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @LecturerRoleId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Roles (RoleId, Code, Name, Description, IsActive, CreatedAt)
VALUES 
(@AdminRoleId, 'ADMIN', N'Quản trị viên', N'Toàn quyền hệ thống', 1, GETDATE()),
(@StudentRoleId, 'STUDENT', N'Sinh viên', N'Quyền sinh viên', 1, GETDATE()),
(@LecturerRoleId, 'LECTURER', N'Giảng viên', N'Quyền giảng viên', 1, GETDATE());

-- 2. Thêm một Person
DECLARE @AdminPersonId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Persons (PersonId, FullName, Gender, DateOfBirth, ContactEmail, PhoneNumber, PermanentAddress, IsActive, CreatedAt)
VALUES 
(@AdminPersonId, N'Nguyễn Thế Admin', N'Nam', '1990-01-01', 'admin@ems.edu.vn', '0987654321', N'Hà Nội', 1, GETDATE());

-- 3. Thêm tài khoản User (admin / 123456)
INSERT INTO Users (UserId, PersonId, Username, PasswordHash, Email, IsActive, CreatedAt, RequirePasswordChange)
VALUES 
(NEWID(), @AdminPersonId, 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@ems.edu.vn', 1, GETDATE(), 0);

-- 4. Thêm một Khoa mẫu
DECLARE @DeptId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Departments (DepartmentId, Code, Name, IsActive, CreatedAt)
VALUES 
(@DeptId, 'CNTT', N'Khoa Công nghệ thông tin', 1, GETDATE());

-- 5. Thêm một Môn học mẫu
INSERT INTO Courses (CourseId, DepartmentId, Code, Name, Credits, IsActive, CreatedAt)
VALUES 
(NEWID(), @DeptId, 'IT101', N'Lập trình Java cơ bản', 3, 1, GETDATE());
