INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
SELECT gen_random_uuid(), 'STAFF', 'Nhân viên hành chính', 'Quyền nhân viên hành chính', 6, TRUE, 5, '#7C3AED', TRUE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE Code = 'STAFF');