-- Seed RBAC for academic and HR catalog admin modules.

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT NEWID(), Code, Name, Description, Module, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('DEPARTMENT_VIEW', N'Xem khoa', N'Admin xem danh sách và chi tiết khoa', 'ACADEMIC_CATALOG'),
    ('DEPARTMENT_CREATE', N'Tạo khoa', N'Admin tạo khoa', 'ACADEMIC_CATALOG'),
    ('DEPARTMENT_EDIT', N'Sửa khoa', N'Admin cập nhật khoa', 'ACADEMIC_CATALOG'),
    ('DEPARTMENT_DELETE', N'Xóa khoa', N'Admin xóa mềm khoa', 'ACADEMIC_CATALOG'),
    ('MAJOR_VIEW', N'Xem ngành', N'Admin xem danh sách và chi tiết ngành', 'ACADEMIC_CATALOG'),
    ('MAJOR_CREATE', N'Tạo ngành', N'Admin tạo ngành theo khoa', 'ACADEMIC_CATALOG'),
    ('MAJOR_EDIT', N'Sửa ngành', N'Admin cập nhật ngành', 'ACADEMIC_CATALOG'),
    ('MAJOR_DELETE', N'Xóa ngành', N'Admin xóa mềm ngành', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_VIEW', N'Xem niên khóa', N'Admin xem danh sách và chi tiết niên khóa', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_CREATE', N'Tạo niên khóa', N'Admin tạo niên khóa đào tạo', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_EDIT', N'Sửa niên khóa', N'Admin cập nhật niên khóa', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_DELETE', N'Xóa niên khóa', N'Admin xóa mềm niên khóa', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_VIEW', N'Xem chương trình đào tạo', N'Admin xem chương trình đào tạo', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_CREATE', N'Tạo chương trình đào tạo', N'Admin tạo chương trình đào tạo theo ngành và niên khóa', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_EDIT', N'Sửa chương trình đào tạo', N'Admin cập nhật chương trình đào tạo', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_DELETE', N'Xóa chương trình đào tạo', N'Admin xóa mềm chương trình đào tạo', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_VIEW', N'Xem năm học', N'Admin xem danh sách và chi tiết năm học', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_CREATE', N'Tạo năm học', N'Admin tạo năm học', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_EDIT', N'Sửa năm học', N'Admin cập nhật năm học', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_DELETE', N'Xóa năm học', N'Admin xóa mềm năm học', 'ACADEMIC_CATALOG'),
    ('SEMESTER_VIEW', N'Xem học kỳ', N'Admin xem danh sách và chi tiết học kỳ', 'ACADEMIC_CATALOG'),
    ('SEMESTER_CREATE', N'Tạo học kỳ', N'Admin tạo học kỳ trong năm học', 'ACADEMIC_CATALOG'),
    ('SEMESTER_EDIT', N'Sửa học kỳ', N'Admin cập nhật học kỳ', 'ACADEMIC_CATALOG'),
    ('SEMESTER_DELETE', N'Xóa học kỳ', N'Admin xóa mềm học kỳ', 'ACADEMIC_CATALOG'),
    ('CLASS_VIEW', N'Xem lớp hành chính', N'Admin xem danh sách và chi tiết lớp hành chính', 'ACADEMIC_CATALOG'),
    ('CLASS_CREATE', N'Tạo lớp hành chính', N'Admin tạo lớp hành chính theo khoa và niên khóa', 'ACADEMIC_CATALOG'),
    ('CLASS_EDIT', N'Sửa lớp hành chính', N'Admin cập nhật lớp hành chính', 'ACADEMIC_CATALOG'),
    ('CLASS_DELETE', N'Xóa lớp hành chính', N'Admin xóa mềm lớp hành chính', 'ACADEMIC_CATALOG'),
    ('DIVISION_VIEW', N'Xem phòng ban', N'Admin xem danh sách và chi tiết phòng ban', 'HR_CATALOG'),
    ('DIVISION_CREATE', N'Tạo phòng ban', N'Admin tạo phòng ban', 'HR_CATALOG'),
    ('DIVISION_EDIT', N'Sửa phòng ban', N'Admin cập nhật phòng ban', 'HR_CATALOG'),
    ('DIVISION_DELETE', N'Xóa phòng ban', N'Admin xóa mềm phòng ban', 'HR_CATALOG'),
    ('POSITION_VIEW', N'Xem chức vụ', N'Admin xem danh sách và chi tiết chức vụ', 'HR_CATALOG'),
    ('POSITION_CREATE', N'Tạo chức vụ', N'Admin tạo chức vụ theo phòng ban', 'HR_CATALOG'),
    ('POSITION_EDIT', N'Sửa chức vụ', N'Admin cập nhật chức vụ', 'HR_CATALOG'),
    ('POSITION_DELETE', N'Xóa chức vụ', N'Admin xóa mềm chức vụ', 'HR_CATALOG'),
    ('DEGREE_VIEW', N'Xem trình độ', N'Admin xem danh sách và chi tiết trình độ', 'HR_CATALOG'),
    ('DEGREE_CREATE', N'Tạo trình độ', N'Admin tạo trình độ, học vị, học hàm', 'HR_CATALOG'),
    ('DEGREE_EDIT', N'Sửa trình độ', N'Admin cập nhật trình độ', 'HR_CATALOG'),
    ('DEGREE_DELETE', N'Xóa trình độ', N'Admin xóa mềm trình độ', 'HR_CATALOG'),
    ('CONTRACT_VIEW', N'Xem hợp đồng', N'Admin xem danh sách và chi tiết hợp đồng nhân sự', 'HR_CATALOG'),
    ('CONTRACT_CREATE', N'Tạo hợp đồng', N'Admin tạo hợp đồng nhân sự', 'HR_CATALOG'),
    ('CONTRACT_EDIT', N'Sửa hợp đồng', N'Admin cập nhật hợp đồng nhân sự', 'HR_CATALOG'),
    ('CONTRACT_DELETE', N'Xóa hợp đồng', N'Admin xóa mềm hợp đồng nhân sự', 'HR_CATALOG')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

DECLARE @AdminRoleId UNIQUEIDENTIFIER;
DECLARE @SuperAdminRoleId UNIQUEIDENTIFIER;

SELECT @AdminRoleId = RoleId FROM Roles WHERE Code = 'ADMIN';
SELECT @SuperAdminRoleId = RoleId FROM Roles WHERE Code = 'SUPER_ADMIN';

IF @AdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @AdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN (
        'DEPARTMENT_VIEW','DEPARTMENT_CREATE','DEPARTMENT_EDIT','DEPARTMENT_DELETE',
        'MAJOR_VIEW','MAJOR_CREATE','MAJOR_EDIT','MAJOR_DELETE',
        'ACADEMIC_COHORT_VIEW','ACADEMIC_COHORT_CREATE','ACADEMIC_COHORT_EDIT','ACADEMIC_COHORT_DELETE',
        'TRAINING_PROGRAM_VIEW','TRAINING_PROGRAM_CREATE','TRAINING_PROGRAM_EDIT','TRAINING_PROGRAM_DELETE',
        'SCHOOL_YEAR_VIEW','SCHOOL_YEAR_CREATE','SCHOOL_YEAR_EDIT','SCHOOL_YEAR_DELETE',
        'SEMESTER_VIEW','SEMESTER_CREATE','SEMESTER_EDIT','SEMESTER_DELETE',
        'CLASS_VIEW','CLASS_CREATE','CLASS_EDIT','CLASS_DELETE',
        'DIVISION_VIEW','DIVISION_CREATE','DIVISION_EDIT','DIVISION_DELETE',
        'POSITION_VIEW','POSITION_CREATE','POSITION_EDIT','POSITION_DELETE',
        'DEGREE_VIEW','DEGREE_CREATE','DEGREE_EDIT','DEGREE_DELETE',
        'CONTRACT_VIEW','CONTRACT_CREATE','CONTRACT_EDIT','CONTRACT_DELETE'
    )
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @AdminRoleId AND rp.PermissionId = p.PermissionId);
END

IF @SuperAdminRoleId IS NOT NULL
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
    SELECT @SuperAdminRoleId, p.PermissionId, 1, CURRENT_TIMESTAMP
    FROM Permissions p
    WHERE p.Code IN (
        'DEPARTMENT_VIEW','DEPARTMENT_CREATE','DEPARTMENT_EDIT','DEPARTMENT_DELETE',
        'MAJOR_VIEW','MAJOR_CREATE','MAJOR_EDIT','MAJOR_DELETE',
        'ACADEMIC_COHORT_VIEW','ACADEMIC_COHORT_CREATE','ACADEMIC_COHORT_EDIT','ACADEMIC_COHORT_DELETE',
        'TRAINING_PROGRAM_VIEW','TRAINING_PROGRAM_CREATE','TRAINING_PROGRAM_EDIT','TRAINING_PROGRAM_DELETE',
        'SCHOOL_YEAR_VIEW','SCHOOL_YEAR_CREATE','SCHOOL_YEAR_EDIT','SCHOOL_YEAR_DELETE',
        'SEMESTER_VIEW','SEMESTER_CREATE','SEMESTER_EDIT','SEMESTER_DELETE',
        'CLASS_VIEW','CLASS_CREATE','CLASS_EDIT','CLASS_DELETE',
        'DIVISION_VIEW','DIVISION_CREATE','DIVISION_EDIT','DIVISION_DELETE',
        'POSITION_VIEW','POSITION_CREATE','POSITION_EDIT','POSITION_DELETE',
        'DEGREE_VIEW','DEGREE_CREATE','DEGREE_EDIT','DEGREE_DELETE',
        'CONTRACT_VIEW','CONTRACT_CREATE','CONTRACT_EDIT','CONTRACT_DELETE'
    )
      AND NOT EXISTS (SELECT 1 FROM RolePermissions rp WHERE rp.RoleId = @SuperAdminRoleId AND rp.PermissionId = p.PermissionId);
END

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('DEPARTMENT_VIEW', '/api/v1/departments/admin/**', 'GET', N'Admin xem khoa'),
    ('DEPARTMENT_CREATE', '/api/v1/departments/admin/**', 'POST', N'Admin tạo khoa'),
    ('DEPARTMENT_EDIT', '/api/v1/departments/admin/**', 'PUT', N'Admin sửa khoa'),
    ('DEPARTMENT_DELETE', '/api/v1/departments/admin/**', 'DELETE', N'Admin xóa khoa'),
    ('MAJOR_VIEW', '/api/v1/majors/admin/**', 'GET', N'Admin xem ngành'),
    ('MAJOR_CREATE', '/api/v1/majors/admin/**', 'POST', N'Admin tạo ngành'),
    ('MAJOR_EDIT', '/api/v1/majors/admin/**', 'PUT', N'Admin sửa ngành'),
    ('MAJOR_DELETE', '/api/v1/majors/admin/**', 'DELETE', N'Admin xóa ngành'),
    ('ACADEMIC_COHORT_VIEW', '/api/v1/academic-cohorts/admin/**', 'GET', N'Admin xem niên khóa'),
    ('ACADEMIC_COHORT_CREATE', '/api/v1/academic-cohorts/admin/**', 'POST', N'Admin tạo niên khóa'),
    ('ACADEMIC_COHORT_EDIT', '/api/v1/academic-cohorts/admin/**', 'PUT', N'Admin sửa niên khóa'),
    ('ACADEMIC_COHORT_DELETE', '/api/v1/academic-cohorts/admin/**', 'DELETE', N'Admin xóa niên khóa'),
    ('TRAINING_PROGRAM_VIEW', '/api/v1/training-programs/admin/**', 'GET', N'Admin xem chương trình đào tạo'),
    ('TRAINING_PROGRAM_CREATE', '/api/v1/training-programs/admin/**', 'POST', N'Admin tạo chương trình đào tạo'),
    ('TRAINING_PROGRAM_EDIT', '/api/v1/training-programs/admin/**', 'PUT', N'Admin sửa chương trình đào tạo'),
    ('TRAINING_PROGRAM_DELETE', '/api/v1/training-programs/admin/**', 'DELETE', N'Admin xóa chương trình đào tạo'),
    ('SCHOOL_YEAR_VIEW', '/api/v1/school-years/admin/**', 'GET', N'Admin xem năm học'),
    ('SCHOOL_YEAR_CREATE', '/api/v1/school-years/admin/**', 'POST', N'Admin tạo năm học'),
    ('SCHOOL_YEAR_EDIT', '/api/v1/school-years/admin/**', 'PUT', N'Admin sửa năm học'),
    ('SCHOOL_YEAR_DELETE', '/api/v1/school-years/admin/**', 'DELETE', N'Admin xóa năm học'),
    ('SEMESTER_VIEW', '/api/v1/semesters/admin/**', 'GET', N'Admin xem học kỳ'),
    ('SEMESTER_CREATE', '/api/v1/semesters/admin/**', 'POST', N'Admin tạo học kỳ'),
    ('SEMESTER_EDIT', '/api/v1/semesters/admin/**', 'PUT', N'Admin sửa học kỳ'),
    ('SEMESTER_DELETE', '/api/v1/semesters/admin/**', 'DELETE', N'Admin xóa học kỳ'),
    ('CLASS_VIEW', '/api/v1/classes/admin/**', 'GET', N'Admin xem lớp hành chính'),
    ('CLASS_CREATE', '/api/v1/classes/admin/**', 'POST', N'Admin tạo lớp hành chính'),
    ('CLASS_EDIT', '/api/v1/classes/admin/**', 'PUT', N'Admin sửa lớp hành chính'),
    ('CLASS_DELETE', '/api/v1/classes/admin/**', 'DELETE', N'Admin xóa lớp hành chính'),
    ('DIVISION_VIEW', '/api/v1/divisions/admin/**', 'GET', N'Admin xem phòng ban'),
    ('DIVISION_CREATE', '/api/v1/divisions/admin/**', 'POST', N'Admin tạo phòng ban'),
    ('DIVISION_EDIT', '/api/v1/divisions/admin/**', 'PUT', N'Admin sửa phòng ban'),
    ('DIVISION_DELETE', '/api/v1/divisions/admin/**', 'DELETE', N'Admin xóa phòng ban'),
    ('POSITION_VIEW', '/api/v1/positions/admin/**', 'GET', N'Admin xem chức vụ'),
    ('POSITION_CREATE', '/api/v1/positions/admin/**', 'POST', N'Admin tạo chức vụ'),
    ('POSITION_EDIT', '/api/v1/positions/admin/**', 'PUT', N'Admin sửa chức vụ'),
    ('POSITION_DELETE', '/api/v1/positions/admin/**', 'DELETE', N'Admin xóa chức vụ'),
    ('DEGREE_VIEW', '/api/v1/degrees/admin/**', 'GET', N'Admin xem trình độ'),
    ('DEGREE_CREATE', '/api/v1/degrees/admin/**', 'POST', N'Admin tạo trình độ'),
    ('DEGREE_EDIT', '/api/v1/degrees/admin/**', 'PUT', N'Admin sửa trình độ'),
    ('DEGREE_DELETE', '/api/v1/degrees/admin/**', 'DELETE', N'Admin xóa trình độ'),
    ('CONTRACT_VIEW', '/api/v1/contracts/admin/**', 'GET', N'Admin xem hợp đồng'),
    ('CONTRACT_CREATE', '/api/v1/contracts/admin/**', 'POST', N'Admin tạo hợp đồng'),
    ('CONTRACT_EDIT', '/api/v1/contracts/admin/**', 'PUT', N'Admin sửa hợp đồng'),
    ('CONTRACT_DELETE', '/api/v1/contracts/admin/**', 'DELETE', N'Admin xóa hợp đồng')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId
      AND pa.ApiPath = src.ApiPath
      AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT NEWID(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, 1, CURRENT_TIMESTAMP
FROM (
    VALUES
    (N'Khoa', '/dashboard/admin/departments', 'building-2', 80, 1, 'DEPARTMENT_VIEW'),
    (N'Ngành đào tạo', '/dashboard/admin/majors', 'book-open', 90, 1, 'MAJOR_VIEW'),
    (N'Niên khóa', '/dashboard/admin/academic-cohorts', 'calendar-range', 100, 1, 'ACADEMIC_COHORT_VIEW'),
    (N'Chương trình đào tạo', '/dashboard/admin/training-programs', 'graduation-cap', 110, 1, 'TRAINING_PROGRAM_VIEW'),
    (N'Năm học', '/dashboard/admin/school-years', 'calendar-days', 120, 1, 'SCHOOL_YEAR_VIEW'),
    (N'Học kỳ', '/dashboard/admin/semesters', 'calendar-check', 130, 1, 'SEMESTER_VIEW'),
    (N'Lớp hành chính', '/dashboard/admin/classes', 'users-round', 140, 1, 'CLASS_VIEW'),
    (N'Phòng ban', '/dashboard/admin/divisions', 'network', 150, 1, 'DIVISION_VIEW'),
    (N'Chức vụ', '/dashboard/admin/positions', 'badge', 160, 1, 'POSITION_VIEW'),
    (N'Trình độ', '/dashboard/admin/degrees', 'award', 170, 1, 'DEGREE_VIEW'),
    (N'Hợp đồng', '/dashboard/admin/contracts', 'file-signature', 180, 1, 'CONTRACT_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);
