-- Add workflow fields required by student/instructor creation forms.

IF COL_LENGTH('Students', 'MajorId') IS NULL
BEGIN
    ALTER TABLE Students ADD MajorId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('Students', 'AcademicCohortId') IS NULL
BEGIN
    ALTER TABLE Students ADD AcademicCohortId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('Students', 'ClassId') IS NULL
BEGIN
    ALTER TABLE Students ADD ClassId UNIQUEIDENTIFIER NULL;
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Students_Majors')
BEGIN
    ALTER TABLE Students ADD CONSTRAINT FK_Students_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Students_AcademicCohorts')
BEGIN
    ALTER TABLE Students ADD CONSTRAINT FK_Students_AcademicCohorts FOREIGN KEY (AcademicCohortId) REFERENCES AcademicCohorts(AcademicCohortId);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Students_Classes')
BEGIN
    ALTER TABLE Students ADD CONSTRAINT FK_Students_Classes FOREIGN KEY (ClassId) REFERENCES Classes(ClassId);
END

IF COL_LENGTH('Instructors', 'AcademicRank') IS NULL
BEGIN
    ALTER TABLE Instructors ADD AcademicRank NVARCHAR(50) NULL;
END

IF COL_LENGTH('Instructors', 'MajorId') IS NULL
BEGIN
    ALTER TABLE Instructors ADD MajorId UNIQUEIDENTIFIER NULL;
END

IF COL_LENGTH('Instructors', 'Specialization') IS NULL
BEGIN
    ALTER TABLE Instructors ADD Specialization NVARCHAR(255) NULL;
END

IF COL_LENGTH('Instructors', 'Institution') IS NULL
BEGIN
    ALTER TABLE Instructors ADD Institution NVARCHAR(255) NULL;
END

IF COL_LENGTH('Instructors', 'GraduationYear') IS NULL
BEGIN
    ALTER TABLE Instructors ADD GraduationYear INT NULL;
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Instructors_Majors')
BEGIN
    ALTER TABLE Instructors ADD CONSTRAINT FK_Instructors_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
END
