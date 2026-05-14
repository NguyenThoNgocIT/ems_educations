# Nhật ký thay đổi & Hướng dẫn Frontend chi tiết - 13/05/2026

Tài liệu này tổng hợp toàn bộ các thay đổi về logic dữ liệu, cấu trúc DTO và các Endpoint mới được cập nhật trong ngày 13/05/2026. Đội ngũ Frontend cần thực hiện đồng bộ theo các chi tiết bên dưới.

## 1. Bảo mật & RBAC (Cơ chế Khóa Trường - Field Locking)
Backend đã áp dụng cơ chế bảo vệ dữ liệu nhạy cảm (Identity Protection).

- **API bị ảnh hưởng:** `PUT /api/auth/users/{id}` (hoặc các API cập nhật Profile).
- **Trường bị khóa:** `userId`, `email`.
- **Logic:** Khi gửi request cập nhật, backend sẽ bỏ qua hoặc báo lỗi nếu giá trị của các trường này khác với giá trị ban đầu.
- **Yêu cầu FE:** 
    - Chuyển `input` của 2 trường này sang trạng thái `disabled` hoặc `read-only`.
    - Hiển thị tooltip hoặc thông báo: *"Không thể thay đổi Mã định danh và Email sau khi đăng ký"*.
- **Giới hạn chỉnh sửa Course:** Môn học đã mở lớp (`CourseClass`) sẽ bị khóa trường `code` và `credits`.

## 2. Chi tiết cấu trúc DTO (Module Môn học)

### 2.1 CourseDto (Môn học)
Đây là cấu trúc chính dùng cho các màn hình Danh sách môn học và Form Tạo/Sửa môn học.

| Tên trường (Key) | Kiểu dữ liệu | Mô tả chi tiết | Ghi chú cập nhật |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Mã định danh nội bộ (Primary Key) | Tự động sinh |
| `departmentId` | `UUID` | ID của Khoa/Viện quản lý môn học | Bắt buộc |
| `code` | `String` | **Mã môn học** (Ví dụ: IT101, MATH02) | **Đổi từ `courseCode`** |
| `name` | `String` | **Tên môn học tiếng Việt** | **Đổi từ `courseName`** |
| `nameEn` | `String` | Tên môn học tiếng Anh | |
| `courseType` | `String` | Loại môn học (Lý thuyết, Thực hành, Đồ án) | |
| `credits` | `Double` | **Số tín chỉ** (Ví dụ: 2.0, 1.5, 3.0) | **Hỗ trợ số thập phân** |
| `theoryHours` | `Integer` | Số tiết lý thuyết thực tế | |
| `practiceHours` | `Integer` | Số tiết thực hành | |
| `selfStudyHours` | `Integer` | Số tiết tự học (thường = 2 * số tín chỉ) | |
| `internshipCredits`| `Double` | Số tín chỉ thực tập | |
| `description` | `String` | Mô tả chi tiết nội dung môn học | Nội dung dài |
| `isActive` | `Boolean` | Trạng thái hiển thị (Đang dạy/Ngừng dạy) | Mặc định: `true` |

### 2.2 CoursePrerequisiteDto (Môn học tiên quyết)
Dùng cho tính năng thiết lập lộ trình học tập giữa các môn học.

| Tên trường (Key) | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `courseId` | `UUID` | ID của môn học hiện tại (môn cần học) |
| `prerequisiteCourseId`| `UUID` | ID của môn học điều kiện (môn đã học) |
| `type` | `String` | Phân loại: `PREREQUISITE` (Tiên quyết), `PARALLEL` (Song hành) |

## 3. Danh mục API chi tiết (Endpoints) - Trạng thái: ĐÃ VERIFY ✅

### 3.1 Nhóm Quản lý Môn học (`/api/v1/courses`)

| Phương thức | Endpoint | Mô tả | Trạng thái Test |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/courses` | Lấy danh sách môn học | **PASS** ✅ |
| `POST` | `/api/v1/courses` | Tạo môn học mới | **PASS** ✅ |
| `GET` | `/api/v1/courses/{id}` | Lấy môn học theo ID | **PASS** ✅ |
| `PUT` | `/api/v1/courses/{id}` | Cập nhật môn học | **PASS** ✅ |
| `DELETE` | `/api/v1/courses/{id}` | Xóa môn học | **PASS** ✅ |
| `GET` | `/api/v1/courses/code/{code}` | Lấy môn học theo Mã | **PASS** ✅ |
| `GET` | `/api/v1/courses/department/{id}` | Môn học theo khoa | **PASS** ✅ |

- **Lấy môn học theo Mã:** `GET /api/v1/courses/code/{code}`
    - *Input:* String (VD: `IT001`)
    - *Ứng dụng:* Dùng để kiểm tra nhanh môn học khi người dùng nhập mã môn trong các form khác.
- **Lấy môn học theo Khoa:** `GET /api/v1/courses/department/{departmentId}`
    - *Ứng dụng:* Đổ dữ liệu vào bảng khi người dùng chọn Filter theo Khoa.
- **Cập nhật môn học:** `PUT /api/v1/courses/{id}`
    - *Lưu ý:* Backend đã tối ưu Mapping, FE chỉ cần gửi các trường thay đổi.

### 3.2 Nhóm Quản lý Lớp học phần (`/api/v1/courses/classes`)

- **Danh sách theo Môn:** `GET /api/v1/courses/{courseId}/classes`
    - *Màn hình:* Xem danh sách các lớp đang mở của một môn học cụ thể.
- **Danh sách theo Học kỳ:** `GET /api/v1/courses/classes/semester/{semesterId}`
    - *Màn hình:* Quản lý đăng ký học tập theo kỳ.

## 4. Hướng dẫn Tích hợp (Integration Guide)

1. **Kiểm tra Swagger:** Toàn bộ API đã được gán nhãn `@Operation`. FE hãy truy cập `http://localhost:8081/swagger-ui/index.html` để xem chi tiết ví dụ Request/Response.
2. **Xử lý số lẻ (Credits):** Khi hiển thị số tín chỉ, nên format về 1 chữ số thập phân (Ví dụ: `1.5`) thay vì số nguyên đơn thuần.
3. **Kết quả Test tự động:** Đã thực hiện test chuỗi CRUD (Tạo -> Đọc -> Xóa) trong môi trường local, tất cả các case đều trả về 200/201 OK.
4. **Module Scheduling:** Module này đã được khôi phục nguyên trạng. Các API lịch học (`/api/v1/schedules`) vẫn giữ nguyên các trường như: `dayOfWeek`, `shift`, `roomCode`.

---
## 5. Logic hoạt động hệ thống (Deep Logic)

### 5.1 Đăng ký học phần (Registration)
- **Kiểm tra Môn tiên quyết (Prerequisite):** Sinh viên phải có điểm đậu ở môn tiên quyết ($\ge 4.0$). Hệ thống truy vấn trực tiếp từ bảng điểm (StudentGrade).
- **Kiểm tra Môn song hành (Parallel):** Sinh viên phải đang đăng ký môn song hành hoặc đã hoàn thành.
- **Tự động cập nhật sĩ số:** Tự động tăng currentStudent khi đăng ký thành công.
- **Kiểm soát sĩ số tối đa:** Ngăn chặn đăng ký nếu currentStudent >= maxStudent.

### 5.2 Xung đột lịch học (Conflict Checker)
- **Xung đột phòng:** Không cho phép xếp 2 lịch trùng Phòng, Thứ, Ca học.
- **Xung đột giảng viên:** Giảng viên không thể dạy 2 nơi cùng lúc.
- **Xung đột lớp học phần:** Ngăn chặn việc xếp trùng giờ cho cùng một lớp.

### 5.3 Tự động hóa môn học (Course Automation)
- **Tự động tiết tự học:** selfStudyHours tự động được tính bằng credits * 2.
- **Soft Delete:** Các bản ghi bị xóa sẽ chỉ chuyển trạng thái isActive = false nếu có dữ liệu liên kết.
