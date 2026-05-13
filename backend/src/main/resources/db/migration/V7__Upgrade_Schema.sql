-- =====================================================
-- 9. STUDENTS (add AdmissionDate)
-- =====================================================
IF COL_LENGTH('Students', 'AdmissionDate') IS NULL
BEGIN
ALTER TABLE Students ADD AdmissionDate DATE NULL;
END;

-- =====================================================
-- 10. USERS (add EmailConfirmed and ConfirmationToken)
-- =====================================================
IF COL_LENGTH('Users', 'EmailConfirmed') IS NULL
BEGIN
ALTER TABLE Users ADD EmailConfirmed BIT NOT NULL DEFAULT 0;
END;

IF COL_LENGTH('Users', 'ConfirmationToken') IS NULL
BEGIN
ALTER TABLE Users ADD ConfirmationToken NVARCHAR(255) NULL;
END;

-- =====================================================
-- 11. PERSONS (add FullNameNoAccent)
-- =====================================================
IF COL_LENGTH('Persons', 'FullNameNoAccent') IS NULL
BEGIN
ALTER TABLE Persons ADD FullNameNoAccent NVARCHAR(150) NULL;
END;

-- =====================================================
-- 12. EMPLOYEES (add EmployeeType)
-- =====================================================
IF COL_LENGTH('Employees', 'EmployeeType') IS NULL
BEGIN
ALTER TABLE Employees ADD EmployeeType NVARCHAR(20) NULL;
END;