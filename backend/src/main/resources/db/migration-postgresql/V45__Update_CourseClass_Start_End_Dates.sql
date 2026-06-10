-- V45__Update_CourseClass_Start_End_Dates.sql
-- Update startdate and enddate for all existing course classes based on active schedules

UPDATE courseclasses cc
SET startdate = (
    SELECT MIN(s.date)
    FROM schedules s
    WHERE s.courseclassid = cc.courseclassid
      AND s.isactive = true
      AND (s.schedulestatus IS NULL OR s.schedulestatus <> 'CANCELLED')
),
enddate = (
    SELECT MAX(s.date)
    FROM schedules s
    WHERE s.courseclassid = cc.courseclassid
      AND s.isactive = true
      AND (s.schedulestatus IS NULL OR s.schedulestatus <> 'CANCELLED')
);
