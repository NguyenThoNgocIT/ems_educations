CREATE TABLE SchoolYears (
    SchoolYearId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(50) UNIQUE NOT NULL,
    Name NVARCHAR(100),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Description NVARCHAR(255),
    Is_active BIT DEFAULT 1 NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    created_by UNIQUEIDENTIFIER,
    updated_at DATETIME2,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER
);
GO
CREATE TABLE Semesters (
    SemesterId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    SchoolYearId UNIQUEIDENTIFIER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TINYINT DEFAULT 0 NOT NULL,
    description TEXT,
    Is_active BIT DEFAULT 1 NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    created_by UNIQUEIDENTIFIER,
    updated_at DATETIME2,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    
    CONSTRAINT FK_Semesters_SchoolYear FOREIGN KEY (SchoolYearId) REFERENCES SchoolYears(SchoolYearId),
    CONSTRAINT UK_Semester_Code UNIQUE (code),
    CONSTRAINT UK_Semester_Year_Code UNIQUE (SchoolYearId, code)
);
GO
