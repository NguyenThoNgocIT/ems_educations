-- Flexible schedule adjustment workflow for PostgreSQL.
-- Schedules remains the fixed timetable. Absence, makeup, extra sessions and room changes are recorded here.

ALTER TABLE Schedules
    ADD COLUMN IF NOT EXISTS ScheduleType VARCHAR(30) NULL DEFAULT 'FIXED';

CREATE TABLE IF NOT EXISTS ScheduleAdjustmentRequests (
    RequestId UUID NOT NULL DEFAULT gen_random_uuid(),
    CourseClassId UUID NOT NULL,
    OriginalScheduleId UUID NULL,
    RequestedByInstructorId UUID NOT NULL,
    RequestType VARCHAR(30) NOT NULL,
    AbsentDate DATE NULL,
    AbsentTimeSlotId UUID NULL,
    AbsentPeriods INTEGER NULL,
    ProposedDate DATE NULL,
    ProposedTimeSlotId UUID NULL,
    ProposedRoomId UUID NULL,
    ProposedPeriods INTEGER NULL,
    Reason VARCHAR(500) NOT NULL,
    Status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    AdminNote VARCHAR(500) NULL,
    ReviewedBy UUID NULL,
    ReviewedAt TIMESTAMP(3) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy UUID NULL,
    UpdatedAt TIMESTAMP(3) NULL,
    UpdatedBy UUID NULL,
    DeletedAt TIMESTAMP(3) NULL,
    DeletedBy UUID NULL,
    CONSTRAINT PK_ScheduleAdjustmentRequests PRIMARY KEY (RequestId),
    CONSTRAINT FK_SAR_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
    CONSTRAINT FK_SAR_OriginalSchedules FOREIGN KEY (OriginalScheduleId) REFERENCES Schedules(ScheduleId),
    CONSTRAINT FK_SAR_RequestedBy FOREIGN KEY (RequestedByInstructorId) REFERENCES Employees(EmployeeId),
    CONSTRAINT FK_SAR_AbsentTimeSlots FOREIGN KEY (AbsentTimeSlotId) REFERENCES TimeSlots(TimeSlotId),
    CONSTRAINT FK_SAR_ProposedTimeSlots FOREIGN KEY (ProposedTimeSlotId) REFERENCES TimeSlots(TimeSlotId),
    CONSTRAINT FK_SAR_ProposedRooms FOREIGN KEY (ProposedRoomId) REFERENCES Rooms(RoomId),
    CONSTRAINT CK_SAR_RequestType CHECK (RequestType IN ('ABSENT_MAKEUP','EXTRA_SESSION','RESCHEDULE','ROOM_CHANGE')),
    CONSTRAINT CK_SAR_Status CHECK (Status IN ('PENDING','APPROVED','REJECTED','RETURNED','CANCELLED','CONFLICT_DETECTED')),
    CONSTRAINT CK_SAR_AbsentPeriods CHECK (AbsentPeriods IS NULL OR AbsentPeriods > 0),
    CONSTRAINT CK_SAR_ProposedPeriods CHECK (ProposedPeriods IS NULL OR ProposedPeriods > 0)
);

CREATE INDEX IF NOT EXISTS IX_SAR_Status
    ON ScheduleAdjustmentRequests(Status, IsActive);

CREATE INDEX IF NOT EXISTS IX_SAR_Instructor
    ON ScheduleAdjustmentRequests(RequestedByInstructorId, IsActive);

CREATE INDEX IF NOT EXISTS IX_SAR_OriginalSchedule
    ON ScheduleAdjustmentRequests(OriginalScheduleId, IsActive);

CREATE INDEX IF NOT EXISTS IX_SAR_ProposedRoomHold
    ON ScheduleAdjustmentRequests(ProposedRoomId, ProposedDate, ProposedTimeSlotId, Status, IsActive);

CREATE TABLE IF NOT EXISTS TeachingSessionOverrides (
    OverrideId UUID NOT NULL DEFAULT gen_random_uuid(),
    RequestId UUID NOT NULL,
    CourseClassId UUID NOT NULL,
    OriginalScheduleId UUID NULL,
    OriginalDate DATE NULL,
    OverrideType VARCHAR(30) NOT NULL,
    TeachingDate DATE NOT NULL,
    TimeSlotId UUID NULL,
    RoomId UUID NULL,
    InstructorId UUID NULL,
    NumberOfPeriods INTEGER NULL,
    IsVisible BOOLEAN NOT NULL DEFAULT TRUE,
    Status VARCHAR(30) NULL,
    Note VARCHAR(255) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy UUID NULL,
    UpdatedAt TIMESTAMP(3) NULL,
    UpdatedBy UUID NULL,
    DeletedAt TIMESTAMP(3) NULL,
    DeletedBy UUID NULL,
    CONSTRAINT PK_TeachingSessionOverrides PRIMARY KEY (OverrideId),
    CONSTRAINT FK_TSO_Requests FOREIGN KEY (RequestId) REFERENCES ScheduleAdjustmentRequests(RequestId),
    CONSTRAINT FK_TSO_CourseClasses FOREIGN KEY (CourseClassId) REFERENCES CourseClasses(CourseClassId),
    CONSTRAINT FK_TSO_OriginalSchedules FOREIGN KEY (OriginalScheduleId) REFERENCES Schedules(ScheduleId),
    CONSTRAINT FK_TSO_TimeSlots FOREIGN KEY (TimeSlotId) REFERENCES TimeSlots(TimeSlotId),
    CONSTRAINT FK_TSO_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId),
    CONSTRAINT FK_TSO_Instructors FOREIGN KEY (InstructorId) REFERENCES Employees(EmployeeId),
    CONSTRAINT CK_TSO_OverrideType CHECK (OverrideType IN ('CANCELLED','MAKEUP','EXTRA','RESCHEDULE','ROOM_CHANGE')),
    CONSTRAINT CK_TSO_NumberOfPeriods CHECK (NumberOfPeriods IS NULL OR NumberOfPeriods > 0)
);

CREATE INDEX IF NOT EXISTS IX_TSO_RoomDateSlot
    ON TeachingSessionOverrides(RoomId, TeachingDate, TimeSlotId, IsActive);

CREATE INDEX IF NOT EXISTS IX_TSO_InstructorDateSlot
    ON TeachingSessionOverrides(InstructorId, TeachingDate, TimeSlotId, IsActive);

CREATE INDEX IF NOT EXISTS IX_TSO_CourseClassDateSlot
    ON TeachingSessionOverrides(CourseClassId, TeachingDate, TimeSlotId, IsActive);

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('SCHEDULE_ADJUSTMENT_VIEW', 'Xem yêu cầu điều chỉnh lịch', 'Xem danh sách yêu cầu nghỉ, bù, tăng tiết và đổi lịch', 'TEACHING'),
    ('SCHEDULE_ADJUSTMENT_CREATE', 'Gửi yêu cầu điều chỉnh lịch', 'Giảng viên gửi yêu cầu nghỉ, bù, tăng tiết và đổi lịch', 'TEACHING'),
    ('SCHEDULE_ADJUSTMENT_VALIDATE', 'Kiểm tra điều chỉnh lịch', 'Tự động kiểm tra trùng lịch, phòng, học kỳ và đơn nghỉ', 'TEACHING'),
    ('SCHEDULE_ADJUSTMENT_APPROVE', 'Duyệt điều chỉnh lịch', 'Admin duyệt, từ chối hoặc trả yêu cầu điều chỉnh lịch', 'TEACHING')
) AS src(Code, Name, Description, Module)
WHERE NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = src.Code);

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('SCHEDULE_ADJUSTMENT_VALIDATE', '/api/v1/schedule-adjustments/validate', 'POST', 'Kiểm tra yêu cầu điều chỉnh lịch'),
    ('SCHEDULE_ADJUSTMENT_CREATE', '/api/v1/schedule-adjustments', 'POST', 'Gửi yêu cầu điều chỉnh lịch'),
    ('SCHEDULE_ADJUSTMENT_VIEW', '/api/v1/schedule-adjustments/me', 'GET', 'Giảng viên xem yêu cầu của mình'),
    ('SCHEDULE_ADJUSTMENT_VIEW', '/api/v1/schedule-adjustments/admin/**', 'GET', 'Admin xem yêu cầu điều chỉnh lịch'),
    ('SCHEDULE_ADJUSTMENT_APPROVE', '/api/v1/schedule-adjustments/admin/**', 'POST', 'Admin duyệt, từ chối hoặc trả yêu cầu')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
WHERE NOT EXISTS (
    SELECT 1 FROM PermissionApis pa
    WHERE pa.PermissionId = p.PermissionId
      AND pa.ApiPath = src.ApiPath
      AND pa.HttpMethod = src.HttpMethod
);

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'SCHEDULE_ADJUSTMENT_VIEW',
    'SCHEDULE_ADJUSTMENT_CREATE',
    'SCHEDULE_ADJUSTMENT_VALIDATE',
    'SCHEDULE_ADJUSTMENT_APPROVE'
)
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
  );

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'SCHEDULE_ADJUSTMENT_VIEW',
    'SCHEDULE_ADJUSTMENT_CREATE',
    'SCHEDULE_ADJUSTMENT_VALIDATE'
)
WHERE r.Code = 'LECTURER'
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
  );

INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, src.MenuTitle, src.MenuUrl, src.MenuIcon, src.OrderIndex, src.MenuType, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('Điều chỉnh lịch giảng dạy', '/dashboard/admin/schedule-adjustments', 'calendar-clock', 270, 1, 'SCHEDULE_ADJUSTMENT_VIEW'),
    ('Yêu cầu bù lịch', '/dashboard/instructor/schedule-adjustments', 'calendar-plus', 80, 1, 'SCHEDULE_ADJUSTMENT_VIEW')
) AS src(MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionCode)
JOIN Permissions p ON p.Code = src.PermissionCode
WHERE NOT EXISTS (SELECT 1 FROM Menus m WHERE m.MenuUrl = src.MenuUrl);
