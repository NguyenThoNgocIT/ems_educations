# API Điều Chỉnh Lịch Giảng Dạy Cho Frontend

Tài liệu này mô tả các API mới của module điều chỉnh lịch giảng dạy. Thiết kế hiện tại giữ `Schedules` là lịch gốc cố định, mọi nghiệp vụ nghỉ, bù, tăng tiết, đổi phòng đều đi qua `ScheduleAdjustmentRequests` và sau khi admin duyệt sẽ sinh `TeachingSessionOverrides`.

## 1. Quy Ước Chung

Base path:

```text
/api/v1/schedule-adjustments
```

Response thành công luôn bọc bằng:

```json
{
  "success": true,
  "message": "Thành công",
  "data": {}
}
```

Response lỗi:

```json
{
  "success": false,
  "message": "Phòng đề xuất đã bị đặt",
  "status": 409,
  "errorCode": "SCHEDULE_ROOM_CONFLICT",
  "timestamp": "2026-05-24T17:40:23"
}
```

Quyền:

| Nhóm người dùng | Role | API |
|---|---|---|
| Giảng viên | `LECTURER` | validate, submit, xem yêu cầu của mình |
| Admin | `ADMIN`, `SUPER_ADMIN` | xem tất cả, duyệt, từ chối, trả về |

Lưu ý cho FE: giảng viên không cần gửi `requestedByInstructorId`. Backend tự lấy giảng viên từ tài khoản đăng nhập.

## 2. Enum Dùng Trên UI

### 2.1. Loại yêu cầu `requestType`

| Giá trị | Ý nghĩa | Cần lịch gốc? | Có ngày/tiết đề xuất? |
|---|---|---:|---:|
| `ABSENT_MAKEUP` | Nghỉ một buổi và đề xuất buổi dạy bù | Có | Có |
| `EXTRA_SESSION` | Tăng tiết / học thêm một buổi mới | Không | Có |
| `RESCHEDULE` | Đổi lịch từ buổi gốc sang buổi khác | Có | Có |
| `ROOM_CHANGE` | Đổi phòng cho buổi học | Có | Có |

### 2.2. Trạng thái yêu cầu `status`

| Giá trị | Label gợi ý | Ý nghĩa UI |
|---|---|---|
| `PENDING` | Chờ duyệt | Giảng viên đã gửi, admin chưa xử lý |
| `APPROVED` | Đã duyệt | Đã sinh override lịch |
| `REJECTED` | Từ chối | Admin từ chối, không sinh override |
| `RETURNED` | Yêu cầu bổ sung | Admin trả về để giảng viên sửa/gửi lại sau |
| `CANCELLED` | Đã hủy | Dự phòng cho luồng hủy sau này |
| `CONFLICT_DETECTED` | Có xung đột | Khi admin duyệt, hệ thống kiểm tra lại và phát hiện xung đột |

### 2.3. Kết quả validate `ValidationResultDto.status`

| Giá trị | Ý nghĩa | FE nên hiển thị |
|---|---|---|
| `OK` | Rule hợp lệ | Màu xanh |
| `WARN` | Không chặn gửi nhưng cần chú ý | Màu vàng |
| `ERROR` | Lỗi chặn submit/approve | Màu đỏ |

Rule hiện có:

| Rule | Ý nghĩa |
|---|---|
| `INPUT` | Thiếu/sai dữ liệu đầu vào |
| `AUTH` | Giảng viên chưa được phân công lớp học phần |
| `R1` | Kiểm tra lịch gốc |
| `R2` | Kiểm tra buổi gốc đã có request đang xử lý chưa |
| `R3` | Kiểm tra trùng lịch giảng viên |
| `R4` | Kiểm tra đơn nghỉ đã duyệt của giảng viên |
| `R5` | Kiểm tra phòng học |
| `R6` | Kiểm tra ngày đề xuất nằm trong học kỳ |
| `R8` | Cảnh báo lớp học phần có lịch khác cùng ngày/tiết |
| `R9` | Cảnh báo gần cuối học kỳ |

## 3. DTO Dùng Chung

### 3.1. ScheduleAdjustmentValidateRequest

```json
{
  "courseClassId": "uuid",
  "originalScheduleId": "uuid|null",
  "requestType": "ABSENT_MAKEUP",
  "absentDate": "2026-06-02",
  "absentTimeSlotId": "uuid|null",
  "absentPeriods": 3,
  "proposedDate": "2026-06-05",
  "proposedTimeSlotId": "uuid",
  "proposedRoomId": "uuid|null",
  "proposedPeriods": 3
}
```

Field:

| Field | Bắt buộc | Ghi chú |
|---|---:|---|
| `courseClassId` | Có | Lớp học phần |
| `originalScheduleId` | Không | Nên gửi nếu FE chọn từ lịch gốc |
| `requestType` | Có | Một trong 4 loại ở trên |
| `absentDate` | Có với loại cần lịch gốc | Ngày nghỉ/ngày đổi |
| `absentTimeSlotId` | Có với loại cần lịch gốc | Ca/tiết của lịch gốc |
| `absentPeriods` | Có với loại cần lịch gốc | Số tiết nghỉ/đổi |
| `proposedDate` | Có | Ngày bù/ngày học thêm/ngày đổi |
| `proposedTimeSlotId` | Có | Ca/tiết đề xuất |
| `proposedRoomId` | Có nếu cần phòng | Phòng đề xuất |
| `proposedPeriods` | Có | Số tiết đề xuất |

### 3.2. ScheduleAdjustmentSubmitRequest

Giống `ScheduleAdjustmentValidateRequest`, thêm:

```json
{
  "reason": "Giảng viên tham gia hội thảo khoa, đề xuất dạy bù vào thứ 5."
}
```

### 3.3. ScheduleAdjustmentReviewRequest

```json
{
  "reviewedBy": "uuid|null",
  "note": "Đồng ý, phòng còn trống."
}
```

Lưu ý: `note` đang bắt buộc cho approve/reject/return.

### 3.4. ScheduleAdjustmentResponse

```json
{
  "requestId": "uuid",
  "courseClassId": "uuid",
  "originalScheduleId": "uuid|null",
  "requestedByInstructorId": "uuid",
  "requestType": "ABSENT_MAKEUP",
  "absentDate": "2026-06-02",
  "absentTimeSlotId": "uuid",
  "absentPeriods": 3,
  "proposedDate": "2026-06-05",
  "proposedTimeSlotId": "uuid",
  "proposedRoomId": "uuid",
  "proposedPeriods": 3,
  "reason": "Giảng viên tham gia hội thảo khoa.",
  "status": "PENDING",
  "adminNote": null,
  "reviewedBy": null,
  "reviewedAt": null,
  "isActive": true,
  "createdAt": "2026-05-24T17:00:00"
}
```

## 4. API Cho Giảng Viên

### 4.1. Kiểm Tra Tự Động Trước Khi Gửi

```http
POST /api/v1/schedule-adjustments/validate
Role: LECTURER
```

Request:

```json
{
  "courseClassId": "11111111-1111-1111-1111-111111111111",
  "originalScheduleId": "22222222-2222-2222-2222-222222222222",
  "requestType": "ABSENT_MAKEUP",
  "absentDate": "2026-06-02",
  "absentTimeSlotId": "33333333-3333-3333-3333-333333333333",
  "absentPeriods": 3,
  "proposedDate": "2026-06-05",
  "proposedTimeSlotId": "44444444-4444-4444-4444-444444444444",
  "proposedRoomId": "55555555-5555-5555-5555-555555555555",
  "proposedPeriods": 3
}
```

Response:

```json
{
  "success": true,
  "message": "Kiểm tra yêu cầu điều chỉnh lịch thành công",
  "data": {
    "valid": true,
    "results": [
      {
        "rule": "R1",
        "status": "OK",
        "message": "Tìm thấy buổi lịch gốc cần điều chỉnh"
      },
      {
        "rule": "R5",
        "status": "OK",
        "message": "Phòng đề xuất còn trống"
      },
      {
        "rule": "R9",
        "status": "WARN",
        "message": "Ngày bù gần cuối kỳ, nên thông báo sớm cho sinh viên"
      }
    ]
  }
}
```

FE gợi ý:

- Nút `Kiểm tra` gọi API này trước.
- Nếu có `ERROR`, disable nút `Gửi yêu cầu`.
- Nếu chỉ có `OK/WARN`, cho phép gửi nhưng hiển thị warning rõ.

### 4.2. Gửi Yêu Cầu Điều Chỉnh Lịch

```http
POST /api/v1/schedule-adjustments
Role: LECTURER
```

Request:

```json
{
  "courseClassId": "11111111-1111-1111-1111-111111111111",
  "originalScheduleId": "22222222-2222-2222-2222-222222222222",
  "requestType": "ABSENT_MAKEUP",
  "absentDate": "2026-06-02",
  "absentTimeSlotId": "33333333-3333-3333-3333-333333333333",
  "absentPeriods": 3,
  "proposedDate": "2026-06-05",
  "proposedTimeSlotId": "44444444-4444-4444-4444-444444444444",
  "proposedRoomId": "55555555-5555-5555-5555-555555555555",
  "proposedPeriods": 3,
  "reason": "Tham gia hội thảo khoa, đề xuất dạy bù vào thứ 5."
}
```

Response:

```json
{
  "success": true,
  "message": "Gửi yêu cầu điều chỉnh lịch thành công",
  "data": {
    "requestId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "courseClassId": "11111111-1111-1111-1111-111111111111",
    "originalScheduleId": "22222222-2222-2222-2222-222222222222",
    "requestedByInstructorId": "66666666-6666-6666-6666-666666666666",
    "requestType": "ABSENT_MAKEUP",
    "status": "PENDING",
    "reason": "Tham gia hội thảo khoa, đề xuất dạy bù vào thứ 5.",
    "createdAt": "2026-05-24T17:00:00"
  }
}
```

### 4.3. Xem Yêu Cầu Của Giảng Viên Đang Đăng Nhập

```http
GET /api/v1/schedule-adjustments/me
Role: LECTURER
```

Response:

```json
{
  "success": true,
  "message": "Lấy danh sách yêu cầu điều chỉnh lịch thành công",
  "data": [
    {
      "requestId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "courseClassId": "11111111-1111-1111-1111-111111111111",
      "requestType": "ABSENT_MAKEUP",
      "status": "PENDING",
      "proposedDate": "2026-06-05",
      "reason": "Tham gia hội thảo khoa",
      "adminNote": null
    }
  ]
}
```

FE gợi ý màn hình giảng viên:

- Tab `Tạo yêu cầu`.
- Tab `Yêu cầu của tôi`.
- Badge trạng thái theo `status`.
- Khi `RETURNED`, hiển thị `adminNote` nổi bật.

## 5. API Cho Admin

### 5.1. Tra Cứu Tất Cả Yêu Cầu

```http
GET /api/v1/schedule-adjustments/admin
Role: ADMIN, SUPER_ADMIN
```

Query params:

| Param | Bắt buộc | Ghi chú |
|---|---:|---|
| `status` | Không | `PENDING`, `APPROVED`, `REJECTED`, `RETURNED`, `CONFLICT_DETECTED` |
| `courseClassId` | Không | Lọc theo lớp học phần |
| `instructorId` | Không | Lọc theo giảng viên |

Ví dụ:

```http
GET /api/v1/schedule-adjustments/admin?status=PENDING
```

Response:

```json
{
  "success": true,
  "message": "Lấy danh sách yêu cầu điều chỉnh lịch thành công",
  "data": [
    {
      "requestId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "courseClassId": "11111111-1111-1111-1111-111111111111",
      "requestedByInstructorId": "66666666-6666-6666-6666-666666666666",
      "requestType": "ABSENT_MAKEUP",
      "status": "PENDING",
      "absentDate": "2026-06-02",
      "proposedDate": "2026-06-05",
      "reason": "Tham gia hội thảo khoa"
    }
  ]
}
```

### 5.2. Xem Yêu Cầu Của Một Giảng Viên

```http
GET /api/v1/schedule-adjustments/admin/instructor/{instructorId}
Role: ADMIN, SUPER_ADMIN
```

Response giống API danh sách.

### 5.3. Duyệt Yêu Cầu

```http
POST /api/v1/schedule-adjustments/admin/{requestId}/approve
Role: ADMIN, SUPER_ADMIN
```

Request:

```json
{
  "reviewedBy": "77777777-7777-7777-7777-777777777777",
  "note": "Đồng ý, phòng còn trống."
}
```

Response:

```json
{
  "success": true,
  "message": "Duyệt yêu cầu điều chỉnh lịch thành công",
  "data": {
    "requestId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "status": "APPROVED",
    "adminNote": "Đồng ý, phòng còn trống.",
    "reviewedBy": "77777777-7777-7777-7777-777777777777",
    "reviewedAt": "2026-05-24T17:10:00"
  }
}
```

Backend sẽ kiểm tra lại xung đột tại thời điểm duyệt. Nếu có conflict, response lỗi ví dụ:

```json
{
  "success": false,
  "message": "Yêu cầu có xung đột tại thời điểm duyệt",
  "status": 409,
  "errorCode": "CONFLICT",
  "timestamp": "2026-05-24T17:10:00"
}
```

Khi lỗi conflict lúc duyệt, request được chuyển sang `CONFLICT_DETECTED`.

### 5.4. Từ Chối Yêu Cầu

```http
POST /api/v1/schedule-adjustments/admin/{requestId}/reject
Role: ADMIN, SUPER_ADMIN
```

Request:

```json
{
  "reviewedBy": "77777777-7777-7777-7777-777777777777",
  "note": "Không đồng ý vì ngày đề xuất quá sát lịch thi."
}
```

Response data có `status = REJECTED`.

### 5.5. Trả Về Cho Giảng Viên Bổ Sung

```http
POST /api/v1/schedule-adjustments/admin/{requestId}/return
Role: ADMIN, SUPER_ADMIN
```

Request:

```json
{
  "reviewedBy": "77777777-7777-7777-7777-777777777777",
  "note": "Vui lòng chọn phòng khác hoặc ngày khác."
}
```

Response data có `status = RETURNED`.

FE gợi ý màn hình admin:

- Bảng danh sách request.
- Filter: trạng thái, giảng viên, lớp học phần.
- Drawer/modal chi tiết request.
- Khu vực kiểm tra validate hiển thị OK/WARN/ERROR nếu FE gọi lại validate tương đương bằng thông tin request.
- Action buttons:
  - `Duyệt`
  - `Từ chối`
  - `Trả về bổ sung`
- Bắt buộc nhập `note` khi xử lý.

## 6. Lookup API FE Cần Dùng Kèm

Các API này không thuộc module mới nhưng FE cần để dựng form:

| Nhu cầu UI | API hiện có gợi ý |
|---|---|
| Chọn lịch gốc theo lớp học phần | `GET /api/v1/schedules/course-class/{id}` nếu FE đang có route tương ứng trong `ScheduleController` |
| Chọn lịch theo giảng viên | `GET /api/v1/schedules/instructor/{id}` |
| Chọn phòng | `GET /api/v1/rooms` hoặc API room hiện có |
| Chọn ca/tiết | `GET /api/v1/time-slots` |
| Chọn lớp học phần | API course-class hiện có |
| Chọn giảng viên cho admin filter | `GET /api/v1/instructors/admin` |

Lưu ý: nếu frontend cần API gợi ý phòng trống theo ngày/ca hoặc gợi ý buổi bù tự động, backend hiện chưa có endpoint riêng cho lookup này. Hiện tại FE có thể gọi `/validate` sau khi người dùng chọn ngày/ca/phòng.

## 7. Luồng UI Đề Xuất

### 7.1. Giảng viên tạo yêu cầu nghỉ và bù

1. FE tải lịch gốc của giảng viên/lớp học phần.
2. Giảng viên chọn buổi gốc cần nghỉ.
3. FE điền:
   - `courseClassId`
   - `originalScheduleId`
   - `absentDate`
   - `absentTimeSlotId`
   - `absentPeriods`
4. Giảng viên chọn ngày/ca/phòng bù.
5. FE gọi `POST /validate`.
6. Nếu không có `ERROR`, FE cho gửi `POST /schedule-adjustments`.
7. Sau khi gửi, request hiện ở tab `Yêu cầu của tôi` với trạng thái `PENDING`.

### 7.2. Admin duyệt

1. Admin mở danh sách `PENDING`.
2. Xem chi tiết request.
3. Bấm `Duyệt`.
4. Backend tự kiểm tra lại xung đột.
5. Nếu thành công: request `APPROVED`, lịch override được sinh.
6. Nếu lỗi: request `CONFLICT_DETECTED`, FE reload danh sách và hiển thị lỗi.

## 8. Mapping UI Badge

```ts
const statusMap = {
  PENDING: { label: "Chờ duyệt", tone: "warning" },
  APPROVED: { label: "Đã duyệt", tone: "success" },
  REJECTED: { label: "Từ chối", tone: "danger" },
  RETURNED: { label: "Yêu cầu bổ sung", tone: "info" },
  CANCELLED: { label: "Đã hủy", tone: "muted" },
  CONFLICT_DETECTED: { label: "Có xung đột", tone: "danger" }
};
```

```ts
const requestTypeMap = {
  ABSENT_MAKEUP: "Nghỉ và dạy bù",
  EXTRA_SESSION: "Tăng tiết / học thêm",
  RESCHEDULE: "Đổi lịch",
  ROOM_CHANGE: "Đổi phòng"
};
```

## 9. Ghi Chú Kỹ Thuật

- `requestedByInstructorId` trong request của giảng viên không cần gửi; backend tự override theo user đang đăng nhập.
- `approve` luôn re-check conflict để tránh trường hợp dữ liệu thay đổi sau khi giảng viên submit.
- `Schedules` không bị sửa trực tiếp bởi approve. Lịch phát sinh nằm ở `TeachingSessionOverrides`.
- Frontend muốn hiển thị lịch cuối cùng cho sinh viên/giảng viên cần ghép lịch gốc `Schedules` với override đã duyệt. Hiện backend mới có phần lưu override, chưa có endpoint calendar tổng hợp riêng.
