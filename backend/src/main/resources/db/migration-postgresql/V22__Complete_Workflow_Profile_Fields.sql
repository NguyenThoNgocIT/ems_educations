ALTER TABLE Students ADD COLUMN IF NOT EXISTS MajorId UUID NULL;
ALTER TABLE Students ADD COLUMN IF NOT EXISTS AcademicCohortId UUID NULL;
ALTER TABLE Students ADD COLUMN IF NOT EXISTS ClassId UUID NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Students_Majors')) THEN
        ALTER TABLE Students ADD CONSTRAINT FK_Students_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Students_AcademicCohorts')) THEN
        ALTER TABLE Students ADD CONSTRAINT FK_Students_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Students_Classes')) THEN
        ALTER TABLE Students ADD CONSTRAINT FK_Students_Classes FOREIGN KEY (ClassId) REFERENCES Classes(ClassId);
    END IF;
END $$;

ALTER TABLE Instructors ADD COLUMN IF NOT EXISTS AcademicRank VARCHAR(50) NULL;
ALTER TABLE Instructors ADD COLUMN IF NOT EXISTS MajorId UUID NULL;
ALTER TABLE Instructors ADD COLUMN IF NOT EXISTS Specialization VARCHAR(255) NULL;
ALTER TABLE Instructors ADD COLUMN IF NOT EXISTS Institution VARCHAR(255) NULL;
ALTER TABLE Instructors ADD COLUMN IF NOT EXISTS GraduationYear INTEGER NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Instructors_Majors')) THEN
        ALTER TABLE Instructors ADD CONSTRAINT FK_Instructors_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
    END IF;
END $$;
