INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_CLASS_VIEW', 'Xem lớp hành chính của sinh viên', 'Admin xem quan hệ sinh viên và lớp hành chính theo học kỳ', 'STUDENT_MANAGEMENT'),
    ('STUDENT_CLASS_CREATE', 'Gán lớp hành chính cho sinh viên', 'Admin gán sinh viên vào lớp hành chính theo học kỳ', 'STUDENT_MANAGEMENT'),
    ('STUDENT_CLASS_EDIT', 'Sửa lớp hành chính của sinh viên', 'Admin cập nhật quan hệ sinh viên và lớp hành chính', 'STUDENT_MANAGEMENT'),
    ('STUDENT_CLASS_DELETE', 'Xóa lớp hành chính của sinh viên', 'Admin xóa mềm quan hệ sinh viên và lớp hành chính', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_VIEW', 'Xem danh mục trạng thái sinh viên', 'Admin xem danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_CREATE', 'Tạo danh mục trạng thái sinh viên', 'Admin tạo danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_EDIT', 'Sửa danh mục trạng thái sinh viên', 'Admin cập nhật danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_CATALOG_DELETE', 'Xóa danh mục trạng thái sinh viên', 'Admin xóa mềm danh mục trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_VIEW', 'Xem lịch sử trạng thái sinh viên', 'Admin xem lịch sử trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_CREATE', 'Gán trạng thái sinh viên', 'Admin ghi nhận trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_EDIT', 'Sửa lịch sử trạng thái sinh viên', 'Admin cập nhật lịch sử trạng thái sinh viên', 'STUDENT_MANAGEMENT'),
    ('STUDENT_STATUS_HISTORY_DELETE', 'Xóa lịch sử trạng thái sinh viên', 'Admin xóa mềm lịch sử trạng thái sinh viên', 'STUDENT_MANAGEMENT')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'STUDENT_CLASS_VIEW','STUDENT_CLASS_CREATE','STUDENT_CLASS_EDIT','STUDENT_CLASS_DELETE',
    'STUDENT_STATUS_CATALOG_VIEW','STUDENT_STATUS_CATALOG_CREATE','STUDENT_STATUS_CATALOG_EDIT','STUDENT_STATUS_CATALOG_DELETE',
    'STUDENT_STATUS_HISTORY_VIEW','STUDENT_STATUS_HISTORY_CREATE','STUDENT_STATUS_HISTORY_EDIT','STUDENT_STATUS_HISTORY_DELETE'
)
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('STUDENT_CLASS_VIEW', '/api/v1/student-classes/admin/**', 'GET', 'Admin xem lớp hành chính của sinh viên'),
    ('STUDENT_CLASS_CREATE', '/api/v1/student-classes/admin/**', 'POST', 'Admin gán lớp hành chính cho sinh viên'),
    ('STUDENT_CLASS_EDIT', '/api/v1/student-classes/admin/**', 'PUT', 'Admin sửa lớp hành chính của sinh viên'),
    ('STUDENT_CLASS_DELETE', '/api/v1/student-classes/admin/**', 'DELETE', 'Admin xóa lớp hành chính của sinh viên'),
    ('STUDENT_STATUS_CATALOG_VIEW', '/api/v1/student-status-catalog/admin/**', 'GET', 'Admin xem danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_CATALOG_CREATE', '/api/v1/student-status-catalog/admin/**', 'POST', 'Admin tạo danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_CATALOG_EDIT', '/api/v1/student-status-catalog/admin/**', 'PUT', 'Admin sửa danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_CATALOG_DELETE', '/api/v1/student-status-catalog/admin/**', 'DELETE', 'Admin xóa danh mục trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_VIEW', '/api/v1/student-status-histories/admin/**', 'GET', 'Admin xem lịch sử trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_CREATE', '/api/v1/student-status-histories/admin/**', 'POST', 'Admin gán trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_EDIT', '/api/v1/student-status-histories/admin/**', 'PUT', 'Admin sửa lịch sử trạng thái sinh viên'),
    ('STUDENT_STATUS_HISTORY_DELETE', '/api/v1/student-status-histories/admin/**', 'DELETE', 'Admin xóa lịch sử trạng thái sinh viên')
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
    ('Lớp sinh viên theo học kỳ', '/dashboard/admin/student-classes', 'user-round-check', 190, 1, 'STUDENT_CLASS_VIEW'),
    ('Trạng thái sinh viên', '/dashboard/admin/student-status-catalog', 'list-checks', 200, 1, 'STUDENT_STATUS_CATALOG_VIEW'),
    ('Lịch sử trạng thái sinh viên', '/dashboard/admin/student-status-histories', 'history', 210, 1, 'STUDENT_STATUS_HISTORY_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);