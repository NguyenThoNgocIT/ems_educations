-- Dữ liệu mẫu sạch cho workflow:
-- CTĐT -> môn học -> lớp học phần -> phân công giảng viên -> sinh viên đăng ký -> tự động xếp lịch gốc.
-- Migration idempotent: chạy lại không tạo trùng dữ liệu nghiệp vụ.

UPDATE TrainingProgramCourses tpc
SET CoursePhase = CASE
        WHEN UPPER(COALESCE(tpc.GroupCode, c.CourseType, '')) = 'CO_SO_KHOA' THEN 'FOUNDATION'
        WHEN UPPER(COALESCE(tpc.GroupCode, c.CourseType, '')) = 'CHUYEN_SAU_NGANH' THEN 'SPECIALIZED'
        ELSE COALESCE(tpc.CoursePhase, 'FOUNDATION')
    END,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Courses c
WHERE c.CourseId = tpc.CourseId
  AND (tpc.CoursePhase IS NULL OR tpc.CoursePhase = '');

INSERT INTO TimeSlots (TimeSlotId, SlotCode, StartTime, EndTime, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.slot_code, src.start_time, src.end_time, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('T1-3', '07:00'::time, '09:25'::time),
    ('T4-6', '09:35'::time, '12:00'::time),
    ('T7-9', '13:00'::time, '15:25'::time),
    ('T10-12', '15:35'::time, '18:00'::time)
) AS src(slot_code, start_time, end_time)
ON CONFLICT (SlotCode) DO UPDATE
SET StartTime = EXCLUDED.StartTime,
    EndTime = EXCLUDED.EndTime,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO RegistrationPeriods (
    RegistrationPeriodId, Code, Name, SemesterId, StartDate, EndDate,
    Status, MinCredits, MaxCredits, AllowRetake, Description, IsActive, CreatedAt
)
SELECT gen_random_uuid(), 'ADMIN-HK1-2026', 'Đợt gán học phần mặc định HK1 2026', s.SemesterId,
       s.StartDate::timestamp, s.EndDate::timestamp + INTERVAL '23 hours 59 minutes 59 seconds',
       1, 0, 30, FALSE, 'Đợt nội bộ để admin gán sinh viên vào lớp học phần mẫu', TRUE, CURRENT_TIMESTAMP
FROM Semesters s
WHERE s.Code = 'HK1-2026'
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    SemesterId = EXCLUDED.SemesterId,
    StartDate = EXCLUDED.StartDate,
    EndDate = EXCLUDED.EndDate,
    Status = 1,
    AllowRetake = FALSE,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

WITH course_class_seed(class_code, course_code, room_code, max_student, start_date, end_date, note) AS (
    VALUES
        ('CNTT102.01', 'CNTT102', 'B101', 40, DATE '2026-09-07', DATE '2026-12-20', 'Lớp học phần cơ sở khoa CNTT - Cơ sở lập trình'),
        ('CNTT104.01', 'CNTT104', 'B102', 40, DATE '2026-09-07', DATE '2026-12-20', 'Lớp học phần cơ sở khoa CNTT - Cơ sở dữ liệu'),
        ('SE301.01', 'SE301', 'A201', 35, DATE '2026-09-14', DATE '2026-12-20', 'Lớp học phần chuyên sâu ngành Kỹ thuật phần mềm'),
        ('CS301.01', 'CS301', 'A102', 35, DATE '2026-09-14', DATE '2026-12-20', 'Lớp học phần chuyên sâu ngành Khoa học máy tính'),
        ('ACC301.01', 'ACC301', 'A101', 40, DATE '2026-09-07', DATE '2026-12-20', 'Lớp học phần chuyên sâu ngành Kế toán doanh nghiệp')
)
INSERT INTO CourseClasses (
    CourseClassId, ClassCode, MaxStudent, CurrentStudent, RoomId, Status,
    SemesterId, CourseId, StartDate, EndDate, IsActive, CreatedAt
)
SELECT gen_random_uuid(), seed.class_code, seed.max_student, 0, r.RoomId, 'OPEN',
       sem.SemesterId, c.CourseId, seed.start_date, seed.end_date, TRUE, CURRENT_TIMESTAMP
FROM course_class_seed seed
JOIN Courses c ON c.Code = seed.course_code
JOIN Semesters sem ON sem.Code = 'HK1-2026'
LEFT JOIN Rooms r ON r.Code = seed.room_code
ON CONFLICT (SemesterId, CourseId, ClassCode) DO UPDATE
SET MaxStudent = EXCLUDED.MaxStudent,
    RoomId = EXCLUDED.RoomId,
    Status = 'OPEN',
    StartDate = EXCLUDED.StartDate,
    EndDate = EXCLUDED.EndDate,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

WITH assignment_seed(course_class_code, admin_class_code, course_code) AS (
    VALUES
        ('CNTT102.01', 'CNTT-K26-01', 'CNTT102'),
        ('CNTT104.01', 'CNTT-K26-01', 'CNTT104'),
        ('SE301.01', 'CNTT-K26-01', 'SE301'),
        ('CS301.01', 'CNTT-K26-01', 'CS301'),
        ('ACC301.01', 'KTDL-K26-01', 'ACC301')
),
resolved_assignment AS (
    SELECT cc.CourseClassId,
           cl.ClassId,
           sem.SemesterId,
           instructor.EmployeeId AS InstructorId,
           seed.course_class_code
    FROM assignment_seed seed
    JOIN Courses c ON c.Code = seed.course_code
    JOIN Semesters sem ON sem.Code = 'HK1-2026'
    JOIN CourseClasses cc ON cc.ClassCode = seed.course_class_code
        AND cc.CourseId = c.CourseId
        AND cc.SemesterId = sem.SemesterId
    JOIN Classes cl ON cl.ClassCode = seed.admin_class_code
    JOIN LATERAL (
        SELECT i.EmployeeId
        FROM Instructors i
        WHERE i.DepartmentId = c.DepartmentId
          AND i.IsActive = TRUE
          AND i.DeletedAt IS NULL
        ORDER BY i.InstructorCode
        LIMIT 1
    ) instructor ON TRUE
)
INSERT INTO TeachingAssignments (
    AssignmentId, InstructorId, CourseClassId, ClassId, SemesterId, Note, IsActive, CreatedAt
)
SELECT gen_random_uuid(), ra.InstructorId, ra.CourseClassId, ra.ClassId, ra.SemesterId,
       'Phân công mẫu phục vụ tự động xếp lịch gốc', TRUE, CURRENT_TIMESTAMP
FROM resolved_assignment ra
WHERE NOT EXISTS (
    SELECT 1
    FROM TeachingAssignments ta
    WHERE ta.CourseClassId = ra.CourseClassId
      AND ta.SemesterId = ra.SemesterId
      AND ta.IsActive = TRUE
      AND ta.DeletedAt IS NULL
);

WITH eligible AS (
    SELECT cc.CourseClassId,
           st.StudentId,
           rp.RegistrationPeriodId,
           row_number() OVER (PARTITION BY cc.CourseClassId ORDER BY st.StudentCode) AS rn
    FROM CourseClasses cc
    JOIN Courses c ON c.CourseId = cc.CourseId
    JOIN Semesters sem ON sem.SemesterId = cc.SemesterId AND sem.Code = 'HK1-2026'
    JOIN RegistrationPeriods rp ON rp.Code = 'ADMIN-HK1-2026'
    JOIN Students st ON st.DepartmentId = c.DepartmentId
        AND st.IsActive = TRUE
        AND st.DeletedAt IS NULL
    JOIN TrainingProgramCourses tpc ON tpc.TrainingProgramId = st.TrainingProgramId
        AND tpc.CourseId = c.CourseId
        AND tpc.IsActive = TRUE
        AND tpc.DeletedAt IS NULL
    WHERE cc.ClassCode IN ('CNTT102.01', 'CNTT104.01', 'SE301.01', 'CS301.01', 'ACC301.01')
      AND cc.IsActive = TRUE
      AND cc.DeletedAt IS NULL
)
INSERT INTO CourseRegistrations (
    CourseRegistrationId, StudentId, CourseClassId, RegistrationPeriodId,
    RegistrationType, RegisteredAt, Status, IsPaid, IsActive, CreatedAt
)
SELECT gen_random_uuid(), e.StudentId, e.CourseClassId, e.RegistrationPeriodId,
       0, CURRENT_TIMESTAMP, 1, FALSE, TRUE, CURRENT_TIMESTAMP
FROM eligible e
WHERE e.rn <= 25
  AND NOT EXISTS (
      SELECT 1
      FROM CourseRegistrations cr
      WHERE cr.StudentId = e.StudentId
        AND cr.CourseClassId = e.CourseClassId
        AND cr.DeletedAt IS NULL
  );

UPDATE CourseClasses cc
SET CurrentStudent = counts.total,
    UpdatedAt = CURRENT_TIMESTAMP
FROM (
    SELECT CourseClassId, COUNT(*)::int AS total
    FROM CourseRegistrations
    WHERE IsActive = TRUE
      AND DeletedAt IS NULL
    GROUP BY CourseClassId
) counts
WHERE counts.CourseClassId = cc.CourseClassId
  AND cc.ClassCode IN ('CNTT102.01', 'CNTT104.01', 'SE301.01', 'CS301.01', 'ACC301.01');
