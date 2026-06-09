-- Seed more realistic cross-department academic data and make sure every active
-- student/instructor/staff has a login account.

INSERT INTO Departments (DepartmentId, Code, Name, Description, IsActive, CreatedAt)
VALUES
    (gen_random_uuid(), 'DTVT', 'Điện tử - Viễn thông', 'Khoa Điện tử - Viễn thông', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'DLNH', 'Du lịch - Nhà hàng - Khách sạn', 'Khoa Du lịch - Nhà hàng - Khách sạn', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'LUAT', 'Luật', 'Khoa Luật', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    Description = EXCLUDED.Description,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO AcademicCohorts (AcademicCohortId, Code, Name, StartYear, EndYear, StartDate, EndDate, Description, IsActive, CreatedAt)
VALUES
    (gen_random_uuid(), 'K26', 'Khóa 26', 2026, 2030, DATE '2026-09-01', DATE '2030-08-31', 'Khóa tuyển sinh 2026', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    StartYear = EXCLUDED.StartYear,
    EndYear = EXCLUDED.EndYear,
    StartDate = EXCLUDED.StartDate,
    EndDate = EXCLUDED.EndDate,
    Description = EXCLUDED.Description,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO Majors (MajorId, DepartmentId, Code, Name, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), d.DepartmentId, src.code, src.name, src.description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('DTVT01', 'DTVT', 'Kỹ thuật điện tử - viễn thông', 'Ngành Kỹ thuật điện tử - viễn thông'),
    ('DLNH01', 'DLNH', 'Quản trị dịch vụ du lịch và lữ hành', 'Ngành Quản trị dịch vụ du lịch và lữ hành'),
    ('DLNH02', 'DLNH', 'Quản trị khách sạn', 'Ngành Quản trị khách sạn'),
    ('LUAT01', 'LUAT', 'Luật kinh tế', 'Ngành Luật kinh tế')
) AS src(code, department_code, name, description)
JOIN Departments d ON d.Code = src.department_code
ON CONFLICT (Code) DO UPDATE
SET DepartmentId = EXCLUDED.DepartmentId,
    Name = EXCLUDED.Name,
    Description = EXCLUDED.Description,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO TrainingPrograms (
    TrainingProgramId,
    Code,
    Name,
    NameEn,
    MajorId,
    DepartmentId,
    AcademicCohortId,
    DegreeLevel,
    EducationType,
    TotalCredits,
    RequiredCredits,
    ElectiveCredits,
    InternshipCredits,
    ThesisCredits,
    AdmissionYear,
    DurationYears,
    MaxDurationYears,
    EffectiveDate,
    ExpiryDate,
    Description,
    Objectives,
    LearningOutcomes,
    Version,
    Status,
    IsActive,
    CreatedAt
)
SELECT
    gen_random_uuid(),
    src.code,
    src.name,
    src.name_en,
    m.MajorId,
    d.DepartmentId,
    ac.AcademicCohortId,
    'Cử nhân',
    'Chính quy',
    src.total_credits,
    src.required_credits,
    src.elective_credits,
    src.internship_credits,
    src.thesis_credits,
    src.admission_year,
    4.0,
    6.0,
    src.effective_date,
    NULL,
    src.description,
    src.objectives,
    src.learning_outcomes,
    '1.0',
    'ACTIVE',
    TRUE,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('CTDT05', 'Chương trình Ngôn ngữ Anh K26', 'English Language Program', 'NN01', 'K26', 125, 96, 19, 5, 5, DATE '2026-09-01', DATE '2026-09-01', 'Chương trình đào tạo Ngôn ngữ Anh', 'Đào tạo cử nhân ngoại ngữ có năng lực giao tiếp và biên phiên dịch', 'Ngoại ngữ, giao tiếp, biên phiên dịch'),
    ('CTDT06', 'Chương trình Điện tử - Viễn thông K26', 'Electronics and Telecommunications Program', 'DTVT01', 'K26', 132, 102, 20, 6, 4, DATE '2026-09-01', DATE '2026-09-01', 'Chương trình đào tạo Điện tử - Viễn thông', 'Đào tạo kỹ sư ứng dụng hệ thống điện tử và truyền thông', 'Mạch điện tử, mạng truyền thông, IoT'),
    ('CTDT07', 'Chương trình Du lịch lữ hành K26', 'Tourism and Travel Management Program', 'DLNH01', 'K26', 126, 95, 21, 5, 5, DATE '2026-09-01', DATE '2026-09-01', 'Chương trình đào tạo Du lịch lữ hành', 'Đào tạo nhân lực quản lý dịch vụ du lịch', 'Điều hành tour, dịch vụ khách hàng, quản trị điểm đến'),
    ('CTDT08', 'Chương trình Quản trị khách sạn K26', 'Hotel Management Program', 'DLNH02', 'K26', 126, 95, 21, 5, 5, DATE '2026-09-01', DATE '2026-09-01', 'Chương trình đào tạo Quản trị khách sạn', 'Đào tạo nhân lực vận hành và quản trị khách sạn', 'Lễ tân, buồng phòng, F&B, quản trị dịch vụ'),
    ('CTDT09', 'Chương trình Luật kinh tế K26', 'Economic Law Program', 'LUAT01', 'K26', 125, 96, 19, 5, 5, DATE '2026-09-01', DATE '2026-09-01', 'Chương trình đào tạo Luật kinh tế', 'Đào tạo cử nhân luật phục vụ doanh nghiệp và cơ quan quản lý', 'Pháp luật kinh doanh, hợp đồng, tuân thủ pháp lý')
) AS src(code, name, name_en, major_code, cohort_code, total_credits, required_credits, elective_credits, internship_credits, thesis_credits, admission_year, effective_date, description, objectives, learning_outcomes)
JOIN Majors m ON m.Code = src.major_code
JOIN Departments d ON d.DepartmentId = m.DepartmentId
JOIN AcademicCohorts ac ON ac.Code = src.cohort_code
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    NameEn = EXCLUDED.NameEn,
    MajorId = EXCLUDED.MajorId,
    DepartmentId = EXCLUDED.DepartmentId,
    AcademicCohortId = EXCLUDED.AcademicCohortId,
    TotalCredits = EXCLUDED.TotalCredits,
    RequiredCredits = EXCLUDED.RequiredCredits,
    ElectiveCredits = EXCLUDED.ElectiveCredits,
    InternshipCredits = EXCLUDED.InternshipCredits,
    ThesisCredits = EXCLUDED.ThesisCredits,
    Description = EXCLUDED.Description,
    Objectives = EXCLUDED.Objectives,
    LearningOutcomes = EXCLUDED.LearningOutcomes,
    Status = 'ACTIVE',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

WITH instructor_seed(email, full_name, full_name_no_accent, gender, dob, phone, address, employee_code, instructor_code, department_code) AS (
    VALUES
        ('quangv2026004@donga.edu.vn', 'Phạm Minh Quân', 'quan', 'Nam', DATE '1986-10-10', '0906101004', 'Đà Nẵng', '2026004', 'GV2026004', 'KTDL'),
        ('maigv2026005@donga.edu.vn', 'Hoàng Thị Mai', 'mai', 'Nữ', DATE '1987-11-12', '0906101005', 'Quảng Nam', '2026005', 'GV2026005', 'QTKD'),
        ('baogv2026006@donga.edu.vn', 'Đặng Quốc Bảo', 'bao', 'Nam', DATE '1984-09-05', '0906101006', 'Huế', '2026006', 'GV2026006', 'NN'),
        ('khoigv2026007@donga.edu.vn', 'Lê Minh Khôi', 'khoi', 'Nam', DATE '1989-06-22', '0906101007', 'Đà Nẵng', '2026007', 'GV2026007', 'DTVT'),
        ('ngangv2026008@donga.edu.vn', 'Nguyễn Thị Kim Ngân', 'ngan', 'Nữ', DATE '1990-04-18', '0906101008', 'Quảng Ngãi', '2026008', 'GV2026008', 'DLNH'),
        ('tuangv2026009@donga.edu.vn', 'Võ Anh Tuấn', 'tuan', 'Nam', DATE '1985-12-03', '0906101009', 'Gia Lai', '2026009', 'GV2026009', 'LUAT')
)
INSERT INTO Persons (PersonId, FullName, FullNameNoAccent, Gender, DateOfBirth, Nationality, ContactEmail, PhoneNumber, PermanentAddress, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), s.full_name, s.full_name_no_accent, s.gender, s.dob, 'Việt Nam', s.email, s.phone, s.address, 'Giảng viên cơ hữu', TRUE, CURRENT_TIMESTAMP
FROM instructor_seed s
WHERE NOT EXISTS (SELECT 1 FROM Persons p WHERE p.ContactEmail = s.email);

WITH instructor_seed(email, employee_code, instructor_code, department_code) AS (
    VALUES
        ('quangv2026004@donga.edu.vn', '2026004', 'GV2026004', 'KTDL'),
        ('maigv2026005@donga.edu.vn', '2026005', 'GV2026005', 'QTKD'),
        ('baogv2026006@donga.edu.vn', '2026006', 'GV2026006', 'NN'),
        ('khoigv2026007@donga.edu.vn', '2026007', 'GV2026007', 'DTVT'),
        ('ngangv2026008@donga.edu.vn', '2026008', 'GV2026008', 'DLNH'),
        ('tuangv2026009@donga.edu.vn', '2026009', 'GV2026009', 'LUAT')
)
INSERT INTO Employees (EmployeeId, PersonId, EmployeeCode, StartWorkDate, Status, EmployeeType, ContractType, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, s.employee_code, DATE '2022-09-01', 'ACTIVE', 'INSTRUCTOR', 'FULL_TIME', TRUE, CURRENT_TIMESTAMP
FROM instructor_seed s
JOIN Persons p ON p.ContactEmail = s.email
WHERE NOT EXISTS (SELECT 1 FROM Employees e WHERE e.PersonId = p.PersonId OR e.EmployeeCode = s.employee_code);

WITH instructor_seed(email, instructor_code, department_code) AS (
    VALUES
        ('quangv2026004@donga.edu.vn', 'GV2026004', 'KTDL'),
        ('maigv2026005@donga.edu.vn', 'GV2026005', 'QTKD'),
        ('baogv2026006@donga.edu.vn', 'GV2026006', 'NN'),
        ('khoigv2026007@donga.edu.vn', 'GV2026007', 'DTVT'),
        ('ngangv2026008@donga.edu.vn', 'GV2026008', 'DLNH'),
        ('tuangv2026009@donga.edu.vn', 'GV2026009', 'LUAT')
)
INSERT INTO Instructors (EmployeeId, InstructorCode, DepartmentId, CreatedAt, IsActive)
SELECT e.EmployeeId, s.instructor_code, d.DepartmentId, CURRENT_TIMESTAMP, TRUE
FROM instructor_seed s
JOIN Persons p ON p.ContactEmail = s.email
JOIN Employees e ON e.PersonId = p.PersonId
JOIN Departments d ON d.Code = s.department_code
WHERE NOT EXISTS (SELECT 1 FROM Instructors i WHERE i.EmployeeId = e.EmployeeId OR i.InstructorCode = s.instructor_code);

WITH student_seed(email, full_name, full_name_no_accent, gender, dob, phone, address, student_code, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('lan102001@donga.edu.vn', 'Nguyễn Thị Lan', 'lan', 'Nữ', DATE '2006-01-08', '0910201001', 'Đà Nẵng', '102001', 'KTDL', 'KTDL01', 'K24', 'CTDT03'),
        ('minh102002@donga.edu.vn', 'Trần Quốc Minh', 'minh', 'Nam', DATE '2006-02-12', '0910201002', 'Quảng Nam', '102002', 'QTKD', 'QTKD01', 'K25', 'CTDT04'),
        ('anh102003@donga.edu.vn', 'Lê Ngọc Anh', 'anh', 'Nữ', DATE '2006-03-18', '0910201003', 'Huế', '102003', 'NN', 'NN01', 'K26', 'CTDT05'),
        ('huy102004@donga.edu.vn', 'Phạm Gia Huy', 'huy', 'Nam', DATE '2006-04-20', '0910201004', 'Đà Nẵng', '102004', 'DTVT', 'DTVT01', 'K26', 'CTDT06'),
        ('trinh102005@donga.edu.vn', 'Hoàng Bảo Trinh', 'trinh', 'Nữ', DATE '2006-05-24', '0910201005', 'Quảng Ngãi', '102005', 'DLNH', 'DLNH01', 'K26', 'CTDT07'),
        ('long102006@donga.edu.vn', 'Đặng Hải Long', 'long', 'Nam', DATE '2006-06-02', '0910201006', 'Gia Lai', '102006', 'DLNH', 'DLNH02', 'K26', 'CTDT08'),
        ('thao102007@donga.edu.vn', 'Võ Minh Thảo', 'thao', 'Nữ', DATE '2006-07-16', '0910201007', 'Đà Nẵng', '102007', 'LUAT', 'LUAT01', 'K26', 'CTDT09')
)
INSERT INTO Persons (PersonId, FullName, FullNameNoAccent, Gender, DateOfBirth, Nationality, ContactEmail, PhoneNumber, PermanentAddress, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), s.full_name, s.full_name_no_accent, s.gender, s.dob, 'Việt Nam', s.email, s.phone, s.address, 'Sinh viên chính quy', TRUE, CURRENT_TIMESTAMP
FROM student_seed s
WHERE NOT EXISTS (SELECT 1 FROM Persons p WHERE p.ContactEmail = s.email);

WITH student_seed(email, student_code, department_code, major_code, cohort_code, program_code) AS (
    VALUES
        ('lan102001@donga.edu.vn', '102001', 'KTDL', 'KTDL01', 'K24', 'CTDT03'),
        ('minh102002@donga.edu.vn', '102002', 'QTKD', 'QTKD01', 'K25', 'CTDT04'),
        ('anh102003@donga.edu.vn', '102003', 'NN', 'NN01', 'K26', 'CTDT05'),
        ('huy102004@donga.edu.vn', '102004', 'DTVT', 'DTVT01', 'K26', 'CTDT06'),
        ('trinh102005@donga.edu.vn', '102005', 'DLNH', 'DLNH01', 'K26', 'CTDT07'),
        ('long102006@donga.edu.vn', '102006', 'DLNH', 'DLNH02', 'K26', 'CTDT08'),
        ('thao102007@donga.edu.vn', '102007', 'LUAT', 'LUAT01', 'K26', 'CTDT09')
)
INSERT INTO Students (StudentId, PersonId, StudentCode, Note, DepartmentId, MajorId, AcademicCohortId, TrainingProgramId, IsActive, CreatedAt)
SELECT gen_random_uuid(), p.PersonId, s.student_code, 'Sinh viên chính quy', d.DepartmentId, m.MajorId, ac.AcademicCohortId, tp.TrainingProgramId, TRUE, CURRENT_TIMESTAMP
FROM student_seed s
JOIN Persons p ON p.ContactEmail = s.email
JOIN Departments d ON d.Code = s.department_code
JOIN Majors m ON m.Code = s.major_code
JOIN AcademicCohorts ac ON ac.Code = s.cohort_code
JOIN TrainingPrograms tp ON tp.Code = s.program_code
WHERE NOT EXISTS (SELECT 1 FROM Students st WHERE st.PersonId = p.PersonId OR st.StudentCode = s.student_code);

WITH account_seed AS (
    SELECT
        p.PersonId,
        lower(st.StudentCode) AS username,
        p.ContactEmail AS email,
        'STUDENT' AS role_code,
        p.DateOfBirth AS dob
    FROM Students st
    JOIN Persons p ON p.PersonId = st.PersonId
    WHERE st.IsActive = TRUE
      AND st.DeletedAt IS NULL
      AND p.IsActive = TRUE
      AND p.DeletedAt IS NULL
      AND p.ContactEmail IS NOT NULL

    UNION ALL

    SELECT
        p.PersonId,
        lower(i.InstructorCode) AS username,
        p.ContactEmail AS email,
        'LECTURER' AS role_code,
        p.DateOfBirth AS dob
    FROM Instructors i
    JOIN Employees e ON e.EmployeeId = i.EmployeeId
    JOIN Persons p ON p.PersonId = e.PersonId
    WHERE i.IsActive = TRUE
      AND i.DeletedAt IS NULL
      AND e.IsActive = TRUE
      AND e.DeletedAt IS NULL
      AND p.IsActive = TRUE
      AND p.DeletedAt IS NULL
      AND p.ContactEmail IS NOT NULL

    UNION ALL

    SELECT
        p.PersonId,
        lower(s.StaffCode) AS username,
        p.ContactEmail AS email,
        'STAFF' AS role_code,
        p.DateOfBirth AS dob
    FROM Staffs s
    JOIN Employees e ON e.EmployeeId = s.EmployeeId
    JOIN Persons p ON p.PersonId = e.PersonId
    WHERE s.IsActive = TRUE
      AND s.DeletedAt IS NULL
      AND e.IsActive = TRUE
      AND e.DeletedAt IS NULL
      AND p.IsActive = TRUE
      AND p.DeletedAt IS NULL
      AND p.ContactEmail IS NOT NULL
)
INSERT INTO Users (UserId, PersonId, Username, PasswordHash, Email, AccessFailedCount, LockoutEndAt, LockReason, RequirePasswordChange, EmailConfirmed, ConfirmationToken, IsActive, CreatedAt)
SELECT gen_random_uuid(), a.PersonId, a.username, crypt(to_char(COALESCE(a.dob, DATE '2000-01-01'), 'DDMMYYYY'), gen_salt('bf', 10)),
       a.email, 0, NULL, NULL, TRUE, FALSE, gen_random_uuid()::text, TRUE, CURRENT_TIMESTAMP
FROM account_seed a
WHERE NOT EXISTS (
    SELECT 1
    FROM Users u
    WHERE u.PersonId = a.PersonId
       OR u.Username = a.username
       OR u.Email = a.email
);

WITH account_seed AS (
    SELECT p.PersonId, lower(st.StudentCode) AS username, p.ContactEmail AS email, 'STUDENT' AS role_code
    FROM Students st
    JOIN Persons p ON p.PersonId = st.PersonId
    WHERE st.IsActive = TRUE AND st.DeletedAt IS NULL AND p.IsActive = TRUE AND p.DeletedAt IS NULL AND p.ContactEmail IS NOT NULL

    UNION ALL

    SELECT p.PersonId, lower(i.InstructorCode) AS username, p.ContactEmail AS email, 'LECTURER' AS role_code
    FROM Instructors i
    JOIN Employees e ON e.EmployeeId = i.EmployeeId
    JOIN Persons p ON p.PersonId = e.PersonId
    WHERE i.IsActive = TRUE AND i.DeletedAt IS NULL AND e.IsActive = TRUE AND e.DeletedAt IS NULL AND p.IsActive = TRUE AND p.DeletedAt IS NULL AND p.ContactEmail IS NOT NULL

    UNION ALL

    SELECT p.PersonId, lower(s.StaffCode) AS username, p.ContactEmail AS email, 'STAFF' AS role_code
    FROM Staffs s
    JOIN Employees e ON e.EmployeeId = s.EmployeeId
    JOIN Persons p ON p.PersonId = e.PersonId
    WHERE s.IsActive = TRUE AND s.DeletedAt IS NULL AND e.IsActive = TRUE AND e.DeletedAt IS NULL AND p.IsActive = TRUE AND p.DeletedAt IS NULL AND p.ContactEmail IS NOT NULL
)
UPDATE Users u
SET Username = a.username,
    Email = a.email,
    AccessFailedCount = 0,
    LockoutEndAt = NULL,
    LockReason = NULL,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM account_seed a
WHERE u.PersonId = a.PersonId;

WITH account_seed AS (
    SELECT p.PersonId, 'STUDENT' AS role_code
    FROM Students st
    JOIN Persons p ON p.PersonId = st.PersonId
    WHERE st.IsActive = TRUE AND st.DeletedAt IS NULL AND p.IsActive = TRUE AND p.DeletedAt IS NULL

    UNION ALL

    SELECT p.PersonId, 'LECTURER' AS role_code
    FROM Instructors i
    JOIN Employees e ON e.EmployeeId = i.EmployeeId
    JOIN Persons p ON p.PersonId = e.PersonId
    WHERE i.IsActive = TRUE AND i.DeletedAt IS NULL AND e.IsActive = TRUE AND e.DeletedAt IS NULL AND p.IsActive = TRUE AND p.DeletedAt IS NULL

    UNION ALL

    SELECT p.PersonId, 'STAFF' AS role_code
    FROM Staffs s
    JOIN Employees e ON e.EmployeeId = s.EmployeeId
    JOIN Persons p ON p.PersonId = e.PersonId
    WHERE s.IsActive = TRUE AND s.DeletedAt IS NULL AND e.IsActive = TRUE AND e.DeletedAt IS NULL AND p.IsActive = TRUE AND p.DeletedAt IS NULL
)
INSERT INTO UserRoles (UserId, RoleId, CreatedAt, IsActive)
SELECT u.UserId, r.RoleId, CURRENT_TIMESTAMP, TRUE
FROM account_seed a
JOIN Users u ON u.PersonId = a.PersonId
JOIN Roles r ON r.Code = a.role_code
ON CONFLICT (UserId, RoleId) DO UPDATE
SET IsActive = TRUE;
