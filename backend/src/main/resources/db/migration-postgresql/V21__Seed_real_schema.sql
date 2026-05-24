-- V21: Seed real schema data for Neon/PostgreSQL using the application's actual tables.

-- Roles
INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Level, TRUE, src.DisplayOrder, src.Color, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('ADMIN', 'Quản trị viên', 'Toàn quyền hệ thống', 1, 1, '#DC2626'),
  ('LECTURER', 'Giảng viên', 'Giảng viên giảng dạy', 2, 2, '#2563EB'),
  ('STAFF', 'Nhân viên', 'Nhân viên hành chính', 3, 3, '#7C3AED'),
  ('STUDENT', 'Sinh viên', 'Sinh viên sử dụng cổng thông tin', 4, 4, '#16A34A')
) AS src(Code, Name, Description, Level, DisplayOrder, Color)
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE Code = src.Code);

-- Departments
INSERT INTO Departments (DepartmentId, Code, Name, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('CNTT', 'Công nghệ thông tin', 'Khoa Công nghệ thông tin'),
  ('KTDL', 'Kế toán - Tài chính', 'Khoa Kế toán - Tài chính'),
  ('QTKD', 'Quản trị kinh doanh', 'Khoa Quản trị kinh doanh'),
  ('NN', 'Ngoại ngữ', 'Khoa Ngoại ngữ')
) AS src(Code, Name, Description)
WHERE NOT EXISTS (SELECT 1 FROM Departments WHERE Code = src.Code);

-- School years
INSERT INTO SchoolYears (SchoolYearId, Code, Name, StartDate, EndDate, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.StartDate, src.EndDate, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('2024-2025', 'Năm học 2024-2025', '2024-09-01'::date, '2025-08-31'::date, 'Năm học 2024-2025'),
  ('2025-2026', 'Năm học 2025-2026', '2025-09-01'::date, '2026-08-31'::date, 'Năm học 2025-2026')
) AS src(Code, Name, StartDate, EndDate, Description)
WHERE NOT EXISTS (SELECT 1 FROM SchoolYears WHERE Code = src.Code);

-- Academic cohorts
INSERT INTO AcademicCohorts (AcademicCohortId, Code, Name, StartYear, EndYear, StartDate, EndDate, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.StartYear, src.EndYear, src.StartDate, src.EndDate, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('K24', 'Khóa 24', 2024, 2028, '2024-09-01'::date, '2028-08-31'::date, 'Khóa 24'),
  ('K25', 'Khóa 25', 2025, 2029, '2025-09-01'::date, '2029-08-31'::date, 'Khóa 25')
) AS src(Code, Name, StartYear, EndYear, StartDate, EndDate, Description)
WHERE NOT EXISTS (SELECT 1 FROM AcademicCohorts WHERE Code = src.Code);

-- Majors
INSERT INTO Majors (MajorId, DepartmentId, Code, Name, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), d.DepartmentId, src.Code, src.Name, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('CNTT01', 'Khoa học máy tính', 'Ngành Khoa học máy tính', 'CNTT'),
  ('CNTT02', 'Kỹ thuật phần mềm', 'Ngành Kỹ thuật phần mềm', 'CNTT'),
  ('KTDL01', 'Kế toán doanh nghiệp', 'Ngành Kế toán doanh nghiệp', 'KTDL'),
  ('QTKD01', 'Quản trị kinh doanh', 'Ngành Quản trị kinh doanh', 'QTKD'),
  ('NN01', 'Ngôn ngữ Anh', 'Ngành Ngôn ngữ Anh', 'NN')
) AS src(Code, Name, Description, DepartmentCode)
JOIN Departments d ON d.Code = src.DepartmentCode
WHERE NOT EXISTS (SELECT 1 FROM Majors WHERE Code = src.Code);

-- Positions and divisions
INSERT INTO Positions (PositionId, Code, Name, Allowance, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Allowance, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('ADMIN_STAFF', 'Nhân viên hành chính', 2500000::numeric),
  ('TEACHING_ASSISTANT', 'Trợ giảng', 3000000::numeric),
  ('SENIOR_LECTURER', 'Giảng viên chính', 5000000::numeric)
) AS src(Code, Name, Allowance)
WHERE NOT EXISTS (SELECT 1 FROM Positions WHERE Code = src.Code);

INSERT INTO Divisions (DivisionId, Code, Name, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('DT', 'Đào tạo', 'Phòng Đào tạo'),
  ('CTSV', 'Công tác sinh viên', 'Phòng Công tác sinh viên'),
  ('TC-HC', 'Tổ chức - Hành chính', 'Phòng Tổ chức - Hành chính')
) AS src(Code, Name, Description)
WHERE NOT EXISTS (SELECT 1 FROM Divisions WHERE Code = src.Code);

-- Buildings, floors, rooms
INSERT INTO Buildings (BuildingId, Code, Name, Address, TotalFloors, BuildingType, Description, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Address, src.TotalFloors, src.BuildingType, src.Description, src.Note, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('A', 'Tòa nhà A', 'Cơ sở chính', 4::smallint, 'A', 'Khu học tập chính', 'Tòa A'),
  ('B', 'Tòa nhà B', 'Khối thực hành', 3::smallint, 'B', 'Khu phòng máy và thực hành', 'Tòa B'),
  ('C', 'Tòa nhà C', 'Khối hành chính', 2::smallint, 'C', 'Khu hành chính và hội trường', 'Tòa C')
) AS src(Code, Name, Address, TotalFloors, BuildingType, Description, Note)
WHERE NOT EXISTS (SELECT 1 FROM Buildings WHERE Code = src.Code);

INSERT INTO Floors (FloorId, Code, Name, FloorNumber, BuildingId, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.FloorNumber, b.BuildingId, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('A1', 'Tầng 1 - A', 1, 'Tầng 1 tòa A', 'A'),
  ('A2', 'Tầng 2 - A', 2, 'Tầng 2 tòa A', 'A'),
  ('B1', 'Tầng 1 - B', 1, 'Tầng 1 tòa B', 'B'),
  ('B2', 'Tầng 2 - B', 2, 'Tầng 2 tòa B', 'B'),
  ('C1', 'Tầng 1 - C', 1, 'Tầng 1 tòa C', 'C'),
  ('C2', 'Tầng 2 - C', 2, 'Tầng 2 tòa C', 'C')
) AS src(Code, Name, FloorNumber, Description, BuildingCode)
JOIN Buildings b ON b.Code = src.BuildingCode
WHERE NOT EXISTS (SELECT 1 FROM Floors WHERE BuildingId = b.BuildingId AND FloorNumber = src.FloorNumber);

INSERT INTO Rooms (RoomId, Code, Name, BuildingId, FloorNumber, Capacity, Type, Status, HasProjector, HasAirConditioner, HasComputer, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, b.BuildingId, src.FloorNumber, src.Capacity, src.Type, src.Status, src.HasProjector, src.HasAirConditioner, src.HasComputer, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('A101', 'Phòng A101', 'A', 1, 50, 'Lớp học', 'Sẵn sàng', TRUE, TRUE, FALSE, 'Phòng học 50 chỗ'),
  ('A102', 'Phòng A102', 'A', 1, 45, 'Lớp học', 'Sẵn sàng', TRUE, TRUE, FALSE, 'Phòng học 45 chỗ'),
  ('A201', 'Phòng A201', 'A', 2, 60, 'Lớp học', 'Sẵn sàng', TRUE, TRUE, FALSE, 'Phòng học 60 chỗ'),
  ('B101', 'Phòng B101', 'B', 1, 40, 'Thực hành', 'Sẵn sàng', TRUE, TRUE, TRUE, 'Phòng máy 40 chỗ'),
  ('B102', 'Phòng B102', 'B', 1, 35, 'Thực hành', 'Sẵn sàng', TRUE, TRUE, TRUE, 'Phòng máy 35 chỗ'),
  ('B201', 'Phòng B201', 'B', 2, 30, 'Thực hành', 'Sẵn sàng', TRUE, TRUE, TRUE, 'Phòng máy 30 chỗ'),
  ('C101', 'Phòng C101', 'C', 1, 100, 'Hội trường', 'Sẵn sàng', TRUE, TRUE, FALSE, 'Hội trường lớn'),
  ('C102', 'Phòng C102', 'C', 1, 30, 'Họp', 'Sẵn sàng', TRUE, TRUE, FALSE, 'Phòng họp')
) AS src(Code, Name, BuildingCode, FloorNumber, Capacity, Type, Status, HasProjector, HasAirConditioner, HasComputer, Description)
JOIN Buildings b ON b.Code = src.BuildingCode
WHERE NOT EXISTS (SELECT 1 FROM Rooms WHERE Code = src.Code);

INSERT INTO TimeSlots (TimeSlotId, SlotCode, StartTime, EndTime, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.SlotCode, src.StartTime, src.EndTime, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('T1', '07:00'::time, '08:30'::time),
  ('T2', '08:45'::time, '10:15'::time),
  ('T3', '10:30'::time, '12:00'::time),
  ('T4', '13:00'::time, '14:30'::time),
  ('T5', '14:45'::time, '16:15'::time)
) AS src(SlotCode, StartTime, EndTime)
WHERE NOT EXISTS (SELECT 1 FROM TimeSlots WHERE SlotCode = src.SlotCode);

-- Persons
INSERT INTO Persons (PersonId, FullName, Gender, DateOfBirth, Nationality, ContactEmail, PhoneNumber, PermanentAddress, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.FullName, src.Gender, src.DateOfBirth, 'Việt Nam', src.ContactEmail, src.PhoneNumber, src.PermanentAddress, src.Note, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('Quản trị viên', 'Nam', '1985-01-01'::date, 'admin@donga.edu.vn', '0909000001', 'Đà Nẵng', 'Tài khoản quản trị'),
  ('Nguyễn Văn Hải', 'Nam', '1988-02-11'::date, 'gv01@donga.edu.vn', '0909000002', 'Đà Nẵng', 'Giảng viên'),
  ('Lê Thị Hạnh', 'Nữ', '1989-03-12'::date, 'gv02@donga.edu.vn', '0909000003', 'Huế', 'Giảng viên'),
  ('Trần Văn Minh', 'Nam', '1987-04-13'::date, 'gv03@donga.edu.vn', '0909000004', 'Quảng Nam', 'Giảng viên'),
  ('Phạm Thị Lan', 'Nữ', '1990-05-14'::date, 'gv04@donga.edu.vn', '0909000005', 'Đà Nẵng', 'Giảng viên'),
  ('Vũ Văn Sơn', 'Nam', '1986-06-15'::date, 'gv05@donga.edu.vn', '0909000006', 'Quảng Ngãi', 'Giảng viên'),
  ('Đỗ Thị Mai', 'Nữ', '1988-07-16'::date, 'gv06@donga.edu.vn', '0909000007', 'Huế', 'Giảng viên'),
  ('Nguyễn Thị Trang', 'Nữ', '1991-08-17'::date, 'nv01@donga.edu.vn', '0909000008', 'Đà Nẵng', 'Nhân viên'),
  ('Lê Văn Tùng', 'Nam', '1992-09-18'::date, 'nv02@donga.edu.vn', '0909000009', 'Đà Nẵng', 'Nhân viên'),
  ('Phạm Văn Phúc', 'Nam', '1993-10-19'::date, 'nv03@donga.edu.vn', '0909000010', 'Quảng Nam', 'Nhân viên'),
  ('Trần An', 'Nam', '2005-01-11'::date, 'sv2025001@donga.edu.vn', '0909000101', 'Đà Nẵng', 'Sinh viên'),
  ('Lê Bình', 'Nam', '2005-01-12'::date, 'sv2025002@donga.edu.vn', '0909000102', 'Quảng Nam', 'Sinh viên'),
  ('Nguyễn Chi', 'Nữ', '2005-01-13'::date, 'sv2025003@donga.edu.vn', '0909000103', 'Huế', 'Sinh viên'),
  ('Phạm Duy', 'Nam', '2005-01-14'::date, 'sv2025004@donga.edu.vn', '0909000104', 'Đà Nẵng', 'Sinh viên'),
  ('Hoàng Em', 'Nữ', '2005-01-15'::date, 'sv2025005@donga.edu.vn', '0909000105', 'Quảng Ngãi', 'Sinh viên'),
  ('Vũ Phong', 'Nam', '2005-01-16'::date, 'sv2025006@donga.edu.vn', '0909000106', 'Đà Nẵng', 'Sinh viên'),
  ('Đỗ Giang', 'Nam', '2005-01-17'::date, 'sv2025007@donga.edu.vn', '0909000107', 'Huế', 'Sinh viên'),
  ('Ngô Hà', 'Nữ', '2005-01-18'::date, 'sv2025008@donga.edu.vn', '0909000108', 'Quảng Nam', 'Sinh viên'),
  ('Bùi Ích', 'Nam', '2005-01-19'::date, 'sv2025009@donga.edu.vn', '0909000109', 'Đà Nẵng', 'Sinh viên'),
  ('Trần Khang', 'Nam', '2005-01-20'::date, 'sv2025010@donga.edu.vn', '0909000110', 'Huế', 'Sinh viên')
) AS src(FullName, Gender, DateOfBirth, ContactEmail, PhoneNumber, PermanentAddress, Note)
WHERE NOT EXISTS (SELECT 1 FROM Persons WHERE ContactEmail = src.ContactEmail);

-- Employees
INSERT INTO Employees (EmployeeId, PersonId, EmployeeCode, StartWorkDate, Status, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, src.EmployeeCode, src.StartWorkDate, src.Status, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('gv01@donga.edu.vn', 'GV01', '2020-09-01'::date, 'ACTIVE'),
  ('gv02@donga.edu.vn', 'GV02', '2020-09-01'::date, 'ACTIVE'),
  ('gv03@donga.edu.vn', 'GV03', '2021-09-01'::date, 'ACTIVE'),
  ('gv04@donga.edu.vn', 'GV04', '2021-09-01'::date, 'ACTIVE'),
  ('gv05@donga.edu.vn', 'GV05', '2022-09-01'::date, 'ACTIVE'),
  ('gv06@donga.edu.vn', 'GV06', '2022-09-01'::date, 'ACTIVE'),
  ('nv01@donga.edu.vn', 'NV01', '2021-01-01'::date, 'ACTIVE'),
  ('nv02@donga.edu.vn', 'NV02', '2021-01-01'::date, 'ACTIVE'),
  ('nv03@donga.edu.vn', 'NV03', '2022-01-01'::date, 'ACTIVE')
) AS src(ContactEmail, EmployeeCode, StartWorkDate, Status)
JOIN Persons p ON p.ContactEmail = src.ContactEmail
WHERE NOT EXISTS (SELECT 1 FROM Employees e WHERE e.EmployeeCode = src.EmployeeCode);

-- Instructors and staff
INSERT INTO Instructors (EmployeeId, InstructorCode, DepartmentId, DegreeId, CreatedAt)
SELECT e.EmployeeId, e.EmployeeCode, d.DepartmentId, NULL, CURRENT_TIMESTAMP
FROM Employees e
JOIN Persons p ON p.PersonId = e.PersonId
JOIN Departments d ON d.Code = 'CNTT'
WHERE p.ContactEmail LIKE 'gv%@donga.edu.vn'
  AND NOT EXISTS (SELECT 1 FROM Instructors i WHERE i.EmployeeId = e.EmployeeId);

INSERT INTO Staffs (EmployeeId, StaffCode, DivisionId, PositionId, CreatedAt)
SELECT e.EmployeeId, e.EmployeeCode, div.DivisionId, pos.PositionId, CURRENT_TIMESTAMP
FROM Employees e
JOIN Persons p ON p.PersonId = e.PersonId
JOIN Divisions div ON div.Code = CASE
  WHEN p.ContactEmail = 'nv01@donga.edu.vn' THEN 'DT'
  WHEN p.ContactEmail = 'nv02@donga.edu.vn' THEN 'CTSV'
  ELSE 'TC-HC'
END
JOIN Positions pos ON pos.Name = CASE
  WHEN p.ContactEmail IN ('nv01@donga.edu.vn', 'nv02@donga.edu.vn') THEN 'Nhân viên hành chính'
  ELSE 'Trợ giảng'
END
WHERE p.ContactEmail LIKE 'nv%@donga.edu.vn'
  AND NOT EXISTS (SELECT 1 FROM Staffs s WHERE s.EmployeeId = e.EmployeeId);

-- Training programs
INSERT INTO TrainingPrograms (TrainingProgramId, Code, Name, NameEn, MajorId, DepartmentId, AcademicCohortId, DegreeLevel, EducationType, TotalCredits, RequiredCredits, ElectiveCredits, InternshipCredits, ThesisCredits, AdmissionYear, DurationYears, MaxDurationYears, EffectiveDate, ExpiryDate, Description, Objectives, LearningOutcomes, Version, Status, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.NameEn, m.MajorId, d.DepartmentId, ac.AcademicCohortId,
       src.DegreeLevel, src.EducationType, src.TotalCredits, src.RequiredCredits, src.ElectiveCredits, src.InternshipCredits, src.ThesisCredits,
       src.AdmissionYear, src.DurationYears, src.MaxDurationYears, src.EffectiveDate, src.ExpiryDate, src.Description, src.Objectives, src.LearningOutcomes,
       src.Version, src.Status, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('CTDT01', 'Chương trình Khoa học máy tính', 'Computer Science Program', 'Cử nhân', 'Chính quy', 130, 100, 20, 6, 4, '2023-09-01'::date, 4.0, 6.0, '2023-09-01'::date, NULL::date, 'Chương trình Khoa học máy tính', 'Đào tạo kỹ sư CNTT', 'Lập trình, dữ liệu, hệ thống', '1.0', 'ACTIVE', 'CNTT01', 'K24'),
  ('CTDT02', 'Chương trình Kỹ thuật phần mềm', 'Software Engineering Program', 'Cử nhân', 'Chính quy', 130, 96, 24, 6, 4, '2024-09-01'::date, 4.0, 6.0, '2024-09-01'::date, NULL::date, 'Chương trình Kỹ thuật phần mềm', 'Đào tạo phát triển phần mềm', 'Phân tích, thiết kế, kiểm thử', '1.0', 'ACTIVE', 'CNTT02', 'K25'),
  ('CTDT03', 'Chương trình Kế toán doanh nghiệp', 'Corporate Accounting Program', 'Cử nhân', 'Chính quy', 125, 96, 19, 5, 5, '2023-09-01'::date, 4.0, 6.0, '2023-09-01'::date, NULL::date, 'Chương trình Kế toán doanh nghiệp', 'Đào tạo kế toán doanh nghiệp', 'Kế toán, kiểm toán, tài chính', '1.0', 'ACTIVE', 'KTDL01', 'K24'),
  ('CTDT04', 'Chương trình Quản trị kinh doanh', 'Business Administration Program', 'Cử nhân', 'Chính quy', 126, 95, 21, 5, 5, '2024-09-01'::date, 4.0, 6.0, '2024-09-01'::date, NULL::date, 'Chương trình Quản trị kinh doanh', 'Đào tạo quản lý doanh nghiệp', 'Quản trị, marketing, vận hành', '1.0', 'ACTIVE', 'QTKD01', 'K25')
) AS src(Code, Name, NameEn, DegreeLevel, EducationType, TotalCredits, RequiredCredits, ElectiveCredits, InternshipCredits, ThesisCredits, AdmissionYear, DurationYears, MaxDurationYears, EffectiveDate, ExpiryDate, Description, Objectives, LearningOutcomes, Version, Status, MajorCode, CohortCode)
JOIN Majors m ON m.Code = src.MajorCode
JOIN Departments d ON d.DepartmentId = m.DepartmentId
JOIN AcademicCohorts ac ON ac.Code = src.CohortCode
WHERE NOT EXISTS (SELECT 1 FROM TrainingPrograms WHERE Code = src.Code);

-- Students
INSERT INTO Students (StudentId, PersonId, StudentCode, Note, TrainingProgramId, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, src.StudentCode, 'Sinh viên ' || src.CohortCode, tp.TrainingProgramId, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('sv2025001@donga.edu.vn', 'SV2025001', 'K24'), ('sv2025002@donga.edu.vn', 'SV2025002', 'K24'),
  ('sv2025003@donga.edu.vn', 'SV2025003', 'K24'), ('sv2025004@donga.edu.vn', 'SV2025004', 'K24'),
  ('sv2025005@donga.edu.vn', 'SV2025005', 'K25'), ('sv2025006@donga.edu.vn', 'SV2025006', 'K25'),
  ('sv2025007@donga.edu.vn', 'SV2025007', 'K25'), ('sv2025008@donga.edu.vn', 'SV2025008', 'K25'),
  ('sv2025009@donga.edu.vn', 'SV2025009', 'K25'), ('sv2025010@donga.edu.vn', 'SV2025010', 'K25')
) AS src(ContactEmail, StudentCode, CohortCode)
JOIN Persons p ON p.ContactEmail = src.ContactEmail
JOIN TrainingPrograms tp ON tp.Code = CASE src.CohortCode WHEN 'K24' THEN 'CTDT01' ELSE 'CTDT02' END
WHERE NOT EXISTS (SELECT 1 FROM Students s WHERE s.StudentCode = src.StudentCode);

-- Users and roles
INSERT INTO Users (UserId, PersonId, Username, PasswordHash, Email, AccessFailedCount, IsActive, CreatedAt, RequirePasswordChange)
SELECT gen_random_uuid(), p.PersonId, p.ContactEmail,
       CASE
         WHEN p.ContactEmail = 'admin@donga.edu.vn' THEN '$2b$12$ONsU9KhtfLG3JjhedORY7ugcG03hzZapTDi0E9dFL40CSYR5A3MOy'
         WHEN p.ContactEmail LIKE 'gv%@donga.edu.vn' THEN '$2b$12$Mm1S1VKkuFUSNhRFScE1PefRqlF9/WL7hf66nnur6dc9z6VZ7wsTG'
         WHEN p.ContactEmail LIKE 'nv%@donga.edu.vn' THEN '$2b$12$MBnZx6dVDKyZsMDXkQuD..qv9zDyZFWPpt6.XWQKAX1qnIjCFiy..'
         ELSE '$2b$12$KJ45pEIwqE7aWrNpwiPdGO7tMZv/qo1l/25c757T.2s/zY/tjbfx6'
       END,
       p.ContactEmail, 0, TRUE, CURRENT_TIMESTAMP, FALSE
FROM Persons p
WHERE NOT EXISTS (SELECT 1 FROM Users u WHERE u.Username = p.ContactEmail);

INSERT INTO UserRoles (UserId, RoleId, CreatedAt, IsActive)
SELECT u.UserId, r.RoleId, CURRENT_TIMESTAMP, TRUE
FROM Users u
JOIN Roles r ON r.Code = CASE
  WHEN u.Username = 'admin@donga.edu.vn' THEN 'ADMIN'
  WHEN u.Username LIKE 'gv%@donga.edu.vn' THEN 'LECTURER'
  WHEN u.Username LIKE 'nv%@donga.edu.vn' THEN 'STAFF'
  ELSE 'STUDENT'
END
WHERE NOT EXISTS (SELECT 1 FROM UserRoles ur WHERE ur.UserId = u.UserId AND ur.RoleId = r.RoleId);

-- Semesters
INSERT INTO Semesters (SemesterId, Code, Name, SchoolYearId, StartDate, EndDate, Status, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, sy.SchoolYearId, src.StartDate, src.EndDate, TRUE, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('HK1-2024', 'Học kỳ 1 năm học 2024-2025', '2024-09-01'::date, '2025-01-15'::date, 'Học kỳ 1'),
  ('HK2-2024', 'Học kỳ 2 năm học 2024-2025', '2025-02-15'::date, '2025-06-30'::date, 'Học kỳ 2'),
  ('HK1-2025', 'Học kỳ 1 năm học 2025-2026', '2025-09-01'::date, '2026-01-15'::date, 'Học kỳ 1'),
  ('HK2-2025', 'Học kỳ 2 năm học 2025-2026', '2026-02-15'::date, '2026-06-30'::date, 'Học kỳ 2')
) AS src(Code, Name, StartDate, EndDate, Description)
JOIN SchoolYears sy ON sy.Code = CASE
  WHEN src.Code LIKE '%2024' THEN '2024-2025'
  ELSE '2025-2026'
END
WHERE NOT EXISTS (SELECT 1 FROM Semesters s WHERE s.Code = src.Code AND s.SchoolYearId = sy.SchoolYearId);

-- Courses
INSERT INTO Courses (CourseId, DepartmentId, Code, Name, NameEn, CourseType, Credits, TheoryHours, PracticeHours, SelfStudyHours, InternshipCredits, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), d.DepartmentId, src.Code, src.Name, src.NameEn, src.CourseType, src.Credits, src.TheoryHours, src.PracticeHours, src.SelfStudyHours, src.InternshipCredits, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('CS101', 'Nhập môn lập trình', 'Introduction to Programming', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Nhập môn lập trình'),
  ('CS102', 'Cấu trúc dữ liệu', 'Data Structures', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Cấu trúc dữ liệu'),
  ('CS201', 'Giải thuật', 'Algorithms', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Giải thuật'),
  ('CS202', 'Cơ sở dữ liệu', 'Databases', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Cơ sở dữ liệu'),
  ('CS203', 'Mạng máy tính', 'Computer Networks', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Mạng máy tính'),
  ('CS204', 'Phát triển web', 'Web Development', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Phát triển web'),
  ('NN101', 'Tiếng Anh 1', 'English 1', 'Bắt buộc', 2.0, 20.0, 10.0, 30.0, NULL::numeric, 'Tiếng Anh 1'),
  ('QTKD101', 'Quản trị học', 'Management Principles', 'Bắt buộc', 3.0, 30.0, 15.0, 45.0, NULL::numeric, 'Quản trị học')
) AS src(Code, Name, NameEn, CourseType, Credits, TheoryHours, PracticeHours, SelfStudyHours, InternshipCredits, Description)
JOIN Departments d ON d.Code = CASE
  WHEN src.Code LIKE 'CS%' THEN 'CNTT'
  WHEN src.Code LIKE 'NN%' THEN 'NN'
  ELSE 'QTKD'
END
WHERE NOT EXISTS (SELECT 1 FROM Courses c WHERE c.Code = src.Code);

-- Classes
INSERT INTO Classes (ClassId, ClassCode, ClassName, DepartmentId, AdvisorId, AcademicCohortId, MaxSize, Status, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.ClassCode, src.ClassName, d.DepartmentId, i.EmployeeId, ac.AcademicCohortId, src.MaxSize, src.Status, src.Note, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('CNTT-K24-01', 'Lớp CNTT khóa 24 - 01', 'CNTT', 'K24', 'GV01', 40, 1, 'Lớp CNTT 1'),
  ('CNTT-K24-02', 'Lớp CNTT khóa 24 - 02', 'CNTT', 'K24', 'GV02', 40, 1, 'Lớp CNTT 2'),
  ('CNTT-K25-01', 'Lớp CNTT khóa 25 - 01', 'CNTT', 'K25', 'GV03', 40, 1, 'Lớp CNTT 3'),
  ('KTDL-K24-01', 'Lớp kế toán khóa 24 - 01', 'KTDL', 'K24', 'GV04', 40, 1, 'Lớp Kế toán'),
  ('QTKD-K25-01', 'Lớp QTKD khóa 25 - 01', 'QTKD', 'K25', 'GV05', 40, 1, 'Lớp QTKD'),
  ('NN-K25-01', 'Lớp tiếng Anh khóa 25 - 01', 'NN', 'K25', 'GV06', 35, 1, 'Lớp tiếng Anh')
) AS src(ClassCode, ClassName, DepartmentCode, CohortCode, AdvisorCode, MaxSize, Status, Note)
JOIN Departments d ON d.Code = src.DepartmentCode
JOIN AcademicCohorts ac ON ac.Code = src.CohortCode
JOIN Employees e ON e.EmployeeCode = src.AdvisorCode
JOIN Instructors i ON i.EmployeeId = e.EmployeeId
WHERE NOT EXISTS (SELECT 1 FROM Classes c WHERE c.ClassCode = src.ClassCode);

-- Course classes
INSERT INTO CourseClasses (CourseClassId, ClassCode, MaxStudent, CurrentStudent, RoomId, Status, SemesterId, CourseId, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.ClassCode, src.MaxStudent, src.CurrentStudent, r.RoomId, src.Status, s.SemesterId, c.CourseId, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('CNTT-K24-01', 40, 28, 'Đang học', 'HK1-2024', 'CS101'),
  ('CNTT-K24-02', 40, 30, 'Đang học', 'HK1-2024', 'CS102'),
  ('CNTT-K25-01', 40, 22, 'Đang học', 'HK1-2025', 'CS201'),
  ('KTDL-K24-01', 40, 25, 'Đang học', 'HK1-2024', 'CS202'),
  ('QTKD-K25-01', 40, 24, 'Đang học', 'HK1-2025', 'QTKD101'),
  ('NN-K25-01', 35, 20, 'Đang học', 'HK1-2025', 'NN101')
) AS src(ClassCode, MaxStudent, CurrentStudent, Status, SemesterCode, CourseCode)
JOIN Semesters s ON s.Code = src.SemesterCode
JOIN Courses c ON c.Code = src.CourseCode
LEFT JOIN Rooms r ON r.Code = CASE
  WHEN src.ClassCode LIKE 'CNTT%' THEN 'B101'
  WHEN src.ClassCode LIKE 'KTDL%' THEN 'B102'
  WHEN src.ClassCode LIKE 'QTKD%' THEN 'A101'
  ELSE 'C102'
END
WHERE NOT EXISTS (SELECT 1 FROM CourseClasses cc WHERE cc.SemesterId = s.SemesterId AND cc.CourseId = c.CourseId AND cc.ClassCode = src.ClassCode);

-- Student classes
INSERT INTO StudentClasses (StudentClassId, StudentId, ClassId, SemesterId, RoleInClass, Status, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), s.StudentId, cl.ClassId, sem.SemesterId, 'Sinh viên', 'Đang học', 'Phân lớp demo', TRUE, CURRENT_TIMESTAMP
FROM Students s
CROSS JOIN LATERAL (
  SELECT cl2.ClassId, cc2.SemesterId
  FROM Classes cl2
  JOIN CourseClasses cc2 ON cc2.ClassCode = cl2.ClassCode
  ORDER BY cl2.ClassCode
  LIMIT 2
) cl
JOIN Semesters sem ON sem.SemesterId = cl.SemesterId
WHERE NOT EXISTS (
  SELECT 1 FROM StudentClasses sc
  WHERE sc.StudentId = s.StudentId AND sc.ClassId = cl.ClassId AND sc.SemesterId = sem.SemesterId
);

-- Schedules
WITH numbered_course_classes AS (
  SELECT cc.CourseClassId, cc.SemesterId, cc.ClassCode, row_number() OVER (ORDER BY cc.CourseClassId) AS rn
  FROM CourseClasses cc
)
INSERT INTO Schedules (ScheduleId, CourseClassId, EmployeeId, SemesterId, RoomId, DayOfWeek, Date, Shift, TimeSlotId, NumberOfPeriods, StartDate, EndDate, Mode, Status, Description, ScheduleStatus, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), ncc.CourseClassId, i.EmployeeId, ncc.SemesterId, r.RoomId,
       ((ncc.rn - 1) % 6) + 1,
       NULL::date, 'Sáng', ts.TimeSlotId, 2, NULL, NULL, 'Trực tiếp', 'SCHEDULED', 'Lịch học demo', 'ACTIVE', 'Sinh viên học tại lớp', TRUE, CURRENT_TIMESTAMP
FROM numbered_course_classes ncc
JOIN Classes cl ON cl.ClassCode = ncc.ClassCode
JOIN Instructors i ON i.EmployeeId = cl.AdvisorId
JOIN TimeSlots ts ON ts.SlotCode = CASE ((ncc.rn - 1) % 5) + 1
  WHEN 1 THEN 'T1'
  WHEN 2 THEN 'T2'
  WHEN 3 THEN 'T3'
  WHEN 4 THEN 'T4'
  ELSE 'T5'
END
LEFT JOIN Rooms r ON r.Code = CASE
  WHEN cl.ClassCode LIKE 'CNTT%' THEN 'B101'
  WHEN cl.ClassCode LIKE 'KTDL%' THEN 'B102'
  WHEN cl.ClassCode LIKE 'QTKD%' THEN 'A101'
  ELSE 'C102'
END
WHERE NOT EXISTS (SELECT 1 FROM Schedules sc WHERE sc.CourseClassId = ncc.CourseClassId);

-- Exam types
INSERT INTO ExamTypes (ExamTypeId, Name, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Name, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
  ('Giữa kỳ', 'Bài thi giữa kỳ'),
  ('Cuối kỳ', 'Bài thi cuối kỳ')
) AS src(Name, Description)
WHERE NOT EXISTS (SELECT 1 FROM ExamTypes WHERE Name = src.Name);

-- Exams and exam rooms
INSERT INTO Exams (ExamId, ExamTypeId, CourseClassId, SemesterId, ExamDate, StartTime, DurationMinutes, EndTime, ExamFormat, ExamStatus, SupervisorCount, IsActive, CreatedAt)
SELECT gen_random_uuid(), et.ExamTypeId, cc.CourseClassId, cc.SemesterId, CURRENT_DATE + (((row_number() OVER (ORDER BY cc.CourseClassId)) % 20)::int), TIME '08:00', 90, TIME '09:30', 'Trực tiếp', 'PLANNED', 2, TRUE, CURRENT_TIMESTAMP
FROM CourseClasses cc
JOIN ExamTypes et ON et.Name = 'Cuối kỳ'
WHERE NOT EXISTS (SELECT 1 FROM Exams e WHERE e.CourseClassId = cc.CourseClassId);

INSERT INTO ExamRooms (ExamRoomId, ExamId, RoomId, Capacity, IsActive, CreatedAt)
SELECT gen_random_uuid(), e.ExamId, r.RoomId, r.Capacity, TRUE, CURRENT_TIMESTAMP
FROM Exams e
JOIN CourseClasses cc ON cc.CourseClassId = e.CourseClassId
LEFT JOIN Rooms r ON r.Code = CASE
  WHEN cc.ClassCode LIKE 'CNTT%' THEN 'A201'
  WHEN cc.ClassCode LIKE 'KTDL%' THEN 'B201'
  WHEN cc.ClassCode LIKE 'QTKD%' THEN 'C101'
  ELSE 'C102'
END
WHERE NOT EXISTS (SELECT 1 FROM ExamRooms er WHERE er.ExamId = e.ExamId);
