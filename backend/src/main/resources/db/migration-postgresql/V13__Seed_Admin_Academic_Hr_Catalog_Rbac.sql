INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('DEPARTMENT_VIEW', 'Xem khoa', 'Admin xem danh sách và chi tiết khoa', 'ACADEMIC_CATALOG'),
    ('DEPARTMENT_CREATE', 'Tạo khoa', 'Admin tạo khoa', 'ACADEMIC_CATALOG'),
    ('DEPARTMENT_EDIT', 'Sửa khoa', 'Admin cập nhật khoa', 'ACADEMIC_CATALOG'),
    ('DEPARTMENT_DELETE', 'Xóa khoa', 'Admin xóa mềm khoa', 'ACADEMIC_CATALOG'),
    ('MAJOR_VIEW', 'Xem ngành', 'Admin xem danh sách và chi tiết ngành', 'ACADEMIC_CATALOG'),
    ('MAJOR_CREATE', 'Tạo ngành', 'Admin tạo ngành theo khoa', 'ACADEMIC_CATALOG'),
    ('MAJOR_EDIT', 'Sửa ngành', 'Admin cập nhật ngành', 'ACADEMIC_CATALOG'),
    ('MAJOR_DELETE', 'Xóa ngành', 'Admin xóa mềm ngành', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_VIEW', 'Xem niên khóa', 'Admin xem danh sách và chi tiết niên khóa', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_CREATE', 'Tạo niên khóa', 'Admin tạo niên khóa đào tạo', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_EDIT', 'Sửa niên khóa', 'Admin cập nhật niên khóa', 'ACADEMIC_CATALOG'),
    ('ACADEMIC_COHORT_DELETE', 'Xóa niên khóa', 'Admin xóa mềm niên khóa', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_VIEW', 'Xem chương trình đào tạo', 'Admin xem chương trình đào tạo', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_CREATE', 'Tạo chương trình đào tạo', 'Admin tạo chương trình đào tạo theo ngành và niên khóa', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_EDIT', 'Sửa chương trình đào tạo', 'Admin cập nhật chương trình đào tạo', 'ACADEMIC_CATALOG'),
    ('TRAINING_PROGRAM_DELETE', 'Xóa chương trình đào tạo', 'Admin xóa mềm chương trình đào tạo', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_VIEW', 'Xem năm học', 'Admin xem danh sách và chi tiết năm học', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_CREATE', 'Tạo năm học', 'Admin tạo năm học', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_EDIT', 'Sửa năm học', 'Admin cập nhật năm học', 'ACADEMIC_CATALOG'),
    ('SCHOOL_YEAR_DELETE', 'Xóa năm học', 'Admin xóa mềm năm học', 'ACADEMIC_CATALOG'),
    ('SEMESTER_VIEW', 'Xem học kỳ', 'Admin xem danh sách và chi tiết học kỳ', 'ACADEMIC_CATALOG'),
    ('SEMESTER_CREATE', 'Tạo học kỳ', 'Admin tạo học kỳ trong năm học', 'ACADEMIC_CATALOG'),
    ('SEMESTER_EDIT', 'Sửa học kỳ', 'Admin cập nhật học kỳ', 'ACADEMIC_CATALOG'),
    ('SEMESTER_DELETE', 'Xóa học kỳ', 'Admin xóa mềm học kỳ', 'ACADEMIC_CATALOG'),
    ('CLASS_VIEW', 'Xem lớp hành chính', 'Admin xem danh sách và chi tiết lớp hành chính', 'ACADEMIC_CATALOG'),
    ('CLASS_CREATE', 'Tạo lớp hành chính', 'Admin tạo lớp hành chính theo khoa và niên khóa', 'ACADEMIC_CATALOG'),
    ('CLASS_EDIT', 'Sửa lớp hành chính', 'Admin cập nhật lớp hành chính', 'ACADEMIC_CATALOG'),
    ('CLASS_DELETE', 'Xóa lớp hành chính', 'Admin xóa mềm lớp hành chính', 'ACADEMIC_CATALOG'),
    ('DIVISION_VIEW', 'Xem phòng ban', 'Admin xem danh sách và chi tiết phòng ban', 'HR_CATALOG'),
    ('DIVISION_CREATE', 'Tạo phòng ban', 'Admin tạo phòng ban', 'HR_CATALOG'),
    ('DIVISION_EDIT', 'Sửa phòng ban', 'Admin cập nhật phòng ban', 'HR_CATALOG'),
    ('DIVISION_DELETE', 'Xóa phòng ban', 'Admin xóa mềm phòng ban', 'HR_CATALOG'),
    ('POSITION_VIEW', 'Xem chức vụ', 'Admin xem danh sách và chi tiết chức vụ', 'HR_CATALOG'),
    ('POSITION_CREATE', 'Tạo chức vụ', 'Admin tạo chức vụ theo phòng ban', 'HR_CATALOG'),
    ('POSITION_EDIT', 'Sửa chức vụ', 'Admin cập nhật chức vụ', 'HR_CATALOG'),
    ('POSITION_DELETE', 'Xóa chức vụ', 'Admin xóa mềm chức vụ', 'HR_CATALOG'),
    ('DEGREE_VIEW', 'Xem trình độ', 'Admin xem danh sách và chi tiết trình độ', 'HR_CATALOG'),
    ('DEGREE_CREATE', 'Tạo trình độ', 'Admin tạo trình độ, học vị, học hàm', 'HR_CATALOG'),
    ('DEGREE_EDIT', 'Sửa trình độ', 'Admin cập nhật trình độ', 'HR_CATALOG'),
    ('DEGREE_DELETE', 'Xóa trình độ', 'Admin xóa mềm trình độ', 'HR_CATALOG'),
    ('CONTRACT_VIEW', 'Xem hợp đồng', 'Admin xem danh sách và chi tiết hợp đồng nhân sự', 'HR_CATALOG'),
    ('CONTRACT_CREATE', 'Tạo hợp đồng', 'Admin tạo hợp đồng nhân sự', 'HR_CATALOG'),
    ('CONTRACT_EDIT', 'Sửa hợp đồng', 'Admin cập nhật hợp đồng nhân sự', 'HR_CATALOG'),
    ('CONTRACT_DELETE', 'Xóa hợp đồng', 'Admin xóa mềm hợp đồng nhân sự', 'HR_CATALOG')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
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
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('DEPARTMENT_VIEW', '/api/v1/departments/admin/**', 'GET', 'Admin xem khoa'),
    ('DEPARTMENT_CREATE', '/api/v1/departments/admin/**', 'POST', 'Admin tạo khoa'),
    ('DEPARTMENT_EDIT', '/api/v1/departments/admin/**', 'PUT', 'Admin sửa khoa'),
    ('DEPARTMENT_DELETE', '/api/v1/departments/admin/**', 'DELETE', 'Admin xóa khoa'),
    ('MAJOR_VIEW', '/api/v1/majors/admin/**', 'GET', 'Admin xem ngành'),
    ('MAJOR_CREATE', '/api/v1/majors/admin/**', 'POST', 'Admin tạo ngành'),
    ('MAJOR_EDIT', '/api/v1/majors/admin/**', 'PUT', 'Admin sửa ngành'),
    ('MAJOR_DELETE', '/api/v1/majors/admin/**', 'DELETE', 'Admin xóa ngành'),
    ('ACADEMIC_COHORT_VIEW', '/api/v1/academic-cohorts/admin/**', 'GET', 'Admin xem niên khóa'),
    ('ACADEMIC_COHORT_CREATE', '/api/v1/academic-cohorts/admin/**', 'POST', 'Admin tạo niên khóa'),
    ('ACADEMIC_COHORT_EDIT', '/api/v1/academic-cohorts/admin/**', 'PUT', 'Admin sửa niên khóa'),
    ('ACADEMIC_COHORT_DELETE', '/api/v1/academic-cohorts/admin/**', 'DELETE', 'Admin xóa niên khóa'),
    ('TRAINING_PROGRAM_VIEW', '/api/v1/training-programs/admin/**', 'GET', 'Admin xem chương trình đào tạo'),
    ('TRAINING_PROGRAM_CREATE', '/api/v1/training-programs/admin/**', 'POST', 'Admin tạo chương trình đào tạo'),
    ('TRAINING_PROGRAM_EDIT', '/api/v1/training-programs/admin/**', 'PUT', 'Admin sửa chương trình đào tạo'),
    ('TRAINING_PROGRAM_DELETE', '/api/v1/training-programs/admin/**', 'DELETE', 'Admin xóa chương trình đào tạo'),
    ('SCHOOL_YEAR_VIEW', '/api/v1/school-years/admin/**', 'GET', 'Admin xem năm học'),
    ('SCHOOL_YEAR_CREATE', '/api/v1/school-years/admin/**', 'POST', 'Admin tạo năm học'),
    ('SCHOOL_YEAR_EDIT', '/api/v1/school-years/admin/**', 'PUT', 'Admin sửa năm học'),
    ('SCHOOL_YEAR_DELETE', '/api/v1/school-years/admin/**', 'DELETE', 'Admin xóa năm học'),
    ('SEMESTER_VIEW', '/api/v1/semesters/admin/**', 'GET', 'Admin xem học kỳ'),
    ('SEMESTER_CREATE', '/api/v1/semesters/admin/**', 'POST', 'Admin tạo học kỳ'),
    ('SEMESTER_EDIT', '/api/v1/semesters/admin/**', 'PUT', 'Admin sửa học kỳ'),
    ('SEMESTER_DELETE', '/api/v1/semesters/admin/**', 'DELETE', 'Admin xóa học kỳ'),
    ('CLASS_VIEW', '/api/v1/classes/admin/**', 'GET', 'Admin xem lớp hành chính'),
    ('CLASS_CREATE', '/api/v1/classes/admin/**', 'POST', 'Admin tạo lớp hành chính'),
    ('CLASS_EDIT', '/api/v1/classes/admin/**', 'PUT', 'Admin sửa lớp hành chính'),
    ('CLASS_DELETE', '/api/v1/classes/admin/**', 'DELETE', 'Admin xóa lớp hành chính'),
    ('DIVISION_VIEW', '/api/v1/divisions/admin/**', 'GET', 'Admin xem phòng ban'),
    ('DIVISION_CREATE', '/api/v1/divisions/admin/**', 'POST', 'Admin tạo phòng ban'),
    ('DIVISION_EDIT', '/api/v1/divisions/admin/**', 'PUT', 'Admin sửa phòng ban'),
    ('DIVISION_DELETE', '/api/v1/divisions/admin/**', 'DELETE', 'Admin xóa phòng ban'),
    ('POSITION_VIEW', '/api/v1/positions/admin/**', 'GET', 'Admin xem chức vụ'),
    ('POSITION_CREATE', '/api/v1/positions/admin/**', 'POST', 'Admin tạo chức vụ'),
    ('POSITION_EDIT', '/api/v1/positions/admin/**', 'PUT', 'Admin sửa chức vụ'),
    ('POSITION_DELETE', '/api/v1/positions/admin/**', 'DELETE', 'Admin xóa chức vụ'),
    ('DEGREE_VIEW', '/api/v1/degrees/admin/**', 'GET', 'Admin xem trình độ'),
    ('DEGREE_CREATE', '/api/v1/degrees/admin/**', 'POST', 'Admin tạo trình độ'),
    ('DEGREE_EDIT', '/api/v1/degrees/admin/**', 'PUT', 'Admin sửa trình độ'),
    ('DEGREE_DELETE', '/api/v1/degrees/admin/**', 'DELETE', 'Admin xóa trình độ'),
    ('CONTRACT_VIEW', '/api/v1/contracts/admin/**', 'GET', 'Admin xem hợp đồng'),
    ('CONTRACT_CREATE', '/api/v1/contracts/admin/**', 'POST', 'Admin tạo hợp đồng'),
    ('CONTRACT_EDIT', '/api/v1/contracts/admin/**', 'PUT', 'Admin sửa hợp đồng'),
    ('CONTRACT_DELETE', '/api/v1/contracts/admin/**', 'DELETE', 'Admin xóa hợp đồng')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId
      AND pa.ApiPath = src.ApiPath
      AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('Khoa', '/dashboard/admin/departments', 'building-2', 80, 1, 'DEPARTMENT_VIEW'),
    ('Ngành đào tạo', '/dashboard/admin/majors', 'book-open', 90, 1, 'MAJOR_VIEW'),
    ('Niên khóa', '/dashboard/admin/academic-cohorts', 'calendar-range', 100, 1, 'ACADEMIC_COHORT_VIEW'),
    ('Chương trình đào tạo', '/dashboard/admin/training-programs', 'graduation-cap', 110, 1, 'TRAINING_PROGRAM_VIEW'),
    ('Năm học', '/dashboard/admin/school-years', 'calendar-days', 120, 1, 'SCHOOL_YEAR_VIEW'),
    ('Học kỳ', '/dashboard/admin/semesters', 'calendar-check', 130, 1, 'SEMESTER_VIEW'),
    ('Lớp hành chính', '/dashboard/admin/classes', 'users-round', 140, 1, 'CLASS_VIEW'),
    ('Phòng ban', '/dashboard/admin/divisions', 'network', 150, 1, 'DIVISION_VIEW'),
    ('Chức vụ', '/dashboard/admin/positions', 'badge', 160, 1, 'POSITION_VIEW'),
    ('Trình độ', '/dashboard/admin/degrees', 'award', 170, 1, 'DEGREE_VIEW'),
    ('Hợp đồng', '/dashboard/admin/contracts', 'file-signature', 180, 1, 'CONTRACT_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);