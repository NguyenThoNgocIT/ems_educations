-- Align legacy schema columns with the current BaseEntity / SoftDeleteEntity mappings.

-- Departments are missing CreatedBy and UpdatedBy in the current schema.
IF COL_LENGTH('Departments', 'CreatedBy') IS NULL
BEGIN
    ALTER TABLE Departments ADD CreatedBy UNIQUEIDENTIFIER NULL;
END;

IF COL_LENGTH('Departments', 'UpdatedBy') IS NULL
BEGIN
    ALTER TABLE Departments ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END;

-- Several tables still use DeleteAt / DeleteBy while the entities map DeletedAt / DeletedBy.
IF COL_LENGTH('Majors', 'DeleteAt') IS NOT NULL AND COL_LENGTH('Majors', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'Majors.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('Majors', 'DeleteBy') IS NOT NULL AND COL_LENGTH('Majors', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'Majors.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('Courses', 'DeleteAt') IS NOT NULL AND COL_LENGTH('Courses', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'Courses.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('Courses', 'DeleteBy') IS NOT NULL AND COL_LENGTH('Courses', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'Courses.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('TrainingPrograms', 'DeleteAt') IS NOT NULL AND COL_LENGTH('TrainingPrograms', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'TrainingPrograms.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('TrainingPrograms', 'DeleteBy') IS NOT NULL AND COL_LENGTH('TrainingPrograms', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'TrainingPrograms.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('TrainingProgramCourses', 'DeleteAt') IS NOT NULL AND COL_LENGTH('TrainingProgramCourses', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'TrainingProgramCourses.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('TrainingProgramCourses', 'DeleteBy') IS NOT NULL AND COL_LENGTH('TrainingProgramCourses', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'TrainingProgramCourses.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('CoursePrerequisites', 'DeleteAt') IS NOT NULL AND COL_LENGTH('CoursePrerequisites', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'CoursePrerequisites.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('CoursePrerequisites', 'DeleteBy') IS NOT NULL AND COL_LENGTH('CoursePrerequisites', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'CoursePrerequisites.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('GradeComponents', 'DeleteAt') IS NOT NULL AND COL_LENGTH('GradeComponents', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'GradeComponents.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('GradeComponents', 'DeleteBy') IS NOT NULL AND COL_LENGTH('GradeComponents', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'GradeComponents.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('StudentGrades', 'DeleteAt') IS NOT NULL AND COL_LENGTH('StudentGrades', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'StudentGrades.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('StudentGrades', 'DeleteBy') IS NOT NULL AND COL_LENGTH('StudentGrades', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'StudentGrades.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('GradeScales', 'DeleteAt') IS NOT NULL AND COL_LENGTH('GradeScales', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'GradeScales.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('GradeScales', 'DeleteBy') IS NOT NULL AND COL_LENGTH('GradeScales', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'GradeScales.DeleteBy', 'DeletedBy', 'COLUMN';
END;

IF COL_LENGTH('ExamTypes', 'DeleteAt') IS NOT NULL AND COL_LENGTH('ExamTypes', 'DeletedAt') IS NULL
BEGIN
    EXEC sp_rename 'ExamTypes.DeleteAt', 'DeletedAt', 'COLUMN';
END;

IF COL_LENGTH('ExamTypes', 'DeleteBy') IS NOT NULL AND COL_LENGTH('ExamTypes', 'DeletedBy') IS NULL
BEGIN
    EXEC sp_rename 'ExamTypes.DeleteBy', 'DeletedBy', 'COLUMN';
END;