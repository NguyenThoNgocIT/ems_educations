-- Modify unique constraints on Schedules table to support both recurring templates and specific-date schedules.

ALTER TABLE Schedules DROP CONSTRAINT IF EXISTS uq_schedules_courseclass_day_time;
ALTER TABLE Schedules DROP CONSTRAINT IF EXISTS uq_schedules_room_semester_day_time;

-- 1. For recurring template schedules (where date IS NULL):
CREATE UNIQUE INDEX IF NOT EXISTS uq_schedules_courseclass_day_time_recurring 
    ON Schedules (courseclassid, dayofweek, timeslotid) 
    WHERE date IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_schedules_room_semester_day_time_recurring 
    ON Schedules (roomid, semesterid, dayofweek, timeslotid) 
    WHERE date IS NULL;

-- 2. For specific date schedules (where date IS NOT NULL):
CREATE UNIQUE INDEX IF NOT EXISTS uq_schedules_courseclass_date_time_specific 
    ON Schedules (courseclassid, date, timeslotid) 
    WHERE date IS NOT NULL;
