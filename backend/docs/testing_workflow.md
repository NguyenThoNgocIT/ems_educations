# Kiểm thử tự động workflow nghiệp vụ

## Mục tiêu

Các workflow test dùng Spring Boot Test + Testcontainers PostgreSQL để kiểm tra nghiệp vụ trên database tạm thời, không ghi vào database dev/thật.

Hiện đã có workflow test:

| Test | Mục tiêu |
|---|---|
| `ScheduleAdjustmentWorkflowTest` | Kiểm luồng giảng viên xin nghỉ/bù, admin duyệt, sinh `TeachingSessionOverrides`, lịch tuần merge đúng giữa `Schedules` và override. |

## Cách chạy

```powershell
cd backend
.\mvnw.cmd test
```

Nếu Docker chưa chạy, các integration test dùng PostgreSQL sẽ tự `SKIPPED` để không làm fail build.

Để chạy đầy đủ:

1. Bật Docker Desktop.
2. Chạy lại:

```powershell
.\mvnw.cmd test
```

Testcontainers sẽ tự tạo PostgreSQL container, chạy Flyway ở `classpath:db/migration-postgresql`, seed dữ liệu test, chạy assert, rồi xoá dữ liệu/container sau khi kết thúc.

## Nguyên tắc thêm test mới

- Test theo workflow nghiệp vụ, không test từng endpoint rời rạc.
- Tự tạo dữ liệu cần thiết trong test, không phụ thuộc dữ liệu dev.
- Assert cả response/service result và trạng thái database sau xử lý.
- Mỗi bug nghiệp vụ sau khi sửa nên có ít nhất một test tái hiện để tránh lỗi quay lại.
