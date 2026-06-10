-- The scheduling workflow now stores the fixed timetable as concrete teaching sessions.
-- Recurring rows (Date IS NULL) were expanded by the calendar for the whole class/semester range,
-- so a 3-credit course could appear as 21 sessions while progress counted only one 3-period row.

UPDATE Schedules
SET IsActive = FALSE,
    DeletedAt = COALESCE(DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP,
    Status = 'REPLACED_BY_DATED_SCHEDULE',
    Note = 'Da vo hieu hoa mau lich tuan cu de xep lich goc theo tung buoi'
WHERE Date IS NULL
  AND IsActive = TRUE
  AND DeletedAt IS NULL
  AND (ScheduleType IS NULL OR ScheduleType = 'FIXED');
