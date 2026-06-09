-- Restore the system admin account if it was changed, deactivated, or lost.
-- Temporary password: Admin@123456

INSERT INTO Persons (
    PersonId,
    FullName,
    FullNameNoAccent,
    Gender,
    DateOfBirth,
    Nationality,
    ContactEmail,
    PhoneNumber,
    PermanentAddress,
    Note,
    IsActive,
    CreatedAt
)
SELECT
    gen_random_uuid(),
    'Quản trị hệ thống',
    'admin',
    'Nam',
    DATE '1985-01-01',
    'Việt Nam',
    'admin@donga.edu.vn',
    '0906000001',
    'Đà Nẵng',
    'Tài khoản quản trị hệ thống',
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM Persons
    WHERE ContactEmail = 'admin@donga.edu.vn'
);

UPDATE Persons
SET FullName = 'Quản trị hệ thống',
    FullNameNoAccent = 'admin',
    Gender = 'Nam',
    DateOfBirth = DATE '1985-01-01',
    Nationality = 'Việt Nam',
    ContactEmail = 'admin@donga.edu.vn',
    PhoneNumber = '0906000001',
    PermanentAddress = 'Đà Nẵng',
    Note = 'Tài khoản quản trị hệ thống',
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
WHERE ContactEmail = 'admin@donga.edu.vn';

INSERT INTO Users (
    UserId,
    PersonId,
    Username,
    PasswordHash,
    Email,
    AccessFailedCount,
    LockoutEndAt,
    LockReason,
    RequirePasswordChange,
    EmailConfirmed,
    ConfirmationToken,
    IsActive,
    CreatedAt
)
SELECT
    gen_random_uuid(),
    p.PersonId,
    'admin',
    crypt('Admin@123456', gen_salt('bf', 10)),
    'admin@donga.edu.vn',
    0,
    NULL,
    NULL,
    FALSE,
    TRUE,
    NULL,
    TRUE,
    CURRENT_TIMESTAMP
FROM Persons p
WHERE p.ContactEmail = 'admin@donga.edu.vn'
  AND NOT EXISTS (
      SELECT 1
      FROM Users u
      WHERE u.PersonId = p.PersonId
         OR u.Username = 'admin'
         OR u.Email = 'admin@donga.edu.vn'
  );

UPDATE Users u
SET Username = 'admin',
    PasswordHash = crypt('Admin@123456', gen_salt('bf', 10)),
    Email = 'admin@donga.edu.vn',
    AccessFailedCount = 0,
    LockoutEndAt = NULL,
    LockReason = NULL,
    RequirePasswordChange = FALSE,
    EmailConfirmed = TRUE,
    ConfirmationToken = NULL,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
WHERE u.PersonId = p.PersonId
  AND p.ContactEmail = 'admin@donga.edu.vn';

INSERT INTO UserRoles (UserId, RoleId, CreatedAt, IsActive)
SELECT u.UserId, r.RoleId, CURRENT_TIMESTAMP, TRUE
FROM Users u
JOIN Roles r ON r.Code = 'ADMIN'
WHERE u.Username = 'admin'
ON CONFLICT (UserId, RoleId) DO UPDATE
SET IsActive = TRUE;
