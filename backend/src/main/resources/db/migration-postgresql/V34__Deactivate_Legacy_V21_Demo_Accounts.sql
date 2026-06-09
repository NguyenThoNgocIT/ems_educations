-- V21 contained demo accounts. Keep migration history intact, but deactivate any
-- legacy demo rows that were not normalized into the real account workflow.

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('sv2025001@donga.edu.vn'),
        ('sv2025002@donga.edu.vn'),
        ('sv2025003@donga.edu.vn'),
        ('sv2025004@donga.edu.vn'),
        ('sv2025005@donga.edu.vn'),
        ('sv2025006@donga.edu.vn'),
        ('sv2025007@donga.edu.vn'),
        ('sv2025008@donga.edu.vn'),
        ('sv2025009@donga.edu.vn'),
        ('sv2025010@donga.edu.vn'),
        ('gv01@donga.edu.vn'),
        ('gv02@donga.edu.vn'),
        ('gv03@donga.edu.vn'),
        ('gv04@donga.edu.vn'),
        ('gv05@donga.edu.vn'),
        ('gv06@donga.edu.vn'),
        ('nv01@donga.edu.vn'),
        ('nv02@donga.edu.vn'),
        ('nv03@donga.edu.vn')
),
legacy_persons AS (
    SELECT p.PersonId
    FROM Persons p
    JOIN legacy_contacts lc ON lc.contact_email = p.ContactEmail
),
legacy_users AS (
    SELECT u.UserId
    FROM Users u
    LEFT JOIN legacy_persons lp ON lp.PersonId = u.PersonId
    LEFT JOIN legacy_contacts lc ON lc.contact_email = u.Username OR lc.contact_email = u.Email
    WHERE lp.PersonId IS NOT NULL OR lc.contact_email IS NOT NULL
)
UPDATE UserRoles ur
SET IsActive = FALSE
FROM legacy_users lu
WHERE ur.UserId = lu.UserId;

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('sv2025001@donga.edu.vn'),
        ('sv2025002@donga.edu.vn'),
        ('sv2025003@donga.edu.vn'),
        ('sv2025004@donga.edu.vn'),
        ('sv2025005@donga.edu.vn'),
        ('sv2025006@donga.edu.vn'),
        ('sv2025007@donga.edu.vn'),
        ('sv2025008@donga.edu.vn'),
        ('sv2025009@donga.edu.vn'),
        ('sv2025010@donga.edu.vn'),
        ('gv01@donga.edu.vn'),
        ('gv02@donga.edu.vn'),
        ('gv03@donga.edu.vn'),
        ('gv04@donga.edu.vn'),
        ('gv05@donga.edu.vn'),
        ('gv06@donga.edu.vn'),
        ('nv01@donga.edu.vn'),
        ('nv02@donga.edu.vn'),
        ('nv03@donga.edu.vn')
)
UPDATE Users u
SET IsActive = FALSE,
    DeletedAt = COALESCE(u.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN legacy_contacts lc ON lc.contact_email = p.ContactEmail
WHERE u.PersonId = p.PersonId
   OR u.Username = lc.contact_email
   OR u.Email = lc.contact_email;

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('gv01@donga.edu.vn'),
        ('gv02@donga.edu.vn'),
        ('gv03@donga.edu.vn'),
        ('gv04@donga.edu.vn'),
        ('gv05@donga.edu.vn'),
        ('gv06@donga.edu.vn')
)
UPDATE Instructors i
SET IsActive = FALSE,
    DeletedAt = COALESCE(i.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP
FROM Employees e
JOIN Persons p ON p.PersonId = e.PersonId
JOIN legacy_contacts lc ON lc.contact_email = p.ContactEmail
WHERE i.EmployeeId = e.EmployeeId;

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('nv01@donga.edu.vn'),
        ('nv02@donga.edu.vn'),
        ('nv03@donga.edu.vn')
)
UPDATE Staffs s
SET IsActive = FALSE,
    DeletedAt = COALESCE(s.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP
FROM Employees e
JOIN Persons p ON p.PersonId = e.PersonId
JOIN legacy_contacts lc ON lc.contact_email = p.ContactEmail
WHERE s.EmployeeId = e.EmployeeId;

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('gv01@donga.edu.vn'),
        ('gv02@donga.edu.vn'),
        ('gv03@donga.edu.vn'),
        ('gv04@donga.edu.vn'),
        ('gv05@donga.edu.vn'),
        ('gv06@donga.edu.vn'),
        ('nv01@donga.edu.vn'),
        ('nv02@donga.edu.vn'),
        ('nv03@donga.edu.vn')
)
UPDATE Employees e
SET IsActive = FALSE,
    DeletedAt = COALESCE(e.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN legacy_contacts lc ON lc.contact_email = p.ContactEmail
WHERE e.PersonId = p.PersonId;

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('sv2025001@donga.edu.vn'),
        ('sv2025002@donga.edu.vn'),
        ('sv2025003@donga.edu.vn'),
        ('sv2025004@donga.edu.vn'),
        ('sv2025005@donga.edu.vn'),
        ('sv2025006@donga.edu.vn'),
        ('sv2025007@donga.edu.vn'),
        ('sv2025008@donga.edu.vn'),
        ('sv2025009@donga.edu.vn'),
        ('sv2025010@donga.edu.vn')
)
UPDATE Students s
SET IsActive = FALSE,
    DeletedAt = COALESCE(s.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP
FROM Persons p
JOIN legacy_contacts lc ON lc.contact_email = p.ContactEmail
WHERE s.PersonId = p.PersonId;

WITH legacy_contacts(contact_email) AS (
    VALUES
        ('sv2025001@donga.edu.vn'),
        ('sv2025002@donga.edu.vn'),
        ('sv2025003@donga.edu.vn'),
        ('sv2025004@donga.edu.vn'),
        ('sv2025005@donga.edu.vn'),
        ('sv2025006@donga.edu.vn'),
        ('sv2025007@donga.edu.vn'),
        ('sv2025008@donga.edu.vn'),
        ('sv2025009@donga.edu.vn'),
        ('sv2025010@donga.edu.vn'),
        ('gv01@donga.edu.vn'),
        ('gv02@donga.edu.vn'),
        ('gv03@donga.edu.vn'),
        ('gv04@donga.edu.vn'),
        ('gv05@donga.edu.vn'),
        ('gv06@donga.edu.vn'),
        ('nv01@donga.edu.vn'),
        ('nv02@donga.edu.vn'),
        ('nv03@donga.edu.vn')
)
UPDATE Persons p
SET IsActive = FALSE,
    DeletedAt = COALESCE(p.DeletedAt, CURRENT_TIMESTAMP),
    UpdatedAt = CURRENT_TIMESTAMP
FROM legacy_contacts lc
WHERE p.ContactEmail = lc.contact_email;
