CREATE TABLE IF NOT EXISTS PasswordResetRequests (
    PasswordResetRequestId UUID NOT NULL DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL,
    RequesterCode VARCHAR(50) NOT NULL,
    EmailEdu VARCHAR(150) NOT NULL,
    PhoneNumber VARCHAR(20) NULL,
    FullName VARCHAR(150) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    AdminNote VARCHAR(255) NULL,
    ProcessedAt TIMESTAMP(3) NULL,
    ProcessedBy UUID NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy UUID NULL,
    UpdatedAt TIMESTAMP(3) NULL,
    UpdatedBy UUID NULL,
    DeletedAt TIMESTAMP(3) NULL,
    DeletedBy UUID NULL,
    CONSTRAINT PK_PasswordResetRequests PRIMARY KEY (PasswordResetRequestId),
    CONSTRAINT FK_PasswordResetRequests_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IF NOT EXISTS IX_PasswordResetRequests_Status ON PasswordResetRequests(Status);
CREATE INDEX IF NOT EXISTS IX_PasswordResetRequests_UserId ON PasswordResetRequests(UserId);