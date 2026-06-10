-- Auto-schedule now creates dated fixed sessions and stops when the course has enough periods.
-- Older generated rows with Date IS NULL were expanded by the calendar for the whole class/semester range,
-- which could show a 3-credit course as 21 weekly sessions when the semester lasted 21 weeks.

UPDATE Schedules
SET IsActive = FALSE,
    DeletedAt = COALESCE(DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP,
    Note = 'Da thay the bang lich goc co ngay cu the'
WHERE Date IS NULL
  AND IsActive = TRUE
  AND Status = 'AUTO_GENERATED';
