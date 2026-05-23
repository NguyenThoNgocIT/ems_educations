ALTER TABLE Positions
    ADD COLUMN IF NOT EXISTS Code VARCHAR(50),
    ADD COLUMN IF NOT EXISTS DivisionId UUID NULL;
UPDATE Positions SET Code = 'OLD' WHERE Code IS NULL;
ALTER TABLE Positions ALTER COLUMN Code SET NOT NULL;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Positions_Divisions')) THEN
        ALTER TABLE Positions ADD CONSTRAINT FK_Positions_Divisions FOREIGN KEY (DivisionId) REFERENCES Divisions(DivisionId);
    END IF;
END $$;

ALTER TABLE Degrees DROP COLUMN IF EXISTS Major;
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS Code VARCHAR(20) NOT NULL DEFAULT 'TMP_CODE';
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS "Level" INT NULL;
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS AcademicRank VARCHAR(20) NULL;
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS Specialization VARCHAR(150) NULL;
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS Institution VARCHAR(200) NULL;
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS GraduationYear INT NULL;
ALTER TABLE Degrees ADD COLUMN IF NOT EXISTS MajorId UUID NULL;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_Degrees_Majors')) THEN
        ALTER TABLE Degrees ADD CONSTRAINT FK_Degrees_Majors FOREIGN KEY (MajorId) REFERENCES Majors(MajorId);
    END IF;
END $$;

ALTER TABLE Employees ADD COLUMN IF NOT EXISTS EndWorkDate DATE NULL;
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS Note VARCHAR(255) NULL;
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS ContractType VARCHAR(50) NULL;

ALTER TABLE Contracts ADD COLUMN IF NOT EXISTS Allowance DECIMAL(18,2) NULL;
ALTER TABLE Contracts ADD COLUMN IF NOT EXISTS SignedBy VARCHAR(150) NULL;
ALTER TABLE Contracts ADD COLUMN IF NOT EXISTS AnnualLeave INT NULL DEFAULT 12;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('CK_Contracts_Type')) THEN
        ALTER TABLE Contracts ADD CONSTRAINT CK_Contracts_Type CHECK (ContractType IN ('FULL_TIME', 'PART_TIME', 'PROBATION', 'SEASONAL'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('CK_Contracts_Status')) THEN
        ALTER TABLE Contracts ADD CONSTRAINT CK_Contracts_Status CHECK (Status IN (0, 1, 2));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('CK_Contracts_Dates')) THEN
        ALTER TABLE Contracts ADD CONSTRAINT CK_Contracts_Dates CHECK (EffectiveDate IS NULL OR ExpiredDate IS NULL OR EffectiveDate <= ExpiredDate);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS IX_Contracts_EffectiveDate ON Contracts(EffectiveDate);
CREATE INDEX IF NOT EXISTS IX_Contracts_ExpiredDate ON Contracts(ExpiredDate);

ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS LeaveType VARCHAR(20) NOT NULL DEFAULT 'ANNUAL';
ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS TotalDays INT NULL;
ALTER TABLE EmployeeLeaveRequests ADD COLUMN IF NOT EXISTS RejectReason VARCHAR(255) NULL;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('CK_LeaveRequests_Type')) THEN
        ALTER TABLE EmployeeLeaveRequests ADD CONSTRAINT CK_LeaveRequests_Type CHECK (LeaveType IN ('ANNUAL', 'SICK', 'MATERNITY', 'UNPAID', 'PERSONAL'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('CK_LeaveRequests_Status')) THEN
        ALTER TABLE EmployeeLeaveRequests ADD CONSTRAINT CK_LeaveRequests_Status CHECK (Status IN (0, 1, 2, 3));
    END IF;
END $$;

ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS WorkingHours DECIMAL(4,1) NULL;
ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS OvertimeHours DECIMAL(4,1) NULL;
ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS LeaveRequestId UUID NULL;
ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS UpdatedAt TIMESTAMP(3) NULL;
ALTER TABLE EmployeeAttendances ADD COLUMN IF NOT EXISTS UpdatedBy UUID NULL;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('FK_EA_LeaveRequest')) THEN
        ALTER TABLE EmployeeAttendances ADD CONSTRAINT FK_EA_LeaveRequest FOREIGN KEY (LeaveRequestId) REFERENCES EmployeeLeaveRequests(LeaveRequestId);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE lower(conname) = lower('CK_Attendance_Status')) THEN
        ALTER TABLE EmployeeAttendances ADD CONSTRAINT CK_Attendance_Status CHECK (Status IN (0, 1, 2, 3, 4));
    END IF;
END $$;