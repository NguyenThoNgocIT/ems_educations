ALTER TABLE GradeComponents ADD COLUMN IF NOT EXISTS DeletedAt TIMESTAMP NULL;
ALTER TABLE GradeComponents ADD COLUMN IF NOT EXISTS DeletedBy UUID NULL;

ALTER TABLE StudentGrades ADD COLUMN IF NOT EXISTS DeletedAt TIMESTAMP NULL;
ALTER TABLE StudentGrades ADD COLUMN IF NOT EXISTS DeletedBy UUID NULL;

ALTER TABLE GradeScales ADD COLUMN IF NOT EXISTS DeletedAt TIMESTAMP NULL;
ALTER TABLE GradeScales ADD COLUMN IF NOT EXISTS DeletedBy UUID NULL;

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('GRADE_VIEW', 'Xem điểm học phần', 'Admin xem điểm học phần và kết quả tổng kết', 'GRADE'),
    ('GRADE_MANAGE', 'Quản lý điểm học phần', 'Admin cấu hình cột điểm, nhập điểm và chốt điểm tổng kết', 'GRADE')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('GRADE_VIEW', '/api/v1/admin/grades/**', 'GET', 'Admin xem điểm học phần'),
    ('GRADE_MANAGE', '/api/v1/admin/grades/**', 'POST', 'Admin quản lý điểm học phần'),
    ('GRADE_MANAGE', '/api/v1/admin/grades/**', 'PUT', 'Admin cập nhật điểm học phần'),
    ('GRADE_MANAGE', '/api/v1/admin/grades/**', 'DELETE', 'Admin xóa mềm cấu hình điểm')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId AND pa.ApiPath = src.ApiPath AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN ('GRADE_VIEW','GRADE_MANAGE')
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, 'Quản lý điểm học phần', '/dashboard/admin/grades', 'graduation-cap', 270, 1, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Permissions p
WHERE p.Code = 'GRADE_VIEW'
  AND NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = '/dashboard/admin/grades');
