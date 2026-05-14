-- =====================================================
-- UPDATE SCRIPT: Old Schema -> New Schema
-- Author: Database Comparison
-- Date: 2026-05-12
-- Description: Add missing columns, rename DeleteAt -> DeletedAt,
--              add Foreign Keys, drop obsolete indexes, etc.
-- =====================================================

USE UniversityManagement;
GO

-- =====================================================
-- 1. DEPARTMENTS
-- =====================================================
-- Add EstablishedDate
IF COL_LENGTH('Departments', 'EstablishedDate') IS NULL
BEGIN
ALTER TABLE Departments ADD EstablishedDate DATE NULL;
END;

-- Add CreatedBy, UpdatedBy (if missing)
IF COL_LENGTH('Departments', 'CreatedBy') IS NULL
BEGIN
ALTER TABLE Departments ADD CreatedBy UNIQUEIDENTIFIER NULL;
END;
IF COL_LENGTH('Departments', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE Departments ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 2. MAJORS
-- =====================================================
-- Add EffectiveDate, ExpiryDate
IF COL_LENGTH('Majors', 'EffectiveDate') IS NULL
BEGIN
ALTER TABLE Majors ADD EffectiveDate DATE NULL;
END;
IF COL_LENGTH('Majors', 'ExpiryDate') IS NULL
BEGIN
ALTER TABLE Majors ADD ExpiryDate DATE NULL;
END;

-- Rename DeleteAt -> DeletedAt (if old column exists and new one missing)
IF COL_LENGTH('Majors', 'DeleteAt') IS NOT NULL AND COL_LENGTH('Majors', 'DeletedAt') IS NULL
BEGIN
EXEC sp_rename 'Majors.DeleteAt', 'DeletedAt', 'COLUMN';
END;
IF COL_LENGTH('Majors', 'DeleteBy') IS NOT NULL AND COL_LENGTH('Majors', 'DeletedBy') IS NULL
BEGIN
EXEC sp_rename 'Majors.DeleteBy', 'DeletedBy', 'COLUMN';
END;

-- =====================================================
-- 3. SCHOOL YEARS
-- =====================================================
-- Add SchoolYearName
IF COL_LENGTH('SchoolYears', 'SchoolYearName') IS NULL
BEGIN
ALTER TABLE SchoolYears ADD SchoolYearName NVARCHAR(150) NULL;
END;
-- Add Note column if missing
IF COL_LENGTH('SchoolYears', 'Note') IS NULL
BEGIN
ALTER TABLE SchoolYears ADD Note NVARCHAR(255) NULL;
END;
-- =====================================================
-- 4. POSITIONS
-- =====================================================
-- Add Code (NOT NULL => need default temporary value)
IF COL_LENGTH('Positions', 'Code') IS NULL
BEGIN
EXEC('ALTER TABLE Positions ADD Code VARCHAR(20) NULL;');
EXEC('UPDATE Positions SET Code = ''OLD'' WHERE Code IS NULL;');
EXEC('ALTER TABLE Positions ALTER COLUMN Code VARCHAR(20) NOT NULL;');
END;

-- Add Description, Level
IF COL_LENGTH('Positions', 'Description') IS NULL
BEGIN
ALTER TABLE Positions ADD Description NVARCHAR(255) NULL;
END;
IF COL_LENGTH('Positions', 'Level') IS NULL
BEGIN
ALTER TABLE Positions ADD Level NVARCHAR(100) NULL;
END;

-- =====================================================
-- 5. ACADEMIC COHORTS
-- =====================================================
-- Add TrainingProgramId (allow NULL initially, then update and set NOT NULL)
IF COL_LENGTH('AcademicCohorts', 'TrainingProgramId') IS NULL
    AND COL_LENGTH('AcademicCohorts', 'TranningProgramId') IS NULL  -- handle typo
BEGIN
ALTER TABLE AcademicCohorts ADD TrainingProgramId UNIQUEIDENTIFIER NULL;
-- Note: You may need to manually map existing cohorts to a valid TrainingProgramId
-- For safety, we leave it NULL, but later you should update and alter to NOT NULL.
END;

-- If the column was added with typo 'TranningProgramId', rename it
IF COL_LENGTH('AcademicCohorts', 'TranningProgramId') IS NOT NULL AND COL_LENGTH('AcademicCohorts', 'TrainingProgramId') IS NULL
BEGIN
EXEC sp_rename 'AcademicCohorts.TranningProgramId', 'TrainingProgramId', 'COLUMN';
END;

-- Add Foreign Key from AcademicCohorts to TrainingPrograms (if not exists)
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_AcademicCohorts_TrainingPrograms')
   AND EXISTS (SELECT * FROM sys.tables WHERE name = 'TrainingPrograms')
BEGIN
ALTER TABLE AcademicCohorts ADD CONSTRAINT FK_AcademicCohorts_TrainingPrograms
    FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId);
END;

-- =====================================================
-- 6. TRAINING PROGRAMS
-- =====================================================
-- Drop obsolete index on AcademicCohortId (if exists)
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TrainingPrograms_AcademicCohortId')
BEGIN
DROP INDEX IX_TrainingPrograms_AcademicCohortId ON TrainingPrograms;
END;

-- If TrainingPrograms still has column AcademicCohortId, we may need to migrate data?
-- But new schema removes this column. We'll keep it for backward compatibility?
-- According to new schema, AcademicCohortId is moved to AcademicCohorts.
-- For safety, we do NOT drop the column automatically. The user should manually migrate.
-- Recommendation: after ensuring data consistency, you can drop the column.
-- For now, we just note it.

-- Rename DeleteAt -> DeletedAt in TrainingPrograms
IF COL_LENGTH('TrainingPrograms', 'DeleteAt') IS NOT NULL AND COL_LENGTH('TrainingPrograms', 'DeletedAt') IS NULL
BEGIN
EXEC sp_rename 'TrainingPrograms.DeleteAt', 'DeletedAt', 'COLUMN';
END;
IF COL_LENGTH('TrainingPrograms', 'DeleteBy') IS NOT NULL AND COL_LENGTH('TrainingPrograms', 'DeletedBy') IS NULL
BEGIN
EXEC sp_rename 'TrainingPrograms.DeleteBy', 'DeletedBy', 'COLUMN';
END;

-- =====================================================
-- 7. COURSES, TRAININGPROGRAMCOURSES, COURSEPREREQUISITES
-- =====================================================
-- Rename DeleteAt/DeleteBy to DeletedAt/DeletedBy for Courses
IF COL_LENGTH('Courses', 'DeleteAt') IS NOT NULL AND COL_LENGTH('Courses', 'DeletedAt') IS NULL
BEGIN
EXEC sp_rename 'Courses.DeleteAt', 'DeletedAt', 'COLUMN';
END;
IF COL_LENGTH('Courses', 'DeleteBy') IS NOT NULL AND COL_LENGTH('Courses', 'DeletedBy') IS NULL
BEGIN
EXEC sp_rename 'Courses.DeleteBy', 'DeletedBy', 'COLUMN';
END;

-- TrainingProgramCourses
IF COL_LENGTH('TrainingProgramCourses', 'DeleteAt') IS NOT NULL AND COL_LENGTH('TrainingProgramCourses', 'DeletedAt') IS NULL
BEGIN
EXEC sp_rename 'TrainingProgramCourses.DeleteAt', 'DeletedAt', 'COLUMN';
END;
IF COL_LENGTH('TrainingProgramCourses', 'DeleteBy') IS NOT NULL AND COL_LENGTH('TrainingProgramCourses', 'DeletedBy') IS NULL
BEGIN
EXEC sp_rename 'TrainingProgramCourses.DeleteBy', 'DeletedBy', 'COLUMN';
END;

-- CoursePrerequisites
IF COL_LENGTH('CoursePrerequisites', 'DeleteAt') IS NOT NULL AND COL_LENGTH('CoursePrerequisites', 'DeletedAt') IS NULL
BEGIN
EXEC sp_rename 'CoursePrerequisites.DeleteAt', 'DeletedAt', 'COLUMN';
END;
IF COL_LENGTH('CoursePrerequisites', 'DeleteBy') IS NOT NULL AND COL_LENGTH('CoursePrerequisites', 'DeletedBy') IS NULL
BEGIN
EXEC sp_rename 'CoursePrerequisites.DeleteBy', 'DeletedBy', 'COLUMN';
END;

-- =====================================================
-- 8. USER ROLES (add audit columns)
-- =====================================================
IF COL_LENGTH('UserRoles', 'UpdatedAt') IS NULL
BEGIN
ALTER TABLE UserRoles ADD UpdatedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('UserRoles', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE UserRoles ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;
IF COL_LENGTH('UserRoles', 'DeletedAt') IS NULL
BEGIN
ALTER TABLE UserRoles ADD DeletedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('UserRoles', 'DeletedBy') IS NULL
BEGIN
ALTER TABLE UserRoles ADD DeletedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 9. ROLE PERMISSIONS (add audit columns)
-- =====================================================
IF COL_LENGTH('RolePermissions', 'UpdatedAt') IS NULL
BEGIN
ALTER TABLE RolePermissions ADD UpdatedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('RolePermissions', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE RolePermissions ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;
IF COL_LENGTH('RolePermissions', 'DeletedAt') IS NULL
BEGIN
ALTER TABLE RolePermissions ADD DeletedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('RolePermissions', 'DeletedBy') IS NULL
BEGIN
ALTER TABLE RolePermissions ADD DeletedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 10. USER SESSIONS (add CreatedBy, UpdatedBy)
-- =====================================================
IF COL_LENGTH('UserSessions', 'CreatedBy') IS NULL
BEGIN
ALTER TABLE UserSessions ADD CreatedBy UNIQUEIDENTIFIER NULL;
END;
IF COL_LENGTH('UserSessions', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE UserSessions ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 11. DIVISIONS (add CreatedBy, UpdatedBy)
-- =====================================================
IF COL_LENGTH('Divisions', 'CreatedBy') IS NULL
BEGIN
ALTER TABLE Divisions ADD CreatedBy UNIQUEIDENTIFIER NULL;
END;
IF COL_LENGTH('Divisions', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE Divisions ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 12. STAFFS (add CreatedBy, UpdatedBy if missing)
-- =====================================================
IF COL_LENGTH('Staffs', 'CreatedBy') IS NULL
BEGIN
ALTER TABLE Staffs ADD CreatedBy UNIQUEIDENTIFIER NULL;
END;
IF COL_LENGTH('Staffs', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE Staffs ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 13. EMPLOYEE LEAVE REQUESTS (add UpdatedAt, UpdatedBy if missing)
-- =====================================================
IF COL_LENGTH('EmployeeLeaveRequests', 'UpdatedAt') IS NULL
BEGIN
ALTER TABLE EmployeeLeaveRequests ADD UpdatedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('EmployeeLeaveRequests', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE EmployeeLeaveRequests ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;
-- Also ensure DeletedAt, DeletedBy exist (old schema might have them)
IF COL_LENGTH('EmployeeLeaveRequests', 'DeletedAt') IS NULL
BEGIN
ALTER TABLE EmployeeLeaveRequests ADD DeletedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('EmployeeLeaveRequests', 'DeletedBy') IS NULL
BEGIN
ALTER TABLE EmployeeLeaveRequests ADD DeletedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 14. EMPLOYEE ATTENDANCES (add UpdatedAt, UpdatedBy)
-- =====================================================
IF COL_LENGTH('EmployeeAttendances', 'UpdatedAt') IS NULL
BEGIN
ALTER TABLE EmployeeAttendances ADD UpdatedAt DATETIME2(3) NULL;
END;
IF COL_LENGTH('EmployeeAttendances', 'UpdatedBy') IS NULL
BEGIN
ALTER TABLE EmployeeAttendances ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;

-- =====================================================
-- 15. CLASSES: Add Foreign Key for AdvisorId if missing
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Classes_Instructors_Advisor')
   AND EXISTS (SELECT * FROM sys.tables WHERE name = 'Instructors')
BEGIN
ALTER TABLE Classes ADD CONSTRAINT FK_Classes_Instructors_Advisor
    FOREIGN KEY (AdvisorId) REFERENCES Instructors(EmployeeId);
END;

-- =====================================================
-- 16. FIX POTENTIAL SYNTAX ISSUES IN CONSTRAINTS
-- (No action needed, but note: CK_Classes_MaxSize may have trailing comma – remove if exists)
-- However, we cannot alter CHECK constraint definition easily; if needed, drop and recreate.
-- This is optional, but provided for completeness.
-- =====================================================

-- =====================================================
-- 17. ADDITIONAL INDEXES (Optional, based on new schema)
-- =====================================================
-- The new schema does not introduce many new indexes.
-- But ensure that IX_TrainingPrograms_AcademicCohortId is removed (already done).
-- If needed, you may add index on AcademicCohorts.TrainingProgramId:
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AcademicCohorts_TrainingProgramId')
BEGIN
CREATE INDEX IX_AcademicCohorts_TrainingProgramId ON AcademicCohorts(TrainingProgramId);
END;

-- =====================================================
-- 18. HANDLE DEFAULT CONSTRAINTS WITH GENERIC NAMES (Optional)
-- Some default constraints in new schema have names like DF_Departments_CreatedAt,
-- but they are reused for UserRoles, RolePermissions. This is not an error.
-- No automatic fix needed.
-- =====================================================

PRINT 'Schema update completed. Please review and verify data consistency.';