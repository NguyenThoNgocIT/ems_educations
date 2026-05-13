-- Migration to add Type column to CoursePrerequisites table
IF COL_LENGTH('CoursePrerequisites', 'Type') IS NULL
BEGIN
    ALTER TABLE CoursePrerequisites
    ADD [Type] NVARCHAR(50) NULL;
END
GO
