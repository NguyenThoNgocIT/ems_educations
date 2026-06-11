-- Map TEACHING_PROGRESS_MANAGE permission to LECTURER role
INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code = 'TEACHING_PROGRESS_MANAGE'
WHERE r.Code = 'LECTURER'
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;
