IF OBJECT_ID('PasswordResetRequests', 'U') IS NULL
BEGIN
    CREATE TABLE PasswordResetRequests (
        PasswordResetRequestId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_PasswordResetRequests_Id DEFAULT NEWID(),
        UserId UNIQUEIDENTIFIER NOT NULL,
        RequesterCode NVARCHAR(50) NOT NULL,
        EmailEdu NVARCHAR(150) NOT NULL,
        PhoneNumber NVARCHAR(20) NULL,
        FullName NVARCHAR(150) NOT NULL,
        Status NVARCHAR(20) NOT NULL CONSTRAINT DF_PasswordResetRequests_Status DEFAULT 'PENDING',
        AdminNote NVARCHAR(255) NULL,
        ProcessedAt DATETIME2(3) NULL,
        ProcessedBy UNIQUEIDENTIFIER NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_PasswordResetRequests_IsActive DEFAULT 1,
        CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_PasswordResetRequests_CreatedAt DEFAULT SYSDATETIME(),
        CreatedBy UNIQUEIDENTIFIER NULL,
        UpdatedAt DATETIME2(3) NULL,
        UpdatedBy UNIQUEIDENTIFIER NULL,
        DeletedAt DATETIME2(3) NULL,
        DeletedBy UNIQUEIDENTIFIER NULL,
        CONSTRAINT PK_PasswordResetRequests PRIMARY KEY (PasswordResetRequestId),
        CONSTRAINT FK_PasswordResetRequests_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );

    CREATE INDEX IX_PasswordResetRequests_Status ON PasswordResetRequests(Status);
    CREATE INDEX IX_PasswordResetRequests_UserId ON PasswordResetRequests(UserId);
END
GO
