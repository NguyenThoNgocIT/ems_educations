INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('COURSE_REGISTRATION_RETAKE', 'Đăng ký học lại/cải thiện', 'Sinh viên xem lớp đủ điều kiện và đăng ký học lại hoặc cải thiện', 'COURSE_REGISTRATION')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('COURSE_REGISTRATION_RETAKE', '/api/v1/students/me/retake-improvement-registrations/**', 'GET', 'Sinh viên xem lớp học lại/cải thiện đủ điều kiện'),
    ('COURSE_REGISTRATION_RETAKE', '/api/v1/students/me/retake-improvement-registrations/**', 'POST', 'Sinh viên đăng ký học lại/cải thiện')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId AND pa.ApiPath = src.ApiPath AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code = 'COURSE_REGISTRATION_RETAKE'
WHERE r.Code = 'STUDENT'
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
  );

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, 'Đăng ký học lại/cải thiện', '/dashboard/student/retake-improvement', 'repeat-2', 45, 1, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Permissions p
WHERE p.Code = 'COURSE_REGISTRATION_RETAKE'
  AND NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = '/dashboard/student/retake-improvement');
