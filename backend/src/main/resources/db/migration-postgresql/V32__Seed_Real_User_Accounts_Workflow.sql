-- Seed/normalize realistic account data for the user workflow:
-- Person -> Student/Employee -> User -> UserRoles.
-- Username follows the generated business code, email edu follows lastNameNoAccent + code + @donga.edu.vn.

WITH seed(old_email, full_name, full_name_no_accent, gender, dob, phone, address, student_code, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('sv2025001@donga.edu.vn', 'Nguyễn Thọ Ngọc', 'ngoc', 'Nam', DATE '2004-10-12', '0905001001', 'Đà Nẵng', '101292', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('sv2025002@donga.edu.vn', 'Võ Thế Công', 'cong', 'Nam', DATE '2004-04-22', '0905001002', 'Đà Nẵng', '101293', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('sv2025003@donga.edu.vn', 'Ksor Rmah Phi Đen', 'den', 'Nam', DATE '2004-08-15', '0905001003', 'Gia Lai', '101294', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('sv2025004@donga.edu.vn', 'Trần Minh Anh', 'anh', 'Nữ', DATE '2005-01-14', '0905001004', 'Quảng Nam', '101295', 'CNTT', 'CNTT01', 'K24', 'CTDT01'),
        ('sv2025005@donga.edu.vn', 'Lê Hoàng Phúc', 'phuc', 'Nam', DATE '2005-02-20', '0905001005', 'Huế', '101296', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('sv2025006@donga.edu.vn', 'Vũ Thanh Phong', 'phong', 'Nam', DATE '2005-03-18', '0905001006', 'Đà Nẵng', '101297', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('sv2025007@donga.edu.vn', 'Đỗ Hải Giang', 'giang', 'Nam', DATE '2005-05-09', '0905001007', 'Quảng Ngãi', '101298', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('sv2025008@donga.edu.vn', 'Ngô Bảo Hà', 'ha', 'Nữ', DATE '2005-06-11', '0905001008', 'Đà Nẵng', '101299', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('sv2025009@donga.edu.vn', 'Bùi Thành Ích', 'ich', 'Nam', DATE '2005-07-19', '0905001009', 'Quảng Nam', '101300', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('sv2025010@donga.edu.vn', 'Trần Gia Khang', 'khang', 'Nam', DATE '2005-09-25', '0905001010', 'Huế', '101301', 'CNTT', 'CNTT02', 'K25', 'CTDT02')
),
normalized AS (
    SELECT *, full_name_no_accent || lower(student_code) || '@donga.edu.vn' AS email_edu
    FROM seed
)
UPDATE Persons p
SET FullName = n.full_name,
    FullNameNoAccent = n.full_name_no_accent,
    Gender = n.gender,
    DateOfBirth = n.dob,
    Nationality = 'Việt Nam',
    ContactEmail = n.email_edu,
    PhoneNumber = n.phone,
    PermanentAddress = n.address,
    Note = 'Sinh viên chính quy được seed theo workflow tài khoản',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM normalized n
WHERE p.ContactEmail IN (n.old_email, n.email_edu);

WITH seed(full_name, full_name_no_accent, gender, dob, phone, address, student_code, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('Nguyễn Thọ Ngọc', 'ngoc', 'Nam', DATE '2004-10-12', '0905001001', 'Đà Nẵng', '101292', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('Võ Thế Công', 'cong', 'Nam', DATE '2004-04-22', '0905001002', 'Đà Nẵng', '101293', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('Ksor Rmah Phi Đen', 'den', 'Nam', DATE '2004-08-15', '0905001003', 'Gia Lai', '101294', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('Trần Minh Anh', 'anh', 'Nữ', DATE '2005-01-14', '0905001004', 'Quảng Nam', '101295', 'CNTT', 'CNTT01', 'K24', 'CTDT01'),
        ('Lê Hoàng Phúc', 'phuc', 'Nam', DATE '2005-02-20', '0905001005', 'Huế', '101296', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('Vũ Thanh Phong', 'phong', 'Nam', DATE '2005-03-18', '0905001006', 'Đà Nẵng', '101297', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('Đỗ Hải Giang', 'giang', 'Nam', DATE '2005-05-09', '0905001007', 'Quảng Ngãi', '101298', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('Ngô Bảo Hà', 'ha', 'Nữ', DATE '2005-06-11', '0905001008', 'Đà Nẵng', '101299', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('Bùi Thành Ích', 'ich', 'Nam', DATE '2005-07-19', '0905001009', 'Quảng Nam', '101300', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('Trần Gia Khang', 'khang', 'Nam', DATE '2005-09-25', '0905001010', 'Huế', '101301', 'CNTT', 'CNTT02', 'K25', 'CTDT02')
),
normalized AS (
    SELECT *, full_name_no_accent || lower(student_code) || '@donga.edu.vn' AS email_edu
    FROM seed
)
INSERT INTO Persons (PersonId, FullName, FullNameNoAccent, Gender, DateOfBirth, Nationality, ContactEmail, PhoneNumber, PermanentAddress, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), n.full_name, n.full_name_no_accent, n.gender, n.dob, 'Việt Nam', n.email_edu, n.phone, n.address,
       'Sinh viên chính quy được seed theo workflow tài khoản', TRUE, CURRENT_TIMESTAMP
FROM normalized n
WHERE NOT EXISTS (SELECT 1 FROM Persons p WHERE p.ContactEmail = n.email_edu);

WITH seed(student_code, email_edu, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('101292', 'ngoc101292@donga.edu.vn', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('101293', 'cong101293@donga.edu.vn', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('101294', 'den101294@donga.edu.vn', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('101295', 'anh101295@donga.edu.vn', 'CNTT', 'CNTT01', 'K24', 'CTDT01'),
        ('101296', 'phuc101296@donga.edu.vn', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('101297', 'phong101297@donga.edu.vn', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('101298', 'giang101298@donga.edu.vn', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('101299', 'ha101299@donga.edu.vn', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('101300', 'ich101300@donga.edu.vn', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('101301', 'khang101301@donga.edu.vn', 'CNTT', 'CNTT02', 'K25', 'CTDT02')
)
UPDATE Students s
SET StudentCode = seed.student_code,
    DepartmentId = d.DepartmentId,
    MajorId = m.MajorId,
    AcademicCohortId = ac.AcademicCohortId,
    TrainingProgramId = tp.TrainingProgramId,
    Note = 'Sinh viên chính quy',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN seed ON seed.email_edu = p.ContactEmail
JOIN Departments d ON d.Code = seed.department_code
JOIN Majors m ON m.Code = seed.major_code
JOIN AcademicCohorts ac ON ac.Code = seed.cohort_code
JOIN TrainingPrograms tp ON tp.Code = seed.program_code
WHERE s.PersonId = p.PersonId;

WITH seed(student_code, email_edu, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('101292', 'ngoc101292@donga.edu.vn', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('101293', 'cong101293@donga.edu.vn', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('101294', 'den101294@donga.edu.vn', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('101295', 'anh101295@donga.edu.vn', 'CNTT', 'CNTT01', 'K24', 'CTDT01'),
        ('101296', 'phuc101296@donga.edu.vn', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('101297', 'phong101297@donga.edu.vn', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('101298', 'giang101298@donga.edu.vn', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('101299', 'ha101299@donga.edu.vn', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('101300', 'ich101300@donga.edu.vn', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('101301', 'khang101301@donga.edu.vn', 'CNTT', 'CNTT02', 'K25', 'CTDT02')
)
INSERT INTO Students (StudentId, PersonId, StudentCode, Note, DepartmentId, MajorId, AcademicCohortId, TrainingProgramId, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, seed.student_code, 'Sinh viên chính quy',
       d.DepartmentId, m.MajorId, ac.AcademicCohortId, tp.TrainingProgramId, TRUE, CURRENT_TIMESTAMP
FROM seed
JOIN Persons p ON p.ContactEmail = seed.email_edu
JOIN Departments d ON d.Code = seed.department_code
JOIN Majors m ON m.Code = seed.major_code
JOIN AcademicCohorts ac ON ac.Code = seed.cohort_code
JOIN TrainingPrograms tp ON tp.Code = seed.program_code
WHERE NOT EXISTS (SELECT 1 FROM Students s WHERE s.StudentCode = seed.student_code OR s.PersonId = p.PersonId);

WITH seed(old_email, full_name, full_name_no_accent, gender, dob, phone, address, employee_code, profile_code, account_type, role_code, department_code, division_code, position_name) AS (
    VALUES
        ('gv01@donga.edu.vn', 'Trương Văn Hiệu', 'hieu', 'Nam', DATE '1985-05-20', '0906001001', 'Đà Nẵng', '2026001', 'GV2026001', 'INSTRUCTOR', 'LECTURER', 'CNTT', NULL, NULL),
        ('gv02@donga.edu.vn', 'Nguyễn Văn Hải', 'hai', 'Nam', DATE '1988-02-11', '0906001002', 'Đà Nẵng', '2026002', 'GV2026002', 'INSTRUCTOR', 'LECTURER', 'CNTT', NULL, NULL),
        ('gv03@donga.edu.vn', 'Lê Thị Hạnh', 'hanh', 'Nữ', DATE '1989-03-12', '0906001003', 'Huế', '2026003', 'GV2026003', 'INSTRUCTOR', 'LECTURER', 'CNTT', NULL, NULL),
        ('nv01@donga.edu.vn', 'Nguyễn Thị Trang', 'trang', 'Nữ', DATE '1991-08-17', '0906002001', 'Đà Nẵng', '2026011', 'NV2026011', 'STAFF', 'STAFF', NULL, 'DT', 'Nhân viên hành chính'),
        ('nv02@donga.edu.vn', 'Lê Văn Tùng', 'tung', 'Nam', DATE '1992-09-18', '0906002002', 'Đà Nẵng', '2026012', 'NV2026012', 'STAFF', 'STAFF', NULL, 'CTSV', 'Nhân viên hành chính'),
        ('admin@donga.edu.vn', 'Quản trị hệ thống', 'admin', 'Nam', DATE '1985-01-01', '0906000001', 'Đà Nẵng', '000001', 'admin', 'ADMIN', 'ADMIN', NULL, NULL, NULL)
),
normalized AS (
    SELECT *, CASE WHEN account_type = 'ADMIN' THEN 'admin@donga.edu.vn' ELSE full_name_no_accent || lower(profile_code) || '@donga.edu.vn' END AS email_edu
    FROM seed
)
UPDATE Persons p
SET FullName = n.full_name,
    FullNameNoAccent = n.full_name_no_accent,
    Gender = n.gender,
    DateOfBirth = n.dob,
    Nationality = 'Việt Nam',
    ContactEmail = n.email_edu,
    PhoneNumber = n.phone,
    PermanentAddress = n.address,
    Note = CASE WHEN n.account_type = 'INSTRUCTOR' THEN 'Giảng viên cơ hữu'
                WHEN n.account_type = 'STAFF' THEN 'Nhân viên hành chính'
                ELSE 'Tài khoản quản trị hệ thống' END,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM normalized n
WHERE p.ContactEmail IN (n.old_email, n.email_edu);

WITH seed(full_name, full_name_no_accent, gender, dob, phone, address, profile_code, account_type) AS (
    VALUES
        ('Trương Văn Hiệu', 'hieu', 'Nam', DATE '1985-05-20', '0906001001', 'Đà Nẵng', 'GV2026001', 'INSTRUCTOR'),
        ('Nguyễn Văn Hải', 'hai', 'Nam', DATE '1988-02-11', '0906001002', 'Đà Nẵng', 'GV2026002', 'INSTRUCTOR'),
        ('Lê Thị Hạnh', 'hanh', 'Nữ', DATE '1989-03-12', '0906001003', 'Huế', 'GV2026003', 'INSTRUCTOR'),
        ('Nguyễn Thị Trang', 'trang', 'Nữ', DATE '1991-08-17', '0906002001', 'Đà Nẵng', 'NV2026011', 'STAFF'),
        ('Lê Văn Tùng', 'tung', 'Nam', DATE '1992-09-18', '0906002002', 'Đà Nẵng', 'NV2026012', 'STAFF'),
        ('Quản trị hệ thống', 'admin', 'Nam', DATE '1985-01-01', '0906000001', 'Đà Nẵng', 'admin', 'ADMIN')
),
normalized AS (
    SELECT *, CASE WHEN account_type = 'ADMIN' THEN 'admin@donga.edu.vn' ELSE full_name_no_accent || lower(profile_code) || '@donga.edu.vn' END AS email_edu
    FROM seed
)
INSERT INTO Persons (PersonId, FullName, FullNameNoAccent, Gender, DateOfBirth, Nationality, ContactEmail, PhoneNumber, PermanentAddress, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), n.full_name, n.full_name_no_accent, n.gender, n.dob, 'Việt Nam', n.email_edu, n.phone, n.address,
       CASE WHEN n.account_type = 'INSTRUCTOR' THEN 'Giảng viên cơ hữu'
            WHEN n.account_type = 'STAFF' THEN 'Nhân viên hành chính'
            ELSE 'Tài khoản quản trị hệ thống' END,
       TRUE, CURRENT_TIMESTAMP
FROM normalized n
WHERE NOT EXISTS (SELECT 1 FROM Persons p WHERE p.ContactEmail = n.email_edu);

WITH seed(email_edu, employee_code, profile_code, account_type, department_code, division_code, position_name) AS (
    VALUES
        ('hieugv2026001@donga.edu.vn', '2026001', 'GV2026001', 'INSTRUCTOR', 'CNTT', NULL, NULL),
        ('haigv2026002@donga.edu.vn', '2026002', 'GV2026002', 'INSTRUCTOR', 'CNTT', NULL, NULL),
        ('hanhgv2026003@donga.edu.vn', '2026003', 'GV2026003', 'INSTRUCTOR', 'CNTT', NULL, NULL),
        ('trangnv2026011@donga.edu.vn', '2026011', 'NV2026011', 'STAFF', NULL, 'DT', 'Nhân viên hành chính'),
        ('tungnv2026012@donga.edu.vn', '2026012', 'NV2026012', 'STAFF', NULL, 'CTSV', 'Nhân viên hành chính')
)
UPDATE Employees e
SET EmployeeCode = seed.employee_code,
    StartWorkDate = DATE '2022-09-01',
    Status = 'ACTIVE',
    EmployeeType = seed.account_type,
    ContractType = 'FULL_TIME',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN seed ON seed.email_edu = p.ContactEmail
WHERE e.PersonId = p.PersonId;

WITH seed(email_edu, employee_code, account_type) AS (
    VALUES
        ('hieugv2026001@donga.edu.vn', '2026001', 'INSTRUCTOR'),
        ('haigv2026002@donga.edu.vn', '2026002', 'INSTRUCTOR'),
        ('hanhgv2026003@donga.edu.vn', '2026003', 'INSTRUCTOR'),
        ('trangnv2026011@donga.edu.vn', '2026011', 'STAFF'),
        ('tungnv2026012@donga.edu.vn', '2026012', 'STAFF')
)
INSERT INTO Employees (EmployeeId, PersonId, EmployeeCode, StartWorkDate, Status, EmployeeType, ContractType, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, seed.employee_code, DATE '2022-09-01', 'ACTIVE', seed.account_type, 'FULL_TIME', TRUE, CURRENT_TIMESTAMP
FROM seed
JOIN Persons p ON p.ContactEmail = seed.email_edu
WHERE NOT EXISTS (SELECT 1 FROM Employees e WHERE e.EmployeeCode = seed.employee_code OR e.PersonId = p.PersonId);

WITH seed(email_edu, instructor_code, department_code) AS (
    VALUES
        ('hieugv2026001@donga.edu.vn', 'GV2026001', 'CNTT'),
        ('haigv2026002@donga.edu.vn', 'GV2026002', 'CNTT'),
        ('hanhgv2026003@donga.edu.vn', 'GV2026003', 'CNTT')
)
UPDATE Instructors i
SET InstructorCode = seed.instructor_code,
    DepartmentId = d.DepartmentId,
    UpdatedAt = CURRENT_TIMESTAMP,
    DeletedAt = NULL
FROM Employees e
JOIN Persons p ON p.PersonId = e.PersonId
JOIN seed ON seed.email_edu = p.ContactEmail
JOIN Departments d ON d.Code = seed.department_code
WHERE i.EmployeeId = e.EmployeeId;

WITH seed(email_edu, instructor_code, department_code) AS (
    VALUES
        ('hieugv2026001@donga.edu.vn', 'GV2026001', 'CNTT'),
        ('haigv2026002@donga.edu.vn', 'GV2026002', 'CNTT'),
        ('hanhgv2026003@donga.edu.vn', 'GV2026003', 'CNTT')
)
INSERT INTO Instructors (EmployeeId, InstructorCode, DepartmentId, CreatedAt)
SELECT e.EmployeeId, seed.instructor_code, d.DepartmentId, CURRENT_TIMESTAMP
FROM seed
JOIN Persons p ON p.ContactEmail = seed.email_edu
JOIN Employees e ON e.PersonId = p.PersonId
JOIN Departments d ON d.Code = seed.department_code
WHERE NOT EXISTS (SELECT 1 FROM Instructors i WHERE i.EmployeeId = e.EmployeeId OR i.InstructorCode = seed.instructor_code);

WITH seed(email_edu, staff_code, division_code, position_code) AS (
    VALUES
        ('trangnv2026011@donga.edu.vn', 'NV2026011', 'DT', 'ADMIN_STAFF'),
        ('tungnv2026012@donga.edu.vn', 'NV2026012', 'CTSV', 'ADMIN_STAFF')
)
UPDATE Staffs s
SET StaffCode = seed.staff_code,
    DivisionId = div.DivisionId,
    PositionId = pos.PositionId,
    UpdatedAt = CURRENT_TIMESTAMP,
    DeletedAt = NULL
FROM Employees e
JOIN Persons p ON p.PersonId = e.PersonId
JOIN seed ON seed.email_edu = p.ContactEmail
JOIN Divisions div ON div.Code = seed.division_code
JOIN Positions pos ON pos.Code = seed.position_code
WHERE s.EmployeeId = e.EmployeeId;

WITH seed(email_edu, staff_code, division_code, position_code) AS (
    VALUES
        ('trangnv2026011@donga.edu.vn', 'NV2026011', 'DT', 'ADMIN_STAFF'),
        ('tungnv2026012@donga.edu.vn', 'NV2026012', 'CTSV', 'ADMIN_STAFF')
)
INSERT INTO Staffs (EmployeeId, StaffCode, DivisionId, PositionId, CreatedAt)
SELECT e.EmployeeId, seed.staff_code, div.DivisionId, pos.PositionId, CURRENT_TIMESTAMP
FROM seed
JOIN Persons p ON p.ContactEmail = seed.email_edu
JOIN Employees e ON e.PersonId = p.PersonId
JOIN Divisions div ON div.Code = seed.division_code
JOIN Positions pos ON pos.Code = seed.position_code
WHERE NOT EXISTS (SELECT 1 FROM Staffs s WHERE s.EmployeeId = e.EmployeeId OR s.StaffCode = seed.staff_code);

WITH account_seed(email_edu, username, role_code, require_change, email_confirmed) AS (
    VALUES
        ('admin@donga.edu.vn', 'admin', 'ADMIN', FALSE, TRUE),
        ('ngoc101292@donga.edu.vn', '101292', 'STUDENT', TRUE, FALSE),
        ('cong101293@donga.edu.vn', '101293', 'STUDENT', TRUE, FALSE),
        ('den101294@donga.edu.vn', '101294', 'STUDENT', TRUE, FALSE),
        ('anh101295@donga.edu.vn', '101295', 'STUDENT', TRUE, FALSE),
        ('phuc101296@donga.edu.vn', '101296', 'STUDENT', TRUE, FALSE),
        ('phong101297@donga.edu.vn', '101297', 'STUDENT', TRUE, FALSE),
        ('giang101298@donga.edu.vn', '101298', 'STUDENT', TRUE, FALSE),
        ('ha101299@donga.edu.vn', '101299', 'STUDENT', TRUE, FALSE),
        ('ich101300@donga.edu.vn', '101300', 'STUDENT', TRUE, FALSE),
        ('khang101301@donga.edu.vn', '101301', 'STUDENT', TRUE, FALSE),
        ('hieugv2026001@donga.edu.vn', 'gv2026001', 'LECTURER', TRUE, FALSE),
        ('haigv2026002@donga.edu.vn', 'gv2026002', 'LECTURER', TRUE, FALSE),
        ('hanhgv2026003@donga.edu.vn', 'gv2026003', 'LECTURER', TRUE, FALSE),
        ('trangnv2026011@donga.edu.vn', 'nv2026011', 'STAFF', TRUE, FALSE),
        ('tungnv2026012@donga.edu.vn', 'nv2026012', 'STAFF', TRUE, FALSE)
)
UPDATE Users u
SET Username = a.username,
    Email = a.email_edu,
    PasswordHash = crypt(to_char(p.DateOfBirth, 'DDMMYYYY'), gen_salt('bf', 10)),
    AccessFailedCount = 0,
    LockoutEndAt = NULL,
    LockReason = NULL,
    RequirePasswordChange = a.require_change,
    EmailConfirmed = a.email_confirmed,
    ConfirmationToken = CASE WHEN a.email_confirmed THEN NULL ELSE COALESCE(u.ConfirmationToken, gen_random_uuid()::text) END,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM account_seed a
JOIN Persons p ON p.ContactEmail = a.email_edu
WHERE u.PersonId = p.PersonId;

WITH account_seed(email_edu, username, require_change, email_confirmed) AS (
    VALUES
        ('admin@donga.edu.vn', 'admin', FALSE, TRUE),
        ('ngoc101292@donga.edu.vn', '101292', TRUE, FALSE),
        ('cong101293@donga.edu.vn', '101293', TRUE, FALSE),
        ('den101294@donga.edu.vn', '101294', TRUE, FALSE),
        ('anh101295@donga.edu.vn', '101295', TRUE, FALSE),
        ('phuc101296@donga.edu.vn', '101296', TRUE, FALSE),
        ('phong101297@donga.edu.vn', '101297', TRUE, FALSE),
        ('giang101298@donga.edu.vn', '101298', TRUE, FALSE),
        ('ha101299@donga.edu.vn', '101299', TRUE, FALSE),
        ('ich101300@donga.edu.vn', '101300', TRUE, FALSE),
        ('khang101301@donga.edu.vn', '101301', TRUE, FALSE),
        ('hieugv2026001@donga.edu.vn', 'gv2026001', TRUE, FALSE),
        ('haigv2026002@donga.edu.vn', 'gv2026002', TRUE, FALSE),
        ('hanhgv2026003@donga.edu.vn', 'gv2026003', TRUE, FALSE),
        ('trangnv2026011@donga.edu.vn', 'nv2026011', TRUE, FALSE),
        ('tungnv2026012@donga.edu.vn', 'nv2026012', TRUE, FALSE)
)
INSERT INTO Users (UserId, PersonId, Username, PasswordHash, Email, AccessFailedCount, RequirePasswordChange, EmailConfirmed, ConfirmationToken, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, a.username, crypt(to_char(p.DateOfBirth, 'DDMMYYYY'), gen_salt('bf', 10)),
       a.email_edu, 0, a.require_change, a.email_confirmed,
       CASE WHEN a.email_confirmed THEN NULL ELSE gen_random_uuid()::text END,
       TRUE, CURRENT_TIMESTAMP
FROM account_seed a
JOIN Persons p ON p.ContactEmail = a.email_edu
WHERE NOT EXISTS (SELECT 1 FROM Users u WHERE u.PersonId = p.PersonId OR u.Username = a.username OR u.Email = a.email_edu);

WITH account_seed(email_edu, role_code) AS (
    VALUES
        ('admin@donga.edu.vn', 'ADMIN'),
        ('ngoc101292@donga.edu.vn', 'STUDENT'),
        ('cong101293@donga.edu.vn', 'STUDENT'),
        ('den101294@donga.edu.vn', 'STUDENT'),
        ('anh101295@donga.edu.vn', 'STUDENT'),
        ('phuc101296@donga.edu.vn', 'STUDENT'),
        ('phong101297@donga.edu.vn', 'STUDENT'),
        ('giang101298@donga.edu.vn', 'STUDENT'),
        ('ha101299@donga.edu.vn', 'STUDENT'),
        ('ich101300@donga.edu.vn', 'STUDENT'),
        ('khang101301@donga.edu.vn', 'STUDENT'),
        ('hieugv2026001@donga.edu.vn', 'LECTURER'),
        ('haigv2026002@donga.edu.vn', 'LECTURER'),
        ('hanhgv2026003@donga.edu.vn', 'LECTURER'),
        ('trangnv2026011@donga.edu.vn', 'STAFF'),
        ('tungnv2026012@donga.edu.vn', 'STAFF')
)
INSERT INTO UserRoles (UserId, RoleId, CreatedAt, IsActive)
SELECT u.UserId, r.RoleId, CURRENT_TIMESTAMP, TRUE
FROM account_seed a
JOIN Users u ON u.Email = a.email_edu
JOIN Roles r ON r.Code = a.role_code
ON CONFLICT (UserId, RoleId) DO UPDATE
SET IsActive = TRUE;
