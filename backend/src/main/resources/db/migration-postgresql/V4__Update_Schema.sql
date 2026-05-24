ALTER TABLE Departments ADD COLUMN IF NOT EXISTS EstablishedDate DATE NULL;
ALTER TABLE Departments ADD COLUMN IF NOT EXISTS CreatedBy UUID NULL;
ALTER TABLE Departments ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;

ALTER TABLE Majors ADD COLUMN IF NOT EXISTS EffectiveDate DATE NULL;
ALTER TABLE Majors ADD COLUMN IF NOT EXISTS ExpiryDate DATE NULL;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'majors' AND column_name = 'deleteat')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'majors' AND column_name = 'deletedat') THEN
        ALTER TABLE Majors RENAME COLUMN DeleteAt TO DeletedAt;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'majors' AND column_name = 'deleteby')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'majors' AND column_name = 'deletedby') THEN
        ALTER TABLE Majors RENAME COLUMN DeleteBy TO DeletedBy;
    END IF;
END $$;

ALTER TABLE SchoolYears ADD COLUMN IF NOT EXISTS SchoolYearName VARCHAR(150) NULL;
ALTER TABLE SchoolYears ADD COLUMN IF NOT EXISTS Note VARCHAR(255) NULL;

ALTER TABLE Positions ADD COLUMN IF NOT EXISTS Code VARCHAR(20) NULL;
UPDATE Positions SET Code = 'OLD' WHERE Code IS NULL;
ALTER TABLE Positions ALTER COLUMN Code SET NOT NULL;

ALTER TABLE Positions ADD COLUMN IF NOT EXISTS Description VARCHAR(255) NULL;
ALTER TABLE Positions ADD COLUMN IF NOT EXISTS "Level" VARCHAR(100) NULL;

ALTER TABLE AcademicCohorts ADD COLUMN IF NOT EXISTS TrainingProgramId UUID NULL;
ALTER TABLE AcademicCohorts ADD COLUMN IF NOT EXISTS TranningProgramId UUID NULL;
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academiccohorts' AND column_name = 'tranningprogramid')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academiccohorts' AND column_name = 'trainingprogramid') THEN
        ALTER TABLE AcademicCohorts RENAME COLUMN TranningProgramId TO TrainingProgramId;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_AcademicCohorts_TrainingPrograms') THEN
        ALTER TABLE AcademicCohorts ADD CONSTRAINT FK_AcademicCohorts_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId);
    END IF;
END $$;

DROP INDEX IF EXISTS IX_TrainingPrograms_AcademicCohortId;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprograms' AND column_name = 'deleteat')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprograms' AND column_name = 'deletedat') THEN
        ALTER TABLE TrainingPrograms RENAME COLUMN DeleteAt TO DeletedAt;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprograms' AND column_name = 'deleteby')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprograms' AND column_name = 'deletedby') THEN
        ALTER TABLE TrainingPrograms RENAME COLUMN DeleteBy TO DeletedBy;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'deleteat')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'deletedat') THEN
        ALTER TABLE Courses RENAME COLUMN DeleteAt TO DeletedAt;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'deleteby')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'deletedby') THEN
        ALTER TABLE Courses RENAME COLUMN DeleteBy TO DeletedBy;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprogramcourses' AND column_name = 'deleteat')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprogramcourses' AND column_name = 'deletedat') THEN
        ALTER TABLE TrainingProgramCourses RENAME COLUMN DeleteAt TO DeletedAt;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprogramcourses' AND column_name = 'deleteby')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trainingprogramcourses' AND column_name = 'deletedby') THEN
        ALTER TABLE TrainingProgramCourses RENAME COLUMN DeleteBy TO DeletedBy;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courseprerequisites' AND column_name = 'deleteat')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courseprerequisites' AND column_name = 'deletedat') THEN
        ALTER TABLE CoursePrerequisites RENAME COLUMN DeleteAt TO DeletedAt;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courseprerequisites' AND column_name = 'deleteby')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courseprerequisites' AND column_name = 'deletedby') THEN
        ALTER TABLE CoursePrerequisites RENAME COLUMN DeleteBy TO DeletedBy;
    END IF;
END $$;

ALTER TABLE UserRoles ADD COLUMN IF NOT EXISTS UpdatedAt TIMESTAMP(3) NULL;
ALTER TABLE UserRoles ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;
ALTER TABLE UserRoles ADD COLUMN IF NOT EXISTS DeletedAt TIMESTAMP(3) NULL;
ALTER TABLE UserRoles ADD COLUMN IF NOT EXISTS DeletedBy UUID NULL;

ALTER TABLE RolePermissions ADD COLUMN IF NOT EXISTS UpdatedAt TIMESTAMP(3) NULL;
ALTER TABLE RolePermissions ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;
ALTER TABLE RolePermissions ADD COLUMN IF NOT EXISTS DeletedAt TIMESTAMP(3) NULL;
ALTER TABLE RolePermissions ADD COLUMN IF NOT EXISTS DeletedBy UUID NULL;

ALTER TABLE UserSessions ADD COLUMN IF NOT EXISTS CreatedBy UUID NULL;
ALTER TABLE UserSessions ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;

ALTER TABLE Divisions ADD COLUMN IF NOT EXISTS CreatedBy UUID NULL;
ALTER TABLE Divisions ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;

ALTER TABLE Staffs ADD COLUMN IF NOT EXISTS CreatedBy UUID NULL;
ALTER TABLE Staffs ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;

ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS UpdatedAt TIMESTAMP(3) NULL;
ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;
ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS DeletedAt TIMESTAMP(3) NULL;
ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS DeletedBy UUID NULL;

ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS UpdatedAt TIMESTAMP(3) NULL;
ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Classes_Instructors_Advisor')) THEN
        ALTER TABLE Classes ADD CONSTRAINT FK_Classes_Instructors_Advisor FOREIGN KEY (AdvisorId) REFERENCES Instructors(EmployeeId);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS IX_AcademicCohorts_TrainingProgramId ON AcademicCohorts(TrainingProgramId);
