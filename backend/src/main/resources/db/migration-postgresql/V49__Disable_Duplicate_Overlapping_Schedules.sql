-- Clean up dated fixed sessions that were created before overlap validation compared actual time ranges.
-- Keep the earliest row and disable later rows that overlap on the same date by room, instructor or course class.

WITH duplicated AS (
    SELECT DISTINCT later.ScheduleId
    FROM Schedules earlier
    JOIN Schedules later
      ON later.ScheduleId <> earlier.ScheduleId
     AND later.Date = earlier.Date
     AND later.IsActive = TRUE
     AND later.DeletedAt IS NULL
     AND earlier.IsActive = TRUE
     AND earlier.DeletedAt IS NULL
     AND later.Date IS NOT NULL
     AND earlier.Date IS NOT NULL
     AND (
          later.RoomId = earlier.RoomId
          OR later.EmployeeId = earlier.EmployeeId
          OR later.CourseClassId = earlier.CourseClassId
     )
     AND (
          earlier.CreatedAt < later.CreatedAt
          OR (earlier.CreatedAt = later.CreatedAt AND earlier.ScheduleId::text < later.ScheduleId::text)
     )
    JOIN TimeSlots earlier_slot ON earlier_slot.TimeSlotId = earlier.TimeSlotId
    JOIN TimeSlots later_slot ON later_slot.TimeSlotId = later.TimeSlotId
    WHERE earlier_slot.StartTime < later_slot.EndTime
      AND later_slot.StartTime < earlier_slot.EndTime
      AND (later.ScheduleStatus IS NULL OR later.ScheduleStatus <> 'CANCELLED')
      AND (earlier.ScheduleStatus IS NULL OR earlier.ScheduleStatus <> 'CANCELLED')
)
UPDATE Schedules s
SET IsActive = FALSE,
    DeletedAt = COALESCE(DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP,
    ScheduleStatus = 'CANCELLED',
    Status = 'DISABLED_OVERLAP_DUPLICATE',
    Note = 'Da vo hieu hoa do trung gio/phong/giang vien/lop hoc phan'
FROM duplicated d
WHERE d.ScheduleId = s.ScheduleId;
