IF NOT EXISTS (SELECT 1 FROM Roles WHERE Code = 'STAFF')
BEGIN
    INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
    VALUES (NEWID(), 'STAFF', N'Nhân viên hành chính', N'Quyền nhân viên hành chính', 6, 1, 5, '#7C3AED', 1, CURRENT_TIMESTAMP);
END
GO
