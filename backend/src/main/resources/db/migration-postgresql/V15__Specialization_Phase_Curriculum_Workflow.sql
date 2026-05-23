CREATE TABLE IF NOT EXISTS Specializations (
    SpecializationId UUID NOT NULL DEFAULT gen_random_uuid(),
    DepartmentId UUID NOT NULL,
    MajorId UUID NOT NULL,
    Code VARCHAR(50) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description VARCHAR(500) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy UUID NULL,
    UpdatedAt TIMESTAMP(3) NULL,
    UpdatedBy UUID NULL,
    DeletedAt TIMESTAMP(3) NULL,
    DeletedBy UUID NULL,
    CONSTRAINT PK_Specializations PRIMARY KEY (SpecializationId),
    CONSTRAINT UQ_Specializations_Code UNIQUE (Code),
    CONSTRAINT FK_Specializations_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT FK_Specializations_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId)
);

ALTER TABLE Students ADD COLUMN IF NOT EXISTS DepartmentId UUID NULL;
ALTER TABLE Students ADD COLUMN IF NOT EXISTS SpecializationId UUID NULL;
ALTER TABLE Students ALTER COLUMN TrainingProgramId DROP NOT NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Students_Departments')) THEN
        ALTER TABLE Students ADD CONSTRAINT FK_Students_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Students_Specializations')) THEN
        ALTER TABLE Students ADD CONSTRAINT FK_Students_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId);
    END IF;
END $$;

ALTER TABLE TrainingPrograms ADD COLUMN IF NOT EXISTS SpecializationId UUID NULL;
ALTER TABLE TrainingPrograms ADD COLUMN IF NOT EXISTS ProgramPhase VARCHAR(30) NULL DEFAULT 'FOUNDATION';
ALTER TABLE TrainingPrograms ALTER COLUMN MajorId DROP NOT NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_TrainingPrograms_Specializations')) THEN
        ALTER TABLE TrainingPrograms ADD CONSTRAINT FK_TrainingPrograms_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId);
    END IF;
END $$;

ALTER TABLE Classes ADD COLUMN IF NOT EXISTS MajorId UUID NULL;
ALTER TABLE Classes ADD COLUMN IF NOT EXISTS SpecializationId UUID NULL;
ALTER TABLE Classes ADD COLUMN IF NOT EXISTS ClassPhase VARCHAR(30) NULL DEFAULT 'FOUNDATION';

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Classes_Majors')) THEN
        ALTER TABLE Classes ADD CONSTRAINT FK_Classes_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Classes_Specializations')) THEN
        ALTER TABLE Classes ADD CONSTRAINT FK_Classes_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId);
    END IF;
END $$;

ALTER TABLE TrainingProgramCourses ADD COLUMN IF NOT EXISTS CoursePhase VARCHAR(30) NULL DEFAULT 'FOUNDATION';

CREATE TABLE IF NOT EXISTS StudentSpecializationHistories (
    StudentSpecializationHistoryId UUID NOT NULL DEFAULT gen_random_uuid(),
    StudentId UUID NOT NULL,
    MajorId UUID NOT NULL,
    SpecializationId UUID NOT NULL,
    TrainingProgramId UUID NOT NULL,
    EffectiveSemesterId UUID NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NULL,
    IsCurrent BOOLEAN NOT NULL DEFAULT TRUE,
    Reason VARCHAR(255) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy UUID NULL,
    UpdatedAt TIMESTAMP(3) NULL,
    UpdatedBy UUID NULL,
    DeletedAt TIMESTAMP(3) NULL,
    DeletedBy UUID NULL,
    CONSTRAINT PK_StudentSpecializationHistories PRIMARY KEY (StudentSpecializationHistoryId),
    CONSTRAINT FK_SSH2_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_SSH2_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId),
    CONSTRAINT FK_SSH2_Specializations FOREIGN KEY (SpecializationId) REFERENCES Specializations(SpecializationId),
    CONSTRAINT FK_SSH2_TrainingPrograms FOREIGN KEY (TrainingProgramId) REFERENCES TrainingPrograms(TrainingProgramId),
    CONSTRAINT FK_SSH2_Semesters FOREIGN KEY (EffectiveSemesterId) REFERENCES Semesters(SemesterId),
    CONSTRAINT CK_SSH2_DateRange CHECK (EndDate IS NULL OR StartDate <= EndDate)
);

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('SPECIALIZATION_VIEW', 'Xem chuyên ngành', 'Admin xem chuyên ngành theo khoa và ngành', 'ACADEMIC_CATALOG'),
    ('SPECIALIZATION_CREATE', 'Tạo chuyên ngành', 'Admin tạo chuyên ngành', 'ACADEMIC_CATALOG'),
    ('SPECIALIZATION_EDIT', 'Sửa chuyên ngành', 'Admin cập nhật chuyên ngành', 'ACADEMIC_CATALOG'),
    ('SPECIALIZATION_DELETE', 'Xóa chuyên ngành', 'Admin xóa mềm chuyên ngành', 'ACADEMIC_CATALOG'),
    ('STUDENT_SPECIALIZATION_VIEW', 'Xem phân chuyên ngành sinh viên', 'Admin xem lịch sử phân chuyên ngành sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_SPECIALIZATION_ASSIGN', 'Gán chuyên ngành sinh viên', 'Admin gán chuyên ngành và chương trình đào tạo cho sinh viên', 'STUDENT_MANAGEMENT'),
    ('TRAINING_PROGRAM_COURSE_VIEW', 'Xem học phần chương trình đào tạo', 'Admin xem học phần trong chương trình đào tạo', 'ACADEMIC_CATALOG')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('SPECIALIZATION_VIEW', '/api/v1/specializations/admin/**', 'GET', 'Admin xem chuyên ngành'),
    ('SPECIALIZATION_CREATE', '/api/v1/specializations/admin/**', 'POST', 'Admin tạo chuyên ngành'),
    ('SPECIALIZATION_EDIT', '/api/v1/specializations/admin/**', 'PUT', 'Admin sửa chuyên ngành'),
    ('SPECIALIZATION_DELETE', '/api/v1/specializations/admin/**', 'DELETE', 'Admin xóa chuyên ngành'),
    ('STUDENT_SPECIALIZATION_VIEW', '/api/v1/student-specializations/admin/**', 'GET', 'Admin xem phân chuyên ngành'),
    ('STUDENT_SPECIALIZATION_ASSIGN', '/api/v1/student-specializations/admin/**', 'POST', 'Admin gán chuyên ngành'),
    ('TRAINING_PROGRAM_COURSE_VIEW', '/api/v1/training-program-courses/admin/**', 'GET', 'Admin xem học phần chương trình')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId AND pa.ApiPath = src.ApiPath AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('SPECIALIZATION_VIEW','SPECIALIZATION_CREATE','SPECIALIZATION_EDIT','SPECIALIZATION_DELETE','STUDENT_SPECIALIZATION_VIEW','STUDENT_SPECIALIZATION_ASSIGN','TRAINING_PROGRAM_COURSE_VIEW')
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('Chuyên ngành', '/dashboard/admin/specializations', 'git-branch', 220, 1, 'SPECIALIZATION_VIEW'),
    ('Phân chuyên ngành sinh viên', '/dashboard/admin/student-specializations', 'route', 230, 1, 'STUDENT_SPECIALIZATION_VIEW'),
    ('Học phần chương trình', '/dashboard/admin/training-program-courses', 'list-tree', 240, 1, 'TRAINING_PROGRAM_COURSE_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);