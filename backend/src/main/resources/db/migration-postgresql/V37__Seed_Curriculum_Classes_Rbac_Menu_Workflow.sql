-- Seed dữ liệu nghiệp vụ đào tạo theo khoa/ngành/niên khóa và RBAC hiển thị menu theo quyền.

-- Năm học và học kỳ cho khóa 2026.
INSERT INTO SchoolYears (SchoolYearId, Code, Name, StartDate, EndDate, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.code, src.name, src.start_date, src.end_date, src.description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('2026-2027', 'Năm học 2026-2027', DATE '2026-09-01', DATE '2027-08-31', 'Năm học phục vụ khóa tuyển sinh 2026')
) AS src(code, name, start_date, end_date, description)
WHERE NOT EXISTS (SELECT 1 FROM SchoolYears sy WHERE sy.Code = src.code);

INSERT INTO Semesters (SemesterId, Code, Name, SchoolYearId, StartDate, EndDate, Status, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.code, src.name, sy.SchoolYearId, src.start_date, src.end_date, TRUE, src.description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('HK1-2026', 'Học kỳ 1 năm học 2026-2027', '2026-2027', DATE '2026-09-01', DATE '2027-01-15', 'Học kỳ 1 khóa 2026'),
    ('HK2-2026', 'Học kỳ 2 năm học 2026-2027', '2026-2027', DATE '2027-02-15', DATE '2027-06-30', 'Học kỳ 2 khóa 2026')
) AS src(code, name, school_year_code, start_date, end_date, description)
JOIN SchoolYears sy ON sy.Code = src.school_year_code
WHERE NOT EXISTS (
    SELECT 1
    FROM Semesters s
    WHERE s.Code = src.code
      AND s.SchoolYearId = sy.SchoolYearId
);

-- Bảo đảm có chương trình đào tạo theo ngành và niên khóa.
INSERT INTO TrainingPrograms (
    TrainingProgramId, Code, Name, NameEn, MajorId, DepartmentId, AcademicCohortId,
    DegreeLevel, EducationType, TotalCredits, RequiredCredits, ElectiveCredits,
    InternshipCredits, ThesisCredits, AdmissionYear, DurationYears, MaxDurationYears,
    EffectiveDate, Description, Objectives, LearningOutcomes, Version, Status, IsActive, CreatedAt
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
    5,
    5,
    make_date(ac.StartYear, 9, 1),
    4.0,
    6.0,
    make_date(ac.StartYear, 9, 1),
    src.description,
    src.objectives,
    src.learning_outcomes,
    '1.0',
    'ACTIVE',
    TRUE,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('CTDT01', 'CNTT01', 'K24', 'Chương trình Khoa học máy tính K24', 'Computer Science Program K24', 130, 100, 20, 'Chương trình đào tạo ngành Khoa học máy tính khóa 24', 'Đào tạo năng lực nền tảng CNTT, dữ liệu và hệ thống', 'Lập trình, dữ liệu, hệ thống, tư duy giải quyết vấn đề'),
    ('TP-CNTT01-K25', 'CNTT01', 'K25', 'Chương trình Khoa học máy tính K25', 'Computer Science Program K25', 130, 100, 20, 'Chương trình đào tạo ngành Khoa học máy tính khóa 25', 'Đào tạo năng lực nền tảng CNTT, dữ liệu và hệ thống', 'Lập trình, dữ liệu, hệ thống, tư duy giải quyết vấn đề'),
    ('TP-CNTT01-K26', 'CNTT01', 'K26', 'Chương trình Khoa học máy tính K26', 'Computer Science Program K26', 130, 100, 20, 'Chương trình đào tạo ngành Khoa học máy tính khóa 26', 'Đào tạo năng lực nền tảng CNTT, dữ liệu và hệ thống', 'Lập trình, dữ liệu, hệ thống, tư duy giải quyết vấn đề'),

    ('TP-CNTT02-K24', 'CNTT02', 'K24', 'Chương trình Kỹ thuật phần mềm K24', 'Software Engineering Program K24', 130, 96, 24, 'Chương trình đào tạo ngành Kỹ thuật phần mềm khóa 24', 'Đào tạo năng lực xây dựng và vận hành phần mềm', 'Phân tích, thiết kế, lập trình, kiểm thử và triển khai phần mềm'),
    ('CTDT02', 'CNTT02', 'K25', 'Chương trình Kỹ thuật phần mềm K25', 'Software Engineering Program K25', 130, 96, 24, 'Chương trình đào tạo ngành Kỹ thuật phần mềm khóa 25', 'Đào tạo năng lực xây dựng và vận hành phần mềm', 'Phân tích, thiết kế, lập trình, kiểm thử và triển khai phần mềm'),
    ('TP-CNTT02-K26', 'CNTT02', 'K26', 'Chương trình Kỹ thuật phần mềm K26', 'Software Engineering Program K26', 130, 96, 24, 'Chương trình đào tạo ngành Kỹ thuật phần mềm khóa 26', 'Đào tạo năng lực xây dựng và vận hành phần mềm', 'Phân tích, thiết kế, lập trình, kiểm thử và triển khai phần mềm'),

    ('CTDT03', 'KTDL01', 'K24', 'Chương trình Kế toán doanh nghiệp K24', 'Corporate Accounting Program K24', 125, 96, 19, 'Chương trình đào tạo ngành Kế toán doanh nghiệp khóa 24', 'Đào tạo kế toán viên có năng lực nghiệp vụ và đạo đức nghề nghiệp', 'Kế toán, kiểm toán, tài chính doanh nghiệp'),
    ('TP-KTDL01-K25', 'KTDL01', 'K25', 'Chương trình Kế toán doanh nghiệp K25', 'Corporate Accounting Program K25', 125, 96, 19, 'Chương trình đào tạo ngành Kế toán doanh nghiệp khóa 25', 'Đào tạo kế toán viên có năng lực nghiệp vụ và đạo đức nghề nghiệp', 'Kế toán, kiểm toán, tài chính doanh nghiệp'),
    ('TP-KTDL01-K26', 'KTDL01', 'K26', 'Chương trình Kế toán doanh nghiệp K26', 'Corporate Accounting Program K26', 125, 96, 19, 'Chương trình đào tạo ngành Kế toán doanh nghiệp khóa 26', 'Đào tạo kế toán viên có năng lực nghiệp vụ và đạo đức nghề nghiệp', 'Kế toán, kiểm toán, tài chính doanh nghiệp'),

    ('TP-QTKD01-K24', 'QTKD01', 'K24', 'Chương trình Quản trị kinh doanh K24', 'Business Administration Program K24', 126, 95, 21, 'Chương trình đào tạo ngành Quản trị kinh doanh khóa 24', 'Đào tạo năng lực quản trị tổ chức và doanh nghiệp', 'Quản trị, marketing, vận hành, tài chính quản trị'),
    ('CTDT04', 'QTKD01', 'K25', 'Chương trình Quản trị kinh doanh K25', 'Business Administration Program K25', 126, 95, 21, 'Chương trình đào tạo ngành Quản trị kinh doanh khóa 25', 'Đào tạo năng lực quản trị tổ chức và doanh nghiệp', 'Quản trị, marketing, vận hành, tài chính quản trị'),
    ('TP-QTKD01-K26', 'QTKD01', 'K26', 'Chương trình Quản trị kinh doanh K26', 'Business Administration Program K26', 126, 95, 21, 'Chương trình đào tạo ngành Quản trị kinh doanh khóa 26', 'Đào tạo năng lực quản trị tổ chức và doanh nghiệp', 'Quản trị, marketing, vận hành, tài chính quản trị'),

    ('TP-NN01-K24', 'NN01', 'K24', 'Chương trình Ngôn ngữ Anh K24', 'English Language Program K24', 125, 96, 19, 'Chương trình đào tạo ngành Ngôn ngữ Anh khóa 24', 'Đào tạo năng lực ngôn ngữ, giao tiếp và biên phiên dịch', 'Tiếng Anh, giao tiếp, biên phiên dịch, văn hóa'),
    ('TP-NN01-K25', 'NN01', 'K25', 'Chương trình Ngôn ngữ Anh K25', 'English Language Program K25', 125, 96, 19, 'Chương trình đào tạo ngành Ngôn ngữ Anh khóa 25', 'Đào tạo năng lực ngôn ngữ, giao tiếp và biên phiên dịch', 'Tiếng Anh, giao tiếp, biên phiên dịch, văn hóa'),
    ('CTDT05', 'NN01', 'K26', 'Chương trình Ngôn ngữ Anh K26', 'English Language Program K26', 125, 96, 19, 'Chương trình đào tạo ngành Ngôn ngữ Anh khóa 26', 'Đào tạo năng lực ngôn ngữ, giao tiếp và biên phiên dịch', 'Tiếng Anh, giao tiếp, biên phiên dịch, văn hóa'),

    ('CTDT06', 'DTVT01', 'K26', 'Chương trình Điện tử - Viễn thông K26', 'Electronics and Telecommunications Program K26', 132, 102, 20, 'Chương trình đào tạo ngành Điện tử - Viễn thông khóa 26', 'Đào tạo năng lực thiết kế, vận hành hệ thống điện tử và truyền thông', 'Mạch điện tử, viễn thông, IoT, hệ thống nhúng'),
    ('CTDT07', 'DLNH01', 'K26', 'Chương trình Du lịch lữ hành K26', 'Tourism and Travel Management Program K26', 126, 95, 21, 'Chương trình đào tạo ngành Du lịch lữ hành khóa 26', 'Đào tạo năng lực điều hành dịch vụ du lịch', 'Điều hành tour, điểm đến, dịch vụ khách hàng'),
    ('CTDT08', 'DLNH02', 'K26', 'Chương trình Quản trị khách sạn K26', 'Hotel Management Program K26', 126, 95, 21, 'Chương trình đào tạo ngành Quản trị khách sạn khóa 26', 'Đào tạo năng lực vận hành dịch vụ khách sạn', 'Lễ tân, buồng phòng, F&B, quản trị dịch vụ'),
    ('CTDT09', 'LUAT01', 'K26', 'Chương trình Luật kinh tế K26', 'Economic Law Program K26', 125, 96, 19, 'Chương trình đào tạo ngành Luật kinh tế khóa 26', 'Đào tạo năng lực pháp lý phục vụ doanh nghiệp', 'Pháp luật kinh doanh, hợp đồng, tuân thủ pháp lý')
) AS src(code, major_code, cohort_code, name, name_en, total_credits, required_credits, elective_credits, description, objectives, learning_outcomes)
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
    Description = EXCLUDED.Description,
    Objectives = EXCLUDED.Objectives,
    LearningOutcomes = EXCLUDED.LearningOutcomes,
    Status = 'ACTIVE',
    IsActive = TRUE,
    UpdatedAt = CURRENT_TIMESTAMP;

-- Môn học: môn cơ sở theo khoa và môn chuyên sâu theo ngành.
INSERT INTO Courses (CourseId, DepartmentId, Code, Name, NameEn, CourseType, Credits, TheoryHours, PracticeHours, SelfStudyHours, Description, IsActive, CreatedAt)
SELECT gen_random_uuid(), d.DepartmentId, src.code, src.name, src.name_en, src.course_type,
       src.credits, src.theory_hours, src.practice_hours, src.self_study_hours, src.description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('CNTT101', 'CNTT', 'Toán rời rạc', 'Discrete Mathematics', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa CNTT'),
    ('CNTT102', 'CNTT', 'Cơ sở lập trình', 'Programming Fundamentals', 'CO_SO_KHOA', 3.0, 30.0, 15.0, 45.0, 'Môn cơ sở khoa CNTT'),
    ('CNTT103', 'CNTT', 'Cấu trúc dữ liệu', 'Data Structures', 'CO_SO_KHOA', 3.0, 30.0, 15.0, 45.0, 'Môn cơ sở khoa CNTT'),
    ('CNTT104', 'CNTT', 'Cơ sở dữ liệu', 'Database Systems', 'CO_SO_KHOA', 3.0, 30.0, 15.0, 45.0, 'Môn cơ sở khoa CNTT'),
    ('SE301', 'CNTT', 'Phân tích thiết kế phần mềm', 'Software Analysis and Design', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Kỹ thuật phần mềm'),
    ('SE302', 'CNTT', 'Kiểm thử phần mềm', 'Software Testing', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Kỹ thuật phần mềm'),
    ('CS301', 'CNTT', 'Trí tuệ nhân tạo', 'Artificial Intelligence', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Khoa học máy tính'),
    ('CS302', 'CNTT', 'Khai phá dữ liệu', 'Data Mining', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Khoa học máy tính'),

    ('KTDL101', 'KTDL', 'Nguyên lý kế toán', 'Accounting Principles', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Kế toán - Tài chính'),
    ('KTDL102', 'KTDL', 'Tài chính doanh nghiệp', 'Corporate Finance', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Kế toán - Tài chính'),
    ('ACC301', 'KTDL', 'Kế toán tài chính', 'Financial Accounting', 'CHUYEN_SAU_NGANH', 3.0, 45.0, 0.0, 45.0, 'Môn chuyên sâu ngành Kế toán doanh nghiệp'),
    ('ACC302', 'KTDL', 'Kiểm toán căn bản', 'Auditing Fundamentals', 'CHUYEN_SAU_NGANH', 3.0, 45.0, 0.0, 45.0, 'Môn chuyên sâu ngành Kế toán doanh nghiệp'),

    ('QTKD101A', 'QTKD', 'Quản trị học', 'Management Principles', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Quản trị kinh doanh'),
    ('QTKD102', 'QTKD', 'Marketing căn bản', 'Marketing Principles', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Quản trị kinh doanh'),
    ('BUS301', 'QTKD', 'Quản trị chiến lược', 'Strategic Management', 'CHUYEN_SAU_NGANH', 3.0, 45.0, 0.0, 45.0, 'Môn chuyên sâu ngành Quản trị kinh doanh'),
    ('BUS302', 'QTKD', 'Quản trị vận hành', 'Operations Management', 'CHUYEN_SAU_NGANH', 3.0, 45.0, 0.0, 45.0, 'Môn chuyên sâu ngành Quản trị kinh doanh'),

    ('NN101A', 'NN', 'Ngữ âm tiếng Anh', 'English Phonetics', 'CO_SO_KHOA', 2.0, 20.0, 10.0, 30.0, 'Môn cơ sở khoa Ngoại ngữ'),
    ('NN102', 'NN', 'Ngữ pháp tiếng Anh', 'English Grammar', 'CO_SO_KHOA', 3.0, 30.0, 15.0, 45.0, 'Môn cơ sở khoa Ngoại ngữ'),
    ('ENG301', 'NN', 'Biên dịch Anh - Việt', 'English Vietnamese Translation', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Ngôn ngữ Anh'),
    ('ENG302', 'NN', 'Phiên dịch thương mại', 'Business Interpretation', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Ngôn ngữ Anh'),

    ('DTVT101', 'DTVT', 'Mạch điện', 'Electric Circuits', 'CO_SO_KHOA', 3.0, 30.0, 15.0, 45.0, 'Môn cơ sở khoa Điện tử - Viễn thông'),
    ('DTVT102', 'DTVT', 'Điện tử cơ bản', 'Basic Electronics', 'CO_SO_KHOA', 3.0, 30.0, 15.0, 45.0, 'Môn cơ sở khoa Điện tử - Viễn thông'),
    ('TEL301', 'DTVT', 'Truyền thông số', 'Digital Communications', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Điện tử - Viễn thông'),
    ('TEL302', 'DTVT', 'Internet vạn vật', 'Internet of Things', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Điện tử - Viễn thông'),

    ('DLNH101', 'DLNH', 'Tổng quan du lịch', 'Introduction to Tourism', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Du lịch - Nhà hàng - Khách sạn'),
    ('DLNH102', 'DLNH', 'Kỹ năng dịch vụ khách hàng', 'Customer Service Skills', 'CO_SO_KHOA', 2.0, 15.0, 15.0, 30.0, 'Môn cơ sở khoa Du lịch - Nhà hàng - Khách sạn'),
    ('TOUR301', 'DLNH', 'Điều hành tour', 'Tour Operations', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Du lịch lữ hành'),
    ('HOTEL301', 'DLNH', 'Quản trị buồng phòng', 'Housekeeping Management', 'CHUYEN_SAU_NGANH', 3.0, 30.0, 15.0, 45.0, 'Môn chuyên sâu ngành Quản trị khách sạn'),

    ('LUAT101', 'LUAT', 'Nhập môn pháp luật', 'Introduction to Law', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Luật'),
    ('LUAT102', 'LUAT', 'Luật dân sự', 'Civil Law', 'CO_SO_KHOA', 3.0, 45.0, 0.0, 45.0, 'Môn cơ sở khoa Luật'),
    ('LAW301', 'LUAT', 'Luật doanh nghiệp', 'Enterprise Law', 'CHUYEN_SAU_NGANH', 3.0, 45.0, 0.0, 45.0, 'Môn chuyên sâu ngành Luật kinh tế'),
    ('LAW302', 'LUAT', 'Pháp luật hợp đồng', 'Contract Law', 'CHUYEN_SAU_NGANH', 3.0, 45.0, 0.0, 45.0, 'Môn chuyên sâu ngành Luật kinh tế')
) AS src(code, department_code, name, name_en, course_type, credits, theory_hours, practice_hours, self_study_hours, description)
JOIN Departments d ON d.Code = src.department_code
ON CONFLICT (Code) DO UPDATE
SET DepartmentId = EXCLUDED.DepartmentId,
    Name = EXCLUDED.Name,
    NameEn = EXCLUDED.NameEn,
    CourseType = EXCLUDED.CourseType,
    Credits = EXCLUDED.Credits,
    TheoryHours = EXCLUDED.TheoryHours,
    PracticeHours = EXCLUDED.PracticeHours,
    SelfStudyHours = EXCLUDED.SelfStudyHours,
    Description = EXCLUDED.Description,
    IsActive = TRUE,
    UpdatedAt = CURRENT_TIMESTAMP;

-- Gắn môn vào chương trình: môn cơ sở dùng chung trong khoa, môn chuyên sâu theo từng ngành.
WITH program_courses AS (
    SELECT tp.TrainingProgramId, c.CourseId,
           CASE c.Code
               WHEN 'CNTT101' THEN 'HK1'
               WHEN 'CNTT102' THEN 'HK1'
               WHEN 'CNTT103' THEN 'HK2'
               WHEN 'CNTT104' THEN 'HK2'
               WHEN 'KTDL101' THEN 'HK1'
               WHEN 'KTDL102' THEN 'HK2'
               WHEN 'QTKD101A' THEN 'HK1'
               WHEN 'QTKD102' THEN 'HK2'
               WHEN 'NN101A' THEN 'HK1'
               WHEN 'NN102' THEN 'HK2'
               WHEN 'DTVT101' THEN 'HK1'
               WHEN 'DTVT102' THEN 'HK2'
               WHEN 'DLNH101' THEN 'HK1'
               WHEN 'DLNH102' THEN 'HK2'
               WHEN 'LUAT101' THEN 'HK1'
               WHEN 'LUAT102' THEN 'HK2'
               ELSE 'HK1'
           END AS semester_phase,
           TRUE AS is_required,
           c.CourseType AS group_code,
           c.Credits,
           CASE c.CourseType WHEN 'CO_SO_KHOA' THEN 10 ELSE 30 END AS sort_base
    FROM TrainingPrograms tp
    JOIN Courses c ON c.DepartmentId = tp.DepartmentId
    WHERE c.CourseType = 'CO_SO_KHOA'

    UNION ALL

    SELECT tp.TrainingProgramId, c.CourseId, 'HK1', TRUE, c.CourseType, c.Credits, 30
    FROM TrainingPrograms tp
    JOIN Majors m ON m.MajorId = tp.MajorId
    JOIN Courses c ON c.DepartmentId = tp.DepartmentId
    WHERE c.CourseType = 'CHUYEN_SAU_NGANH'
      AND (
          (m.Code = 'CNTT02' AND c.Code IN ('SE301', 'SE302'))
          OR (m.Code = 'CNTT01' AND c.Code IN ('CS301', 'CS302'))
          OR (m.Code = 'KTDL01' AND c.Code IN ('ACC301', 'ACC302'))
          OR (m.Code = 'QTKD01' AND c.Code IN ('BUS301', 'BUS302'))
          OR (m.Code = 'NN01' AND c.Code IN ('ENG301', 'ENG302'))
          OR (m.Code = 'DTVT01' AND c.Code IN ('TEL301', 'TEL302'))
          OR (m.Code = 'DLNH01' AND c.Code IN ('TOUR301'))
          OR (m.Code = 'DLNH02' AND c.Code IN ('HOTEL301'))
          OR (m.Code = 'LUAT01' AND c.Code IN ('LAW301', 'LAW302'))
      )
)
INSERT INTO TrainingProgramCourses (
    TrainingProgramId, CourseId, SemesterId, IsRequired, GroupCode, Credits,
    IsPrerequisiteRequired, Note, SortOrder, Status, IsActive, CreatedAt
)
SELECT pc.TrainingProgramId,
       pc.CourseId,
       s.SemesterId,
       pc.is_required,
       pc.group_code,
       pc.Credits,
       FALSE,
       CASE pc.group_code
           WHEN 'CO_SO_KHOA' THEN 'Môn cơ sở dùng chung theo khoa'
           ELSE 'Môn chuyên sâu theo ngành'
       END,
       pc.sort_base + row_number() OVER (PARTITION BY pc.TrainingProgramId, pc.group_code ORDER BY c.Code),
       'ACTIVE',
       TRUE,
       CURRENT_TIMESTAMP
FROM program_courses pc
JOIN TrainingPrograms tp ON tp.TrainingProgramId = pc.TrainingProgramId
JOIN AcademicCohorts ac ON ac.AcademicCohortId = tp.AcademicCohortId
JOIN Courses c ON c.CourseId = pc.CourseId
LEFT JOIN Semesters s ON s.Code = CASE
    WHEN pc.semester_phase = 'HK2' THEN 'HK2-' || ac.StartYear::text
    ELSE 'HK1-' || ac.StartYear::text
END
ON CONFLICT (TrainingProgramId, CourseId) DO UPDATE
SET SemesterId = EXCLUDED.SemesterId,
    IsRequired = EXCLUDED.IsRequired,
    GroupCode = EXCLUDED.GroupCode,
    Credits = EXCLUDED.Credits,
    Note = EXCLUDED.Note,
    SortOrder = EXCLUDED.SortOrder,
    Status = 'ACTIVE',
    IsActive = TRUE,
    UpdatedAt = CURRENT_TIMESTAMP;

-- Lớp hành chính theo khoa và niên khóa. Mỗi lớp cố gắng lấy một cố vấn chưa được gán lớp.
WITH class_seed(class_code, class_name, department_code, cohort_code, max_size, note) AS (
    VALUES
        ('CNTT-K26-01', 'Lớp Công nghệ thông tin khóa 26 - 01', 'CNTT', 'K26', 45, 'Lớp hành chính khoa CNTT khóa 26'),
        ('KTDL-K26-01', 'Lớp Kế toán - Tài chính khóa 26 - 01', 'KTDL', 'K26', 40, 'Lớp hành chính khoa Kế toán - Tài chính khóa 26'),
        ('QTKD-K26-01', 'Lớp Quản trị kinh doanh khóa 26 - 01', 'QTKD', 'K26', 40, 'Lớp hành chính khoa Quản trị kinh doanh khóa 26'),
        ('NN-K26-01', 'Lớp Ngoại ngữ khóa 26 - 01', 'NN', 'K26', 35, 'Lớp hành chính khoa Ngoại ngữ khóa 26'),
        ('DTVT-K26-01', 'Lớp Điện tử - Viễn thông khóa 26 - 01', 'DTVT', 'K26', 40, 'Lớp hành chính khoa Điện tử - Viễn thông khóa 26'),
        ('DLNH-K26-01', 'Lớp Du lịch - Nhà hàng - Khách sạn khóa 26 - 01', 'DLNH', 'K26', 40, 'Lớp hành chính khoa Du lịch - Nhà hàng - Khách sạn khóa 26'),
        ('LUAT-K26-01', 'Lớp Luật khóa 26 - 01', 'LUAT', 'K26', 40, 'Lớp hành chính khoa Luật khóa 26')
)
INSERT INTO Classes (ClassId, ClassCode, ClassName, DepartmentId, AdvisorId, AcademicCohortId, MaxSize, Status, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.class_code, src.class_name, d.DepartmentId, advisor.EmployeeId, ac.AcademicCohortId,
       src.max_size, 1, src.note, TRUE, CURRENT_TIMESTAMP
FROM class_seed src
JOIN Departments d ON d.Code = src.department_code
JOIN AcademicCohorts ac ON ac.Code = src.cohort_code
LEFT JOIN LATERAL (
    SELECT i.EmployeeId
    FROM Instructors i
    WHERE i.DepartmentId = d.DepartmentId
      AND i.IsActive = TRUE
      AND i.DeletedAt IS NULL
      AND NOT EXISTS (
          SELECT 1
          FROM Classes assigned
          WHERE assigned.AdvisorId = i.EmployeeId
            AND assigned.DeletedAt IS NULL
      )
    ORDER BY i.InstructorCode
    LIMIT 1
) advisor ON TRUE
ON CONFLICT (ClassCode) DO UPDATE
SET ClassName = EXCLUDED.ClassName,
    DepartmentId = EXCLUDED.DepartmentId,
    AcademicCohortId = EXCLUDED.AcademicCohortId,
    MaxSize = EXCLUDED.MaxSize,
    Status = 1,
    Note = EXCLUDED.Note,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

-- Gán sinh viên K26 vào lớp hành chính theo khoa và kỳ đầu của khóa.
INSERT INTO StudentClasses (StudentClassId, StudentId, ClassId, SemesterId, RoleInClass, Status, Note, IsActive, CreatedAt)
SELECT gen_random_uuid(), st.StudentId, cl.ClassId, sem.SemesterId, 'Sinh viên', 'Đang học',
       'Phân lớp hành chính theo khoa và niên khóa', TRUE, CURRENT_TIMESTAMP
FROM Students st
JOIN Classes cl ON cl.DepartmentId = st.DepartmentId
JOIN AcademicCohorts ac ON ac.AcademicCohortId = st.AcademicCohortId AND ac.AcademicCohortId = cl.AcademicCohortId
JOIN Semesters sem ON sem.Code = 'HK1-' || ac.StartYear::text
WHERE st.IsActive = TRUE
  AND st.DeletedAt IS NULL
  AND ac.Code = 'K26'
  AND cl.IsActive = TRUE
  AND cl.DeletedAt IS NULL
ON CONFLICT (StudentId, ClassId, SemesterId) DO UPDATE
SET Status = 'Đang học',
    Note = EXCLUDED.Note,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

UPDATE Students st
SET ClassId = cl.ClassId,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Classes cl
JOIN AcademicCohorts ac ON ac.AcademicCohortId = cl.AcademicCohortId
WHERE st.DepartmentId = cl.DepartmentId
  AND st.AcademicCohortId = cl.AcademicCohortId
  AND ac.Code = 'K26'
  AND st.IsActive = TRUE
  AND st.DeletedAt IS NULL
  AND cl.IsActive = TRUE
  AND cl.DeletedAt IS NULL;

-- RBAC: quyền API, quyền theo vai trò và menu hiển thị theo quyền.
INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
VALUES
    (gen_random_uuid(), 'DEPARTMENT_VIEW', 'Xem khoa', 'Xem danh sách và chi tiết khoa', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'DEPARTMENT_CREATE', 'Tạo khoa', 'Tạo khoa', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'DEPARTMENT_EDIT', 'Sửa khoa', 'Cập nhật khoa', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'DEPARTMENT_DELETE', 'Xóa khoa', 'Xóa mềm khoa', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'MAJOR_VIEW', 'Xem ngành', 'Xem danh sách và chi tiết ngành', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'MAJOR_CREATE', 'Tạo ngành', 'Tạo ngành', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'MAJOR_EDIT', 'Sửa ngành', 'Cập nhật ngành', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'MAJOR_DELETE', 'Xóa ngành', 'Xóa mềm ngành', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ACADEMIC_COHORT_VIEW', 'Xem niên khóa', 'Xem niên khóa đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ACADEMIC_COHORT_CREATE', 'Tạo niên khóa', 'Tạo niên khóa đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ACADEMIC_COHORT_EDIT', 'Sửa niên khóa', 'Cập nhật niên khóa đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ACADEMIC_COHORT_DELETE', 'Xóa niên khóa', 'Xóa mềm niên khóa đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SCHOOL_YEAR_VIEW', 'Xem năm học', 'Xem năm học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SCHOOL_YEAR_CREATE', 'Tạo năm học', 'Tạo năm học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SCHOOL_YEAR_EDIT', 'Sửa năm học', 'Cập nhật năm học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SCHOOL_YEAR_DELETE', 'Xóa năm học', 'Xóa mềm năm học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SEMESTER_VIEW', 'Xem học kỳ', 'Xem học kỳ', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SEMESTER_CREATE', 'Tạo học kỳ', 'Tạo học kỳ', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SEMESTER_EDIT', 'Sửa học kỳ', 'Cập nhật học kỳ', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'SEMESTER_DELETE', 'Xóa học kỳ', 'Xóa mềm học kỳ', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'TRAINING_PROGRAM_VIEW', 'Xem chương trình đào tạo', 'Xem chương trình đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'TRAINING_PROGRAM_CREATE', 'Tạo chương trình đào tạo', 'Tạo chương trình đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'TRAINING_PROGRAM_EDIT', 'Sửa chương trình đào tạo', 'Cập nhật chương trình đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'TRAINING_PROGRAM_DELETE', 'Xóa chương trình đào tạo', 'Xóa mềm chương trình đào tạo', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_VIEW', 'Xem môn học', 'Xem môn học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_CREATE', 'Tạo môn học', 'Tạo môn học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_EDIT', 'Sửa môn học', 'Cập nhật môn học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_DELETE', 'Xóa môn học', 'Xóa mềm môn học', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_CLASS_VIEW', 'Xem lớp học phần', 'Xem lớp học phần', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_CLASS_CREATE', 'Tạo lớp học phần', 'Tạo lớp học phần', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_CLASS_EDIT', 'Sửa lớp học phần', 'Cập nhật lớp học phần', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'COURSE_CLASS_DELETE', 'Xóa lớp học phần', 'Xóa mềm lớp học phần', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ADMIN_CLASS_VIEW', 'Xem lớp hành chính', 'Xem lớp hành chính', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ADMIN_CLASS_CREATE', 'Tạo lớp hành chính', 'Tạo lớp hành chính', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ADMIN_CLASS_EDIT', 'Sửa lớp hành chính', 'Cập nhật lớp hành chính', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ADMIN_CLASS_DELETE', 'Xóa lớp hành chính', 'Xóa mềm lớp hành chính', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'STUDENT_CLASS_VIEW', 'Xem phân lớp sinh viên', 'Xem sinh viên trong lớp hành chính', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'STUDENT_CLASS_CREATE', 'Gán sinh viên vào lớp', 'Gán sinh viên vào lớp hành chính', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'STUDENT_CLASS_EDIT', 'Sửa phân lớp sinh viên', 'Cập nhật phân lớp sinh viên', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'STUDENT_CLASS_DELETE', 'Xóa phân lớp sinh viên', 'Xóa mềm phân lớp sinh viên', 'ACADEMIC', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    Description = EXCLUDED.Description,
    Module = EXCLUDED.Module,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.api_path, src.http_method, src.description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('DEPARTMENT_VIEW', '/api/v1/departments/admin/**', 'GET', 'Xem khoa'),
    ('DEPARTMENT_CREATE', '/api/v1/departments/admin', 'POST', 'Tạo khoa'),
    ('DEPARTMENT_EDIT', '/api/v1/departments/admin/**', 'PUT', 'Sửa khoa'),
    ('DEPARTMENT_DELETE', '/api/v1/departments/admin/**', 'DELETE', 'Xóa khoa'),
    ('MAJOR_VIEW', '/api/v1/majors/admin/**', 'GET', 'Xem ngành'),
    ('MAJOR_CREATE', '/api/v1/majors/admin', 'POST', 'Tạo ngành'),
    ('MAJOR_EDIT', '/api/v1/majors/admin/**', 'PUT', 'Sửa ngành'),
    ('MAJOR_DELETE', '/api/v1/majors/admin/**', 'DELETE', 'Xóa ngành'),
    ('ACADEMIC_COHORT_VIEW', '/api/v1/academic-cohorts/admin/**', 'GET', 'Xem niên khóa'),
    ('ACADEMIC_COHORT_CREATE', '/api/v1/academic-cohorts/admin', 'POST', 'Tạo niên khóa'),
    ('ACADEMIC_COHORT_EDIT', '/api/v1/academic-cohorts/admin/**', 'PUT', 'Sửa niên khóa'),
    ('ACADEMIC_COHORT_DELETE', '/api/v1/academic-cohorts/admin/**', 'DELETE', 'Xóa niên khóa'),
    ('SCHOOL_YEAR_VIEW', '/api/v1/school-years/admin/**', 'GET', 'Xem năm học'),
    ('SCHOOL_YEAR_CREATE', '/api/v1/school-years/admin', 'POST', 'Tạo năm học'),
    ('SCHOOL_YEAR_EDIT', '/api/v1/school-years/admin/**', 'PUT', 'Sửa năm học'),
    ('SCHOOL_YEAR_DELETE', '/api/v1/school-years/admin/**', 'DELETE', 'Xóa năm học'),
    ('SEMESTER_VIEW', '/api/v1/semesters/admin/**', 'GET', 'Xem học kỳ'),
    ('SEMESTER_CREATE', '/api/v1/semesters/admin', 'POST', 'Tạo học kỳ'),
    ('SEMESTER_EDIT', '/api/v1/semesters/admin/**', 'PUT', 'Sửa học kỳ'),
    ('SEMESTER_DELETE', '/api/v1/semesters/admin/**', 'DELETE', 'Xóa học kỳ'),
    ('TRAINING_PROGRAM_VIEW', '/api/v1/training-programs/admin/**', 'GET', 'Xem chương trình đào tạo'),
    ('TRAINING_PROGRAM_CREATE', '/api/v1/training-programs/admin', 'POST', 'Tạo chương trình đào tạo'),
    ('TRAINING_PROGRAM_EDIT', '/api/v1/training-programs/admin/**', 'PUT', 'Sửa chương trình đào tạo'),
    ('TRAINING_PROGRAM_DELETE', '/api/v1/training-programs/admin/**', 'DELETE', 'Xóa chương trình đào tạo'),
    ('COURSE_VIEW', '/api/v1/courses/**', 'GET', 'Xem môn học'),
    ('COURSE_CREATE', '/api/v1/courses', 'POST', 'Tạo môn học'),
    ('COURSE_EDIT', '/api/v1/courses/**', 'PUT', 'Sửa môn học'),
    ('COURSE_DELETE', '/api/v1/courses/**', 'DELETE', 'Xóa môn học'),
    ('COURSE_CLASS_VIEW', '/api/v1/courses/classes/**', 'GET', 'Xem lớp học phần'),
    ('COURSE_CLASS_CREATE', '/api/v1/courses/classes', 'POST', 'Tạo lớp học phần'),
    ('COURSE_CLASS_EDIT', '/api/v1/courses/classes/**', 'PUT', 'Sửa lớp học phần'),
    ('COURSE_CLASS_DELETE', '/api/v1/courses/classes/**', 'DELETE', 'Xóa lớp học phần'),
    ('ADMIN_CLASS_VIEW', '/api/v1/classes/admin/**', 'GET', 'Xem lớp hành chính'),
    ('ADMIN_CLASS_CREATE', '/api/v1/classes/admin', 'POST', 'Tạo lớp hành chính'),
    ('ADMIN_CLASS_EDIT', '/api/v1/classes/admin/**', 'PUT', 'Sửa lớp hành chính'),
    ('ADMIN_CLASS_DELETE', '/api/v1/classes/admin/**', 'DELETE', 'Xóa lớp hành chính'),
    ('STUDENT_CLASS_VIEW', '/api/v1/student-classes/admin/**', 'GET', 'Xem phân lớp sinh viên'),
    ('STUDENT_CLASS_CREATE', '/api/v1/student-classes/admin', 'POST', 'Gán sinh viên vào lớp'),
    ('STUDENT_CLASS_EDIT', '/api/v1/student-classes/admin/**', 'PUT', 'Sửa phân lớp sinh viên'),
    ('STUDENT_CLASS_DELETE', '/api/v1/student-classes/admin/**', 'DELETE', 'Xóa phân lớp sinh viên')
) AS src(permission_code, api_path, http_method, description)
JOIN Permissions p ON p.Code = src.permission_code
ON CONFLICT (PermissionId, ApiPath, HttpMethod) DO UPDATE
SET Description = EXCLUDED.Description,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

-- Admin/Super admin toàn quyền. Staff phòng ban được xem nhóm học vụ để sidebar hiển thị đúng theo quyền.
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'DEPARTMENT_VIEW', 'MAJOR_VIEW', 'ACADEMIC_COHORT_VIEW', 'SCHOOL_YEAR_VIEW', 'SEMESTER_VIEW',
    'TRAINING_PROGRAM_VIEW', 'COURSE_VIEW', 'COURSE_CLASS_VIEW', 'ADMIN_CLASS_VIEW', 'STUDENT_CLASS_VIEW'
)
WHERE r.Code = 'STAFF'
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE;

-- Menu gốc.
INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.title, NULL, src.icon, src.order_index, 0, NULL, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('Đào tạo', 'graduation-cap', 120),
    ('Học vụ', 'book-open', 130)
) AS src(title, icon, order_index)
WHERE NOT EXISTS (
    SELECT 1
    FROM Menus m
    WHERE m.MenuTitle = src.title
      AND m.ParentId IS NULL
      AND m.DeletedAt IS NULL
);

WITH menu_seed(title, url, icon, order_index, parent_title, permission_code) AS (
    VALUES
        ('Khoa', '/dashboard/admin/departments', 'building-2', 121, 'Đào tạo', 'DEPARTMENT_VIEW'),
        ('Ngành', '/dashboard/admin/majors', 'layers', 122, 'Đào tạo', 'MAJOR_VIEW'),
        ('Niên khóa đào tạo', '/dashboard/admin/academic-cohorts', 'calendar-range', 123, 'Đào tạo', 'ACADEMIC_COHORT_VIEW'),
        ('Năm học', '/dashboard/admin/school-years', 'calendar-days', 124, 'Đào tạo', 'SCHOOL_YEAR_VIEW'),
        ('Học kỳ', '/dashboard/admin/semesters', 'calendar-clock', 125, 'Đào tạo', 'SEMESTER_VIEW'),
        ('Chương trình đào tạo', '/dashboard/admin/training-programs', 'book-marked', 126, 'Đào tạo', 'TRAINING_PROGRAM_VIEW'),
        ('Môn học', '/dashboard/admin/courses', 'library-big', 127, 'Đào tạo', 'COURSE_VIEW'),
        ('Lớp học phần', '/dashboard/admin/course-classes', 'presentation', 131, 'Học vụ', 'COURSE_CLASS_VIEW'),
        ('Lớp hành chính', '/dashboard/admin/classes', 'users-round', 132, 'Học vụ', 'ADMIN_CLASS_VIEW'),
        ('Phân lớp sinh viên', '/dashboard/admin/student-class-assignments', 'user-plus', 133, 'Học vụ', 'STUDENT_CLASS_VIEW')
)
INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), parent.MenuId, src.title, src.url, src.icon, src.order_index, 1, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM menu_seed src
JOIN Menus parent ON parent.MenuTitle = src.parent_title AND parent.ParentId IS NULL AND parent.DeletedAt IS NULL
JOIN Permissions p ON p.Code = src.permission_code
WHERE NOT EXISTS (
    SELECT 1
    FROM Menus m
    WHERE m.MenuUrl = src.url
      AND m.DeletedAt IS NULL
);

WITH menu_seed(title, url, icon, order_index, parent_title, permission_code) AS (
    VALUES
        ('Khoa', '/dashboard/admin/departments', 'building-2', 121, 'Đào tạo', 'DEPARTMENT_VIEW'),
        ('Ngành', '/dashboard/admin/majors', 'layers', 122, 'Đào tạo', 'MAJOR_VIEW'),
        ('Niên khóa đào tạo', '/dashboard/admin/academic-cohorts', 'calendar-range', 123, 'Đào tạo', 'ACADEMIC_COHORT_VIEW'),
        ('Năm học', '/dashboard/admin/school-years', 'calendar-days', 124, 'Đào tạo', 'SCHOOL_YEAR_VIEW'),
        ('Học kỳ', '/dashboard/admin/semesters', 'calendar-clock', 125, 'Đào tạo', 'SEMESTER_VIEW'),
        ('Chương trình đào tạo', '/dashboard/admin/training-programs', 'book-marked', 126, 'Đào tạo', 'TRAINING_PROGRAM_VIEW'),
        ('Môn học', '/dashboard/admin/courses', 'library-big', 127, 'Đào tạo', 'COURSE_VIEW'),
        ('Lớp học phần', '/dashboard/admin/course-classes', 'presentation', 131, 'Học vụ', 'COURSE_CLASS_VIEW'),
        ('Lớp hành chính', '/dashboard/admin/classes', 'users-round', 132, 'Học vụ', 'ADMIN_CLASS_VIEW'),
        ('Phân lớp sinh viên', '/dashboard/admin/student-class-assignments', 'user-plus', 133, 'Học vụ', 'STUDENT_CLASS_VIEW')
)
UPDATE Menus m
SET MenuTitle = src.title,
    ParentId = parent.MenuId,
    MenuIcon = src.icon,
    OrderIndex = src.order_index,
    MenuType = 1,
    PermissionId = p.PermissionId,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM menu_seed src
JOIN Menus parent ON parent.MenuTitle = src.parent_title AND parent.ParentId IS NULL AND parent.DeletedAt IS NULL
JOIN Permissions p ON p.Code = src.permission_code
WHERE m.MenuUrl = src.url;
