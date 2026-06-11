-- Repair historical/admin-assigned course registrations whose registration period
-- belongs to a different semester than the course class. The course class semester
-- is the source of truth for student schedule and registration grouping.

INSERT INTO RegistrationPeriods (
    RegistrationPeriodId,
    Code,
    Name,
    SemesterId,
    StartDate,
    EndDate,
    Status,
    MinCredits,
    MaxCredits,
    AllowRetake,
    Description,
    IsActive,
    CreatedAt,
    UpdatedAt
)
SELECT
    gen_random_uuid(),
    'ADMIN-' || s.Code,
    'Đợt gán học phần mặc định - ' || s.Name,
    s.SemesterId,
    COALESCE(s.StartDate, CURRENT_DATE)::timestamp,
    COALESCE(s.EndDate, CURRENT_DATE)::timestamp + INTERVAL '23 hours 59 minutes 59 seconds',
    1,
    0,
    30,
    FALSE,
    'Đợt nội bộ dùng khi quản trị viên gán sinh viên vào lớp học phần',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM Semesters s
WHERE EXISTS (
    SELECT 1
    FROM CourseRegistrations cr
    JOIN CourseClasses cc ON cc.CourseClassId = cr.CourseClassId
    WHERE cc.SemesterId = s.SemesterId
      AND cr.DeletedAt IS NULL
      AND COALESCE(cr.IsActive, TRUE) = TRUE
      AND (
          cr.RegistrationPeriodId IS NULL
          OR NOT EXISTS (
              SELECT 1
              FROM RegistrationPeriods rp_old
              WHERE rp_old.RegistrationPeriodId = cr.RegistrationPeriodId
                AND rp_old.SemesterId = cc.SemesterId
          )
      )
)
ON CONFLICT (Code) DO UPDATE
SET
    Name = EXCLUDED.Name,
    SemesterId = EXCLUDED.SemesterId,
    StartDate = EXCLUDED.StartDate,
    EndDate = EXCLUDED.EndDate,
    Status = EXCLUDED.Status,
    MinCredits = EXCLUDED.MinCredits,
    MaxCredits = EXCLUDED.MaxCredits,
    AllowRetake = EXCLUDED.AllowRetake,
    Description = EXCLUDED.Description,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

UPDATE CourseRegistrations cr
SET
    RegistrationPeriodId = rp_fixed.RegistrationPeriodId,
    UpdatedAt = CURRENT_TIMESTAMP
FROM CourseClasses cc
JOIN Semesters s ON s.SemesterId = cc.SemesterId
JOIN RegistrationPeriods rp_fixed ON rp_fixed.Code = 'ADMIN-' || s.Code
WHERE cr.CourseClassId = cc.CourseClassId
  AND cr.DeletedAt IS NULL
  AND COALESCE(cr.IsActive, TRUE) = TRUE
  AND (
      cr.RegistrationPeriodId IS NULL
      OR NOT EXISTS (
          SELECT 1
          FROM RegistrationPeriods rp_old
          WHERE rp_old.RegistrationPeriodId = cr.RegistrationPeriodId
            AND rp_old.SemesterId = cc.SemesterId
      )
  );
