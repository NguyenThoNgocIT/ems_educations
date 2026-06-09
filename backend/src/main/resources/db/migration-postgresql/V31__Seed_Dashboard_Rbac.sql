INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
VALUES (
    gen_random_uuid(),
    'DASHBOARD_VIEW',
    'Xem bảng điều khiển',
    'Xem thống kê tổng quan và thống kê học tập trên dashboard quản trị',
    'DASHBOARD',
    TRUE,
    CURRENT_TIMESTAMP
)
ON CONFLICT (Code) DO NOTHING;

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, '/api/v1/dashboard/admin/**', 'GET', 'Xem thống kê dashboard quản trị', TRUE, CURRENT_TIMESTAMP
FROM Permissions p
WHERE p.Code = 'DASHBOARD_VIEW'
ON CONFLICT (PermissionId, ApiPath, HttpMethod) DO NOTHING;

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, 'Bảng điều khiển', '/dashboard/admin', 'layout-dashboard', 1, 1, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Permissions p
WHERE p.Code = 'DASHBOARD_VIEW'
  AND NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = '/dashboard/admin');

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
  AND p.Code = 'DASHBOARD_VIEW'
ON CONFLICT (RoleId, PermissionId) DO NOTHING;
