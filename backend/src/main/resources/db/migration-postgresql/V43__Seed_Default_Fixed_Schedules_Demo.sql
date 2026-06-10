-- Demo luong lich goc:
-- TrainingPrograms -> TrainingProgramCourses -> CourseClasses -> TeachingAssignments/CourseRegistrations -> Schedules.
-- Khong seed luong sinh vien tu dang ky hoc lai/cai thien trong migration nay.

-- Vo hieu hoa nhom lich demo cu tu V21 vi nhom nay duoc tao theo co van/lop,
-- khong di qua phan cong giang day va chuong trinh dao tao.
UPDATE Schedules s
SET IsActive = FALSE,
    DeletedAt = COALESCE(s.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP,
    Note = 'Da thay the bang lich goc demo theo lop hoc phan'
WHERE LOWER(COALESCE(s.Description, '')) LIKE '%demo%'
  AND s.Date IS NULL
  AND EXISTS (
      SELECT 1
      FROM TimeSlots ts
      WHERE ts.TimeSlotId = s.TimeSlotId
        AND ts.SlotCode IN ('T1', 'T2', 'T3', 'T4', 'T5')
  );

WITH schedule_seed(course_class_code, course_code, room_code, slot_code, teaching_date, day_of_week, periods, note) AS (
    VALUES
        ('CNTT102.01', 'CNTT102', 'B101', 'T1-3', DATE '2026-09-07', 1, 3, 'Nen tang CNTT - Co so lap trinh'),
        ('CNTT102.01', 'CNTT102', 'B101', 'T1-3', DATE '2026-09-09', 3, 3, 'Nen tang CNTT - Co so lap trinh'),
        ('CNTT104.01', 'CNTT104', 'B102', 'T4-6', DATE '2026-09-08', 2, 3, 'Nen tang CNTT - Co so du lieu'),
        ('CNTT104.01', 'CNTT104', 'B102', 'T4-6', DATE '2026-09-10', 4, 3, 'Nen tang CNTT - Co so du lieu'),
        ('SE301.01', 'SE301', 'A201', 'T7-9', DATE '2026-09-14', 1, 3, 'Chuyen sau Ky thuat phan mem'),
        ('SE301.01', 'SE301', 'A201', 'T7-9', DATE '2026-09-16', 3, 3, 'Chuyen sau Ky thuat phan mem'),
        ('CS301.01', 'CS301', 'A102', 'T7-9', DATE '2026-09-15', 2, 3, 'Chuyen sau Khoa hoc may tinh'),
        ('CS301.01', 'CS301', 'A102', 'T7-9', DATE '2026-09-17', 4, 3, 'Chuyen sau Khoa hoc may tinh'),
        ('ACC301.01', 'ACC301', 'A101', 'T4-6', DATE '2026-09-07', 1, 3, 'Chuyen sau Ke toan doanh nghiep'),
        ('ACC301.01', 'ACC301', 'A101', 'T4-6', DATE '2026-09-09', 3, 3, 'Chuyen sau Ke toan doanh nghiep')
),
resolved AS (
    SELECT cc.CourseClassId,
           sem.SemesterId,
           r.RoomId,
           ts.TimeSlotId,
           ta.InstructorId,
           seed.teaching_date,
           seed.day_of_week,
           seed.periods,
           seed.note
    FROM schedule_seed seed
    JOIN Courses c ON c.Code = seed.course_code
    JOIN Semesters sem ON sem.Code = 'HK1-2026'
    JOIN CourseClasses cc ON cc.ClassCode = seed.course_class_code
        AND cc.CourseId = c.CourseId
        AND cc.SemesterId = sem.SemesterId
        AND cc.IsActive = TRUE
        AND cc.DeletedAt IS NULL
    JOIN Rooms r ON r.Code = seed.room_code
    JOIN TimeSlots ts ON ts.SlotCode = seed.slot_code
        AND ts.IsActive = TRUE
        AND ts.DeletedAt IS NULL
    JOIN LATERAL (
        SELECT active_ta.InstructorId
        FROM TeachingAssignments active_ta
        WHERE active_ta.CourseClassId = cc.CourseClassId
          AND active_ta.SemesterId = sem.SemesterId
          AND active_ta.IsActive = TRUE
          AND active_ta.DeletedAt IS NULL
        ORDER BY active_ta.CreatedAt, active_ta.AssignmentId
        LIMIT 1
    ) ta ON TRUE
)
INSERT INTO Schedules (
    ScheduleId, CourseClassId, EmployeeId, SemesterId, RoomId, DayOfWeek, Date,
    Shift, TimeSlotId, NumberOfPeriods, StartDate, EndDate, Mode, Status,
    Description, ScheduleStatus, ScheduleType, Note, IsActive, CreatedAt
)
SELECT gen_random_uuid(),
       resolved.CourseClassId,
       resolved.InstructorId,
       resolved.SemesterId,
       resolved.RoomId,
       resolved.day_of_week,
       resolved.teaching_date,
       NULL,
       resolved.TimeSlotId,
       resolved.periods,
       resolved.teaching_date + ts.StartTime,
       resolved.teaching_date + ts.EndTime,
       'OFFLINE',
       'SCHEDULED',
       'Lich goc demo theo lop hoc phan',
       'ACTIVE',
       'FIXED',
       resolved.note,
       TRUE,
       CURRENT_TIMESTAMP
FROM resolved
JOIN TimeSlots ts ON ts.TimeSlotId = resolved.TimeSlotId
WHERE NOT EXISTS (
    SELECT 1
    FROM Schedules existing
    WHERE existing.CourseClassId = resolved.CourseClassId
      AND existing.DayOfWeek = resolved.day_of_week
      AND existing.TimeSlotId = resolved.TimeSlotId
)
  AND NOT EXISTS (
      SELECT 1
      FROM Schedules existing
      WHERE existing.RoomId = resolved.RoomId
        AND existing.SemesterId = resolved.SemesterId
        AND existing.DayOfWeek = resolved.day_of_week
        AND existing.TimeSlotId = resolved.TimeSlotId
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Schedules existing
      WHERE existing.EmployeeId = resolved.InstructorId
        AND existing.SemesterId = resolved.SemesterId
        AND existing.DayOfWeek = resolved.day_of_week
        AND existing.TimeSlotId = resolved.TimeSlotId
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
