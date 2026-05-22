-- Thêm cột CreatedBy và UpdatedBy cho bảng Classes
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Classes') AND name = 'CreatedBy')
    ALTER TABLE Classes ADD CreatedBy UNIQUEIDENTIFIER NULL;

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Classes') AND name = 'UpdatedBy')
    ALTER TABLE Classes ADD UpdatedBy UNIQUEIDENTIFIER NULL;