INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('GRADE_INPUT', 'Nhập điểm giảng viên', 'Giảng viên xem lớp được phân công và nhập điểm thành phần', 'GRADE')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('GRADE_INPUT', '/api/v1/instructors/grades/**', 'GET', 'Giảng viên xem dữ liệu nhập điểm'),
    ('GRADE_INPUT', '/api/v1/instructors/grades/**', 'POST', 'Giảng viên nhập hoặc cập nhật điểm thành phần')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId AND pa.ApiPath = src.ApiPath AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code = 'GRADE_INPUT'
WHERE r.Code = 'LECTURER'
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
  );

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, 'Nhập điểm', '/dashboard/instructor/grades', 'clipboard-check', 40, 1, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Permissions p
WHERE p.Code = 'GRADE_INPUT'
  AND NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = '/dashboard/instructor/grades');
