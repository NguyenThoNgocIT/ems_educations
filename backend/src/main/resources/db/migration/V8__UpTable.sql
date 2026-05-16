-- Bảng Positions - thêm cột Code và DivisionId
IF COL_LENGTH('Positions', 'Code') IS NULL
BEGIN
    ALTER TABLE Positions
    ADD Code NVARCHAR(50) NOT NULL UNIQUE;  -- "TP", "PP", "CV"
END
GO

IF COL_LENGTH('Positions', 'DivisionId') IS NULL
BEGIN
    ALTER TABLE Positions
    ADD DivisionId UNIQUEIDENTIFIER NULL;
    
    -- Thêm foreign key (kiểm tra xem đã tồn tại chưa)
    IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Positions_Divisions')
    BEGIN
        ALTER TABLE Positions
        ADD CONSTRAINT FK_Positions_Divisions FOREIGN KEY (DivisionId) REFERENCES Divisions(DivisionId);
    END
END
GO
-- Bảng Degrees - thêm/xóa/sửa cột
-- Xóa cột Major (nếu tồn tại)
IF COL_LENGTH('Degrees', 'Major') IS NOT NULL
BEGIN
    ALTER TABLE Degrees
    DROP COLUMN Major;
END
GO

-- Thêm cột Code
IF COL_LENGTH('Degrees', 'Code') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD Code NVARCHAR(20) NOT NULL;  -- "THS", "TS", "GS"
END
GO

-- Thêm cột Level
IF COL_LENGTH('Degrees', 'Level') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD Level INT NULL;  -- 1=CuNhan, 2=ThacSi, 3=TienSi
END
GO

-- Thêm cột AcademicRank
IF COL_LENGTH('Degrees', 'AcademicRank') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD AcademicRank NVARCHAR(20) NULL;  -- GS / PGS
END
GO

-- Thêm cột Specialization
IF COL_LENGTH('Degrees', 'Specialization') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD Specialization NVARCHAR(150) NULL;  -- Chuyên ngành
END
GO

-- Thêm cột Institution
IF COL_LENGTH('Degrees', 'Institution') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD Institution NVARCHAR(200) NULL;  -- Trường cấp bằng
END
GO

-- Thêm cột GraduationYear
IF COL_LENGTH('Degrees', 'GraduationYear') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD GraduationYear INT NULL;  -- Năm tốt nghiệp
END
GO

-- Thêm cột MajorId
IF COL_LENGTH('Degrees', 'MajorId') IS NULL
BEGIN
    ALTER TABLE Degrees
    ADD MajorId UNIQUEIDENTIFIER NULL;  -- Ngành chính FK → Majors
    
    -- Thêm foreign key
    IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Degrees_Majors')
    BEGIN
        ALTER TABLE Degrees
        ADD CONSTRAINT FK_Degrees_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
    END
END
GO
--  Bảng Employees - thêm EndWorkDate, Note, ContractType
IF COL_LENGTH('Employees', 'EndWorkDate') IS NULL
BEGIN
    ALTER TABLE Employees
    ADD EndWorkDate DATE NULL;  -- ngày nghỉ việc
END
GO

IF COL_LENGTH('Employees', 'Note') IS NULL
BEGIN
    ALTER TABLE Employees
    ADD Note NVARCHAR(255) NULL;
END
GO

IF COL_LENGTH('Employees', 'ContractType') IS NULL
BEGIN
    ALTER TABLE Employees
    ADD ContractType NVARCHAR(50) NULL;  -- FULL_TIME / PART_TIME / PROBATION
END
GO
-- Bảng Contracts - Thêm cột, ràng buộc và index
-- Thêm các cột mới
IF COL_LENGTH('Contracts', 'Allowance') IS NULL
BEGIN
    ALTER TABLE Contracts ADD Allowance DECIMAL(18,2) NULL;
END
GO

IF COL_LENGTH('Contracts', 'SignedBy') IS NULL
BEGIN
    ALTER TABLE Contracts ADD SignedBy NVARCHAR(150) NULL;
END
GO

IF COL_LENGTH('Contracts', 'AnnualLeave') IS NULL
BEGIN
    ALTER TABLE Contracts ADD AnnualLeave INT NULL DEFAULT 12;
END
GO

-- Thêm ràng buộc ContractType
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contracts_Type')
BEGIN
    ALTER TABLE Contracts ADD CONSTRAINT CK_Contracts_Type 
        CHECK (ContractType IN ('FULL_TIME', 'PART_TIME', 'PROBATION', 'SEASONAL'));
END
GO

-- Thêm ràng buộc Status
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contracts_Status')
BEGIN
    ALTER TABLE Contracts ADD CONSTRAINT CK_Contracts_Status 
        CHECK (Status IN (0, 1, 2));  -- 0=DRAFT, 1=ACTIVE, 2=EXPIRED
END
GO

-- Thêm ràng buộc ngày
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Contracts_Dates')
BEGIN
    ALTER TABLE Contracts ADD CONSTRAINT CK_Contracts_Dates
        CHECK (EffectiveDate IS NULL OR ExpiredDate IS NULL OR EffectiveDate <= ExpiredDate);
END
GO

-- Thêm index
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Contracts_EffectiveDate' AND object_id = OBJECT_ID('Contracts'))
BEGIN
    CREATE INDEX IX_Contracts_EffectiveDate ON Contracts(EffectiveDate);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Contracts_ExpiredDate' AND object_id = OBJECT_ID('Contracts'))
BEGIN
    CREATE INDEX IX_Contracts_ExpiredDate ON Contracts(ExpiredDate);
END
GO
-- Bảng EmployeeLeaveRequests - Thêm cột và ràng buộc
-- Thêm cột LeaveType
IF COL_LENGTH('EmployeeLeaveRequests', 'LeaveType') IS NULL
BEGIN
    ALTER TABLE EmployeeLeaveRequests ADD LeaveType NVARCHAR(20) NOT NULL DEFAULT 'ANNUAL';
END
GO

-- Thêm cột TotalDays
IF COL_LENGTH('EmployeeLeaveRequests', 'TotalDays') IS NULL
BEGIN
    ALTER TABLE EmployeeLeaveRequests ADD TotalDays INT NULL;
END
GO

-- Thêm cột RejectReason
IF COL_LENGTH('EmployeeLeaveRequests', 'RejectReason') IS NULL
BEGIN
    ALTER TABLE EmployeeLeaveRequests ADD RejectReason NVARCHAR(255) NULL;
END
GO

-- Thêm ràng buộc LeaveType
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_LeaveRequests_Type')
BEGIN
    ALTER TABLE EmployeeLeaveRequests ADD CONSTRAINT CK_LeaveRequests_Type 
        CHECK (LeaveType IN ('ANNUAL', 'SICK', 'MATERNITY', 'UNPAID', 'PERSONAL'));
END
GO

-- Thêm ràng buộc Status
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_LeaveRequests_Status')
BEGIN
    ALTER TABLE EmployeeLeaveRequests ADD CONSTRAINT CK_LeaveRequests_Status 
        CHECK (Status IN (0, 1, 2, 3));  -- 0=PENDING, 1=APPROVED, 2=REJECTED, 3=CANCELLED
END
GO
-- Bảng EmployeeAttendances - Thêm cột, khóa ngoại và ràng buộc
-- Thêm cột WorkingHours
IF COL_LENGTH('EmployeeAttendances', 'WorkingHours') IS NULL
BEGIN
    ALTER TABLE EmployeeAttendances ADD WorkingHours DECIMAL(4,1) NULL;
END
GO

-- Thêm cột OvertimeHours
IF COL_LENGTH('EmployeeAttendances', 'OvertimeHours') IS NULL
BEGIN
    ALTER TABLE EmployeeAttendances ADD OvertimeHours DECIMAL(4,1) NULL;
END
GO

-- Thêm cột LeaveRequestId
IF COL_LENGTH('EmployeeAttendances', 'LeaveRequestId') IS NULL
BEGIN
    ALTER TABLE EmployeeAttendances ADD LeaveRequestId UNIQUEIDENTIFIER NULL;
END
GO

-- Thêm cột UpdatedAt
IF COL_LENGTH('EmployeeAttendances', 'UpdatedAt') IS NULL
BEGIN
    ALTER TABLE EmployeeAttendances ADD UpdatedAt DATETIME2(3) NULL;
END
GO

-- Thêm cột UpdatedBy
IF COL_LENGTH('EmployeeAttendances', 'UpdatedBy') IS NULL
BEGIN
    ALTER TABLE EmployeeAttendances ADD UpdatedBy UNIQUEIDENTIFIER NULL;
END
GO

-- Thêm khóa ngoại LeaveRequestId
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_EA_LeaveRequest')
BEGIN
    ALTER TABLE EmployeeAttendances ADD CONSTRAINT FK_EA_LeaveRequest
        FOREIGN KEY (LeaveRequestId) REFERENCES EmployeeLeaveRequests(LeaveRequestId);
END
GO

-- Thêm ràng buộc Status
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Attendance_Status')
BEGIN
    ALTER TABLE EmployeeAttendances ADD CONSTRAINT CK_Attendance_Status 
        CHECK (Status IN (0, 1, 2, 3, 4));  -- 0=PRESENT, 1=ABSENT, 2=LATE, 3=LEAVE, 4=HOLIDAY
END
GO
--------
-- Xóa khóa ngoại cũ (nếu tồn tại)
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Schedules_Employees')
BEGIN
    ALTER TABLE Schedules DROP CONSTRAINT FK_Schedules_Employees;
END
GO

-- Thêm khóa ngoại mới (nếu chưa tồn tại)
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Schedules_Instructors')
BEGIN
    ALTER TABLE Schedules ADD CONSTRAINT FK_Schedules_Instructors 
        FOREIGN KEY (EmployeeId) REFERENCES Instructors(EmployeeId);
END
GO