-- Delta migration after V32:
-- keep already-applied seed data aligned with the account workflow without editing applied migrations.

WITH student_seed(old_email, email_edu, full_name, full_name_no_accent, gender, dob, phone, address, student_code, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('sv2025001@donga.edu.vn', 'ngoc101292@donga.edu.vn', 'Nguyễn Thọ Ngọc', 'ngoc', 'Nam', DATE '2004-10-12', '0905001001', 'Đà Nẵng', '101292', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('sv2025002@donga.edu.vn', 'cong101293@donga.edu.vn', 'Võ Thế Công', 'cong', 'Nam', DATE '2004-04-22', '0905001002', 'Đà Nẵng', '101293', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('sv2025003@donga.edu.vn', 'den101294@donga.edu.vn', 'Ksor Rmah Phi Đen', 'den', 'Nam', DATE '2004-08-15', '0905001003', 'Gia Lai', '101294', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('sv2025004@donga.edu.vn', 'anh101295@donga.edu.vn', 'Trần Minh Anh', 'anh', 'Nữ', DATE '2005-01-14', '0905001004', 'Quảng Nam', '101295', 'CNTT', 'CNTT01', 'K24', 'CTDT01'),
        ('sv2025005@donga.edu.vn', 'phuc101296@donga.edu.vn', 'Lê Hoàng Phúc', 'phuc', 'Nam', DATE '2005-02-20', '0905001005', 'Huế', '101296', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('sv2025006@donga.edu.vn', 'phong101297@donga.edu.vn', 'Vũ Thanh Phong', 'phong', 'Nam', DATE '2005-03-18', '0905001006', 'Đà Nẵng', '101297', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('sv2025007@donga.edu.vn', 'giang101298@donga.edu.vn', 'Đỗ Hải Giang', 'giang', 'Nam', DATE '2005-05-09', '0905001007', 'Quảng Ngãi', '101298', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('sv2025008@donga.edu.vn', 'ha101299@donga.edu.vn', 'Ngô Bảo Hà', 'ha', 'Nữ', DATE '2005-06-11', '0905001008', 'Đà Nẵng', '101299', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('sv2025009@donga.edu.vn', 'ich101300@donga.edu.vn', 'Bùi Thành Ích', 'ich', 'Nam', DATE '2005-07-19', '0905001009', 'Quảng Nam', '101300', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('sv2025010@donga.edu.vn', 'khang101301@donga.edu.vn', 'Trần Gia Khang', 'khang', 'Nam', DATE '2005-09-25', '0905001010', 'Huế', '101301', 'CNTT', 'CNTT02', 'K25', 'CTDT02')
)
UPDATE Persons p
SET FullName = s.full_name,
    FullNameNoAccent = s.full_name_no_accent,
    Gender = s.gender,
    DateOfBirth = s.dob,
    Nationality = 'Việt Nam',
    ContactEmail = s.email_edu,
    PhoneNumber = s.phone,
    PermanentAddress = s.address,
    Note = 'Sinh viên chính quy được seed theo workflow tài khoản',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM student_seed s
WHERE p.ContactEmail IN (s.old_email, s.email_edu);

WITH employee_seed(old_email, email_edu, full_name, full_name_no_accent, gender, dob, phone, address, employee_code, profile_code, account_type) AS (
    VALUES
        ('gv01@donga.edu.vn', 'hieugv2026001@donga.edu.vn', 'Trương Văn Hiệu', 'hieu', 'Nam', DATE '1985-05-20', '0906001001', 'Đà Nẵng', '2026001', 'GV2026001', 'INSTRUCTOR'),
        ('gv02@donga.edu.vn', 'haigv2026002@donga.edu.vn', 'Nguyễn Văn Hải', 'hai', 'Nam', DATE '1988-02-11', '0906001002', 'Đà Nẵng', '2026002', 'GV2026002', 'INSTRUCTOR'),
        ('gv03@donga.edu.vn', 'hanhgv2026003@donga.edu.vn', 'Lê Thị Hạnh', 'hanh', 'Nữ', DATE '1989-03-12', '0906001003', 'Huế', '2026003', 'GV2026003', 'INSTRUCTOR'),
        ('nv01@donga.edu.vn', 'trangnv2026011@donga.edu.vn', 'Nguyễn Thị Trang', 'trang', 'Nữ', DATE '1991-08-17', '0906002001', 'Đà Nẵng', '2026011', 'NV2026011', 'STAFF'),
        ('nv02@donga.edu.vn', 'tungnv2026012@donga.edu.vn', 'Lê Văn Tùng', 'tung', 'Nam', DATE '1992-09-18', '0906002002', 'Đà Nẵng', '2026012', 'NV2026012', 'STAFF'),
        ('admin@donga.edu.vn', 'admin@donga.edu.vn', 'Quản trị hệ thống', 'admin', 'Nam', DATE '1985-01-01', '0906000001', 'Đà Nẵng', '000001', 'admin', 'ADMIN')
)
UPDATE Persons p
SET FullName = e.full_name,
    FullNameNoAccent = e.full_name_no_accent,
    Gender = e.gender,
    DateOfBirth = e.dob,
    Nationality = 'Việt Nam',
    ContactEmail = e.email_edu,
    PhoneNumber = e.phone,
    PermanentAddress = e.address,
    Note = CASE WHEN e.account_type = 'INSTRUCTOR' THEN 'Giảng viên cơ hữu'
                WHEN e.account_type = 'STAFF' THEN 'Nhân viên hành chính'
                ELSE 'Tài khoản quản trị hệ thống' END,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM employee_seed e
WHERE p.ContactEmail IN (e.old_email, e.email_edu);

WITH student_seed(email_edu, student_code, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('ngoc101292@donga.edu.vn', '101292', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('cong101293@donga.edu.vn', '101293', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('den101294@donga.edu.vn', '101294', 'CNTT', 'CNTT02', 'K24', 'CTDT01'),
        ('anh101295@donga.edu.vn', '101295', 'CNTT', 'CNTT01', 'K24', 'CTDT01'),
        ('phuc101296@donga.edu.vn', '101296', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('phong101297@donga.edu.vn', '101297', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('giang101298@donga.edu.vn', '101298', 'CNTT', 'CNTT02', 'K25', 'CTDT02'),
        ('ha101299@donga.edu.vn', '101299', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('ich101300@donga.edu.vn', '101300', 'CNTT', 'CNTT01', 'K25', 'CTDT02'),
        ('khang101301@donga.edu.vn', '101301', 'CNTT', 'CNTT02', 'K25', 'CTDT02')
)
UPDATE Students st
SET StudentCode = s.student_code,
    DepartmentId = d.DepartmentId,
    MajorId = m.MajorId,
    AcademicCohortId = ac.AcademicCohortId,
    TrainingProgramId = tp.TrainingProgramId,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN student_seed s ON s.email_edu = p.ContactEmail
JOIN Departments d ON d.Code = s.department_code
JOIN Majors m ON m.Code = s.major_code
JOIN AcademicCohorts ac ON ac.Code = s.cohort_code
JOIN TrainingPrograms tp ON tp.Code = s.program_code
WHERE st.PersonId = p.PersonId;

WITH employee_seed(email_edu, employee_code, account_type) AS (
    VALUES
        ('hieugv2026001@donga.edu.vn', '2026001', 'INSTRUCTOR'),
        ('haigv2026002@donga.edu.vn', '2026002', 'INSTRUCTOR'),
        ('hanhgv2026003@donga.edu.vn', '2026003', 'INSTRUCTOR'),
        ('trangnv2026011@donga.edu.vn', '2026011', 'STAFF'),
        ('tungnv2026012@donga.edu.vn', '2026012', 'STAFF')
)
UPDATE Employees emp
SET EmployeeCode = e.employee_code,
    StartWorkDate = DATE '2022-09-01',
    Status = 'ACTIVE',
    EmployeeType = e.account_type,
    ContractType = 'FULL_TIME',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN employee_seed e ON e.email_edu = p.ContactEmail
WHERE emp.PersonId = p.PersonId;

WITH instructor_seed(email_edu, instructor_code, department_code) AS (
    VALUES
        ('hieugv2026001@donga.edu.vn', 'GV2026001', 'CNTT'),
        ('haigv2026002@donga.edu.vn', 'GV2026002', 'CNTT'),
        ('hanhgv2026003@donga.edu.vn', 'GV2026003', 'CNTT')
)
UPDATE Instructors i
SET InstructorCode = ins.instructor_code,
    DepartmentId = d.DepartmentId,
    UpdatedAt = CURRENT_TIMESTAMP,
    DeletedAt = NULL
FROM Employees emp
JOIN Persons p ON p.PersonId = emp.PersonId
JOIN instructor_seed ins ON ins.email_edu = p.ContactEmail
JOIN Departments d ON d.Code = ins.department_code
WHERE i.EmployeeId = emp.EmployeeId;

WITH staff_seed(email_edu, staff_code, division_code, position_code) AS (
    VALUES
        ('trangnv2026011@donga.edu.vn', 'NV2026011', 'DT', 'ADMIN_STAFF'),
        ('tungnv2026012@donga.edu.vn', 'NV2026012', 'CTSV', 'ADMIN_STAFF')
)
UPDATE Staffs st
SET StaffCode = s.staff_code,
    DivisionId = div.DivisionId,
    PositionId = pos.PositionId,
    UpdatedAt = CURRENT_TIMESTAMP,
    DeletedAt = NULL
FROM Employees emp
JOIN Persons p ON p.PersonId = emp.PersonId
JOIN staff_seed s ON s.email_edu = p.ContactEmail
JOIN Divisions div ON div.Code = s.division_code
JOIN Positions pos ON pos.Code = s.position_code
WHERE st.EmployeeId = emp.EmployeeId;

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
        ('hanhgv2026003@donga.edu.vn', 'hanhgv2026003', 'LECTURER', TRUE, FALSE),
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
