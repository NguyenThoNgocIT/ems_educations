
# Nhóm 1 — Lookup / Support

| ID | Method | Endpoint | Quyền | Chức năng & ghi chú |
|---|---|---|---|---|
| API-01 | GET | `/instructors/me/course-classes` | GV | Danh sách lớp GV đang phụ trách trong kỳ. Trả về tổng tiết, đã dạy, lịch cố định dạng `"T2,T4 \| Tiết 1–3 \| A201"`. Query: `semesterId` |
| API-02 | GET | `/schedules/fixed-sessions` | GV | Danh sách buổi cố định của 1 lớp để GV chọn buổi nghỉ. Trả về `scheduleId`, `date`, `dayOfWeek`, `timeSlot`, `status`. Query: `courseClassId`, `fromDate`, `toDate` |
| API-02A | GET | `/instructors/{id}/availability` | GV | **Thêm mới** — Lịch rảnh/bận của GV theo ngày, dùng khi GV chọn ngày bù trong form. Query: `date`, `semesterId`. Logic: tổng hợp từ `Schedules` + `Adjustment APPROVED` + `LeaveRequests APPROVED` → phân loại `freeSlots` / `busySlots`. API này dùng preload UX trước khi gọi validate realtime. |
| API-03 | GET | `/rooms/available` | All | Phòng trống theo ngày + tiết + sức chứa. Trừ đi phòng có lịch cố định VÀ Adjustment `PENDING/APPROVED` (tránh double booking). Query: `date`, `timeSlotId`, `minCapacity`, `buildingId` |
| API-04 | GET | `/timeslots` | All | Danh sách khung tiết active để populate dropdown. Trả về `slotCode`, `label`, `startTime`, `endTime`, `periods` |

---

# Nhóm 2 — Live Validate

| ID | Method | Endpoint | Quyền | Chức năng & ghi chú |
|---|---|---|---|---|
| API-05 | POST | `/schedule-adjustments/validate` | GV | **Đã có** — Validate realtime R1 → R8, KHÔNG tạo record. Response gồm `results[]`, `proposedSlots[]`, `proposedRooms[]`. Debounce frontend `400ms`. R9 hiện chỉ cảnh báo gần cuối học kỳ, chưa validate theo `Exams`. |

---

# Nhóm 3 — CRUD Request (GV)

| ID | Method | Endpoint | Quyền | Chức năng & ghi chú |
|---|---|---|---|---|
| API-06 | POST | `/schedule-adjustments` | GV | **Đã có** — Re-validate đầy đủ trước khi INSERT. Hỗ trợ multipart file ≤ `5MB`. Ghi log + notify admin. Status ban đầu = `PENDING`. |
| API-07 | GET | `/schedule-adjustments/my` | GV | **Đã có** — Danh sách request của GV đăng nhập. Filter: `semesterId`, `status`, `courseClassId`, `page`, `size`. Sort `createdAt desc`. Endpoint cũ `/me` vẫn giữ tương thích. |
| API-08 | GET | `/schedule-adjustments/{requestId}` | GV | **Đã có** — Chi tiết request. Chỉ GV sở hữu request được xem. Trả về validate result + reject reason nếu có. |
| API-09 | PUT | `/schedule-adjustments/{requestId}` | GV | **Đã có** — Chỉ cho sửa khi `PENDING` hoặc `RETURNED`. Sau khi submit lại chuyển `RETURNED → PENDING`. |
| API-10 | DELETE | `/schedule-adjustments/{requestId}` | GV | **Đã có** — Soft delete + trạng thái `CANCELLED`. Chỉ cho hủy request `PENDING`. |

---

# Nhóm 4 — Admin Workflow

| ID | Method | Endpoint | Quyền | Chức năng & ghi chú |
|---|---|---|---|---|
| API-11 | GET | `/admin/schedule-adjustments` | Admin | **Đã có** — Danh sách tất cả request. Có filter theo `status`, `semesterId`, `instructorId`, `requestType`, `departmentId`, `page`. Trả về thêm `validateResult`. Endpoint cũ `/schedule-adjustments/admin` vẫn giữ tương thích. |
| API-12 | POST | `/admin/schedule-adjustments/{requestId}/approve` | Admin | **Đã có** — Dùng pessimistic lock (`SELECT FOR UPDATE`), re-validate R3/R4/R5 trước khi duyệt, sinh `TeachingSessionOverrides`, rollback toàn bộ nếu lỗi. |
| API-13 | POST | `/admin/schedule-adjustments/{requestId}/reject` | Admin | **Đã có** — Bắt buộc `rejectReason/note` ≥ 10 ký tự. Status → `REJECTED`. |
| API-14 | POST | `/admin/schedule-adjustments/{requestId}/return` | Admin | **Đã có** — Bắt buộc `note` ≥ 10 ký tự. Status → `RETURNED`. |
| API-15 | POST | `/admin/schedule-adjustments/batch-approve` | Admin | **Đã có** — Trả về `successIds[]`, `failedIds[]`, `errors[]`. Mỗi item xử lý transaction riêng. |

---

# Nhóm 5 — Calendar & Progress

| ID | Method | Endpoint | Quyền | Chức năng & ghi chú |
|---|---|---|---|---|
| API-16 | GET | `/schedules/calendar` | All | **Đã có** — Lịch tháng merge giữa lịch cố định + Adjustment `APPROVED`. Trả về trạng thái `FIXED / ABSENT / MAKEUP / HOLIDAY / EXTRA`. |
| API-16A | GET | `/schedules/instructor/{id}/week` | GV | **Thêm mới** — Lịch tuần hiện tại cho dashboard/sidebar. Query: `date`, `semesterId`. Merge `Schedules` + Adjustment `APPROVED` trong tuần Monday → Sunday. |
| API-17 | GET | `/schedules/teaching-progress` | All | **Đã có** — Báo cáo tiến độ 8 cột. Tính `TotalPeriods` theo `CourseType` (`LT×15 / TH×30 / TT×45`). Alert: `ON_TRACK / BEHIND / CRITICAL`. |

---

# Nhóm 6 — Mở rộng

| ID | Method | Endpoint | Quyền | Chức năng & ghi chú |
|---|---|---|---|---|
| API-18 | POST | `/admin/schedules/{scheduleId}/mark-completed` | Admin | Đánh dấu buổi đã dạy xong. `UPDATE ScheduleStatus = COMPLETED`, lưu `ActualPeriods`, tự động cộng `TaughtPeriods`. |
| API-19 | GET | `/admin/schedule-adjustments/statistics` | Admin | Thống kê tổng hợp: số buổi nghỉ/kỳ theo khoa, GV nghỉ nhiều nhất, tỉ lệ duyệt/từ chối, thời gian xử lý trung bình. |
| API-20 | GET | `/rooms/{roomId}/schedule` | Admin | Lịch đặt phòng theo tuần dạng grid (`TimeSlot × DayOfWeek`), bao gồm Adjustment `PENDING/APPROVED`. |
| API-21 | POST | `/admin/schedule-adjustments/{requestId}/suggest-rooms` | Admin | Gợi ý top 5 phòng phù hợp dựa trên logic API-03, ưu tiên cùng tòa nhà + đủ sức chứa. |
| API-22 | GET | `/notifications/unread` | All | Lấy danh sách thông báo chưa đọc từ `UserNotifications + Notifications`. |
| API-23 | PUT | `/schedules/{scheduleId}/update-status` | All | Cập nhật realtime trạng thái `PLANNED → COMPLETED / POSTPONED / CANCELLED`. Validate role GV/Admin + ghi audit log. |
| API-24 | GET | `/students/my/schedule` | SV | SV xem lịch học merge lịch cố định + makeup approved. Ẩn `ABSENT`, highlight `MAKEUP`. |
| API-25 | GET | `/admin/instructors/{id}/workload` | Admin | Thống kê tải trọng GV: tổng tiết/tuần, số lớp, số buổi nghỉ, `% tiến độ trung bình`. Có cảnh báo vượt định mức. |
## Trạng thái triển khai hiện tại

Đã hoàn thiện trong backend:

| API | Endpoint | Trạng thái |
|---|---|---|
| API-01 | `GET /api/v1/instructors/me/course-classes` | Đã có, trả lớp học phần GV phụ trách theo học kỳ, tổng tiết, đã dạy, còn lại, lịch cố định dạng text. |
| API-02 | `GET /api/v1/schedules/fixed-sessions` | Đã có, trả buổi học cố định theo `courseClassId`, `fromDate`, `toDate`. |
| Availability | `GET /api/v1/instructors/{id}/availability` | Đã có, ghép `Schedules` + `TeachingSessionOverrides` + đơn nghỉ đã duyệt để trả `busySlots/freeSlots`. |
| API-03 | `GET /api/v1/rooms/available` | Đã có, lọc phòng trống theo ngày, ca/tiết, sức chứa, tòa nhà; loại trừ lịch gốc, override và request đang giữ phòng. |
| API-05 | `POST /api/v1/schedule-adjustments/validate` | Đã có `results`, `proposedSlots`, `proposedRooms`. R9 chỉ cảnh báo gần cuối học kỳ, chưa validate theo `Exams`. |
| API-06 | `POST /api/v1/schedule-adjustments` | Đã re-validate trước khi tạo request, trạng thái ban đầu `PENDING`. |
| API-07 | `GET /api/v1/schedule-adjustments/my` | Đã có, hỗ trợ `status`, `courseClassId`. Endpoint cũ `/me` vẫn giữ tương thích. |
| API-08 | `GET /api/v1/schedule-adjustments/{requestId}` | Đã có, chỉ giảng viên sở hữu request được xem. |
| API-09 | `PUT /api/v1/schedule-adjustments/{requestId}` | Đã có, chỉ cho sửa khi `PENDING` hoặc `RETURNED`, sau khi sửa chuyển lại `PENDING`. |
| API-10 | `DELETE /api/v1/schedule-adjustments/{requestId}` | Đã có soft delete và trạng thái `CANCELLED`, chỉ cho hủy `PENDING`. |
| API-11 | `GET /api/v1/admin/schedule-adjustments` | Đã có alias đúng chuẩn admin; endpoint cũ `/api/v1/schedule-adjustments/admin` vẫn giữ. |
| API-12 | `POST /api/v1/admin/schedule-adjustments/{requestId}/approve` | Đã có pessimistic lock, re-validate trước khi duyệt, sinh `TeachingSessionOverrides`. |
| API-13 | `POST /api/v1/admin/schedule-adjustments/{requestId}/reject` | Đã có, bắt buộc `note` tối thiểu 10 ký tự. |
| API-14 | `POST /api/v1/admin/schedule-adjustments/{requestId}/return` | Đã có, bắt buộc `note` tối thiểu 10 ký tự. |
| API-15 | `POST /api/v1/admin/schedule-adjustments/batch-approve` | Đã có response `successIds`, `failedIds`, `errors`. |
| API-16 | `GET /api/v1/schedules/calendar` | Đã có, trả lịch theo tháng đã ghép lịch gốc và override. |
| Week | `GET /api/v1/schedules/instructor/{id}/week` | Đã có, trả lịch tuần từ thứ 2 đến chủ nhật đã ghép lịch gốc và override. |
| API-17 | `GET /api/v1/schedules/teaching-progress` | Đã có, trả báo cáo tiến độ 8 cột và `alertStatus`. |
| API-19 | `GET /api/v1/admin/schedule-adjustments/statistics` | Đã có thống kê tổng số request, theo trạng thái và tỷ lệ duyệt. |

Chưa triển khai trong lượt này:

| API | Lý do |
|---|---|
| Validate theo ngày thi thực tế | Tạm thời chưa làm vì module `Exams` chưa có, R9 đang dừng ở mức cảnh báo gần cuối học kỳ như yêu cầu. |
| File đính kèm, notification/log đầy đủ | Chưa có module nền tương ứng trong backend hiện tại. |
