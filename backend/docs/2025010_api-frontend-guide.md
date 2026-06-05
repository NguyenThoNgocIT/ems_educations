# Tài liệu API chi tiết cho Frontend

Tài liệu này giúp FE biết:
- API nào đang có sẵn
- Dữ liệu request/response của từng API
- Màn hình nên làm tương ứng với từng nhóm API
- Cách xử lý xác thực và lỗi

## 1) Tổng quan kết nối

- Base URL (dev): `http://localhost:8081`
- Base URL (prod): `http://localhost:8082`
- Swagger UI: `/swagger-ui/index.html`
- OpenAPI JSON: `/v3/api-docs`

## 2) Xác thực và Header

- Các endpoint `/api/auth/**` đang để `permitAll` trong `SecurityConfig`.
- Tất cả endpoint khác yêu cầu JWT Bearer Token.

Header mẫu cho API cần đăng nhập:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## 3) Chuẩn response hiện tại trong backend

Backend hiện có 2 kiểu response (FE cần xử lý cả 2):

### 3.1 Kiểu bọc `ApiResponse<T>`

```json
{
  "success": true,
  "message": "Thành công",
  "data": {}
}
```

Áp dụng ở: Auth, Building, Room, TimeSlot, Schedule.

### 3.2 Kiểu trả trực tiếp DTO/List

Ví dụ:

```json
{
  "id": "uuid...",
  "studentCode": "SV001"
}
```

Áp dụng ở: Student, Lecturer, Course, CourseClass.

## 4) Chuẩn lỗi

### 4.1 Lỗi xử lý qua `GlobalExceptionHandler`

```json
{
  "status": 400,
  "message": "Nội dung lỗi",
  "code": null,
  "timestamp": "2026-05-10T10:20:30"
}
```

### 4.2 Lỗi chưa đăng nhập / token sai

Với một số trường hợp sẽ nhận HTTP `401` và message ngắn dạng `Unauthorized`.

## 5) Data Dictionary (DTO)

## 5.1 Auth DTO

### LoginRequest
- `username: string`
- `password: string`

### LoginResponse
- `accessToken: string`
- `refreshToken: string`
- `tokenType: string` (mặc định `Bearer`)
- `username: string`
- `fullName: string`
- `roles: string[]`
- `requirePasswordChange: boolean`

### AuthMeResponse
- `username: string`
- `email: string`
- `fullName: string`
- `roles: string[]`
- `requirePasswordChange: boolean`

### ChangePasswordRequest
- `oldPassword: string`
- `newPassword: string`

### RefreshTokenRequest
- `refreshToken: string`

### ForgotPasswordRequest
- `email: string`

### ResetPasswordRequest
- `email: string`

## 5.2 Student DTO

### CreateStudentRequest
- `personId: uuid`
- `studentCode: string`
- `note: string`
- `trainingProgramId: uuid`

### UpdateStudentRequest
- `note: string`
- `trainingProgramId: uuid`
- `isActive: boolean`

### StudentDto
- `id: uuid`
- `personId: uuid`
- `studentCode: string`
- `note: string`
- `trainingProgramId: uuid`
- `isActive: boolean`
- `createdAt: datetime`
- `updatedAt: datetime`

## 5.3 Lecturer DTO

### LecturerCreateRequest
- `employeeId: uuid`
- `instructorCode: string`
- `departmentId: uuid`
- `degreeId: uuid`

### LecturerUpdateRequest
- `instructorCode: string`
- `departmentId: uuid`
- `degreeId: uuid`
- `isActive: boolean`

### LecturerProfileDto  
- `id: uuid`
- `employeeId: uuid`
- `instructorCode: string`
- `departmentId: uuid`
- `degreeId: uuid`
- `employeeCode: string`
- `personId: uuid`
- `isActive: boolean`

## 5.4 Course DTO

### CourseDto
- `id: uuid`
- `departmentId: uuid`
- `code: string`
- `name: string`
- `nameEn: string`
- `courseType: string`
- `credits: number`
- `theoryHours: number`
- `practiceHours: number`
- `selfStudyHours: number`
- `internshipCredits: number`
- `description: string`
- `isActive: boolean`
- `createdAt: datetime`
- `updatedAt: datetime`

### CourseClassDto
- `id: uuid`
- `classCode: string`
- `maxStudent: number`
- `currentStudent: number`
- `roomId: uuid`
- `status: string`
- `semesterId: uuid`
- `courseId: uuid`
- `isActive: boolean`
- `createdAt: datetime`
- `updatedAt: datetime`

## 5.5 Facility DTO

### BuildingDto
- `buildingId: uuid`
- `code: string`
- `name: string`
- `address: string`
- `totalFloors: number`
- `buildingType: string`
- `description: string`
- `note: string`

### RoomDto
- `roomId: uuid`
- `code: string`
- `name: string`
- `buildingId: uuid`
- `buildingName: string`
- `floorNumber: number`
- `capacity: number`
- `type: string`
- `status: string`
- `hasProjector: boolean`
- `hasAirConditioner: boolean`
- `hasComputer: boolean`
- `description: string`

## 5.6 Scheduling DTO

### TimeSlotDto
- `timeSlotId: uuid`
- `slotCode: string`
- `startTime: time`
- `endTime: time`
- `isActive: boolean`

### ScheduleDto
- `scheduleId: uuid`
- `courseClassId: uuid`
- `courseClassName: string`
- `courseName: string`
- `instructorId: uuid`
- `instructorName: string`
- `semesterId: uuid`
- `roomId: uuid`
- `roomCode: string`
- `dayOfWeek: number`
- `date: date`
- `shift: string`
- `timeSlotId: uuid`
- `slotCode: string`
- `numberOfPeriods: number`
- `startDate: datetime`
- `endDate: datetime`
- `mode: string`
- `status: string`
- `scheduleStatus: string`
- `note: string`

## 6) Danh sách endpoint chi tiết

## 6.1 Auth (`/api/auth`)

### POST `/login`
- Request: `LoginRequest`
- Response: `ApiResponse<LoginResponse>`
- Màn hình FE: trang đăng nhập

### GET `/me`
- Request: không body
- Response: `ApiResponse<AuthMeResponse>`
- Màn hình FE: profile người dùng, header user menu

### PUT `/change-password`
- Request: `ChangePasswordRequest`
- Response: `ApiResponse<String>` (`data = null`)
- Màn hình FE: đổi mật khẩu

### POST `/logout`
- Request: không body
- Response: `ApiResponse<String>` (`data = null`)
- Màn hình FE: nút đăng xuất

### POST `/logout-all`
- Request: không body
- Response: `ApiResponse<String>` (`data = null`)
- Màn hình FE: bảo mật tài khoản (đăng xuất mọi thiết bị)

### POST `/refresh`
- Request: `RefreshTokenRequest`
- Response: `ApiResponse<String>`
- Ghi chú: hiện tại backend trả mock token (`new-jwt-token-string`)

### POST `/forgot-password`
- Request: `ForgotPasswordRequest`
- Response: `ApiResponse<String>` (`data = null`)
- Ghi chú: hiện tại đang mock

### POST `/reset-password`
- Request: `ResetPasswordRequest`
- Response: `ApiResponse<String>` (`data = null`)
- Ghi chú: hiện tại đang mock, intended cho Admin

## 6.2 Student (`/api/v1/students`)

### POST `/`
- Request: `CreateStudentRequest`
- Response: `StudentDto`
- Status: `201 Created`
- Màn hình FE: form tạo sinh viên

### GET `/{id}`
- Response: `StudentDto`
- Màn hình FE: chi tiết sinh viên

### GET `/`
- Response: `StudentDto[]`
- Màn hình FE: danh sách sinh viên (table)

### PUT `/{id}`
- Request: `UpdateStudentRequest`
- Response: `StudentDto`
- Màn hình FE: form cập nhật sinh viên

### DELETE `/{id}`
- Response: rỗng
- Status: `204 No Content`
- Màn hình FE: action xóa trên danh sách

## 6.3 Lecturer (`/api/v1/lecturers`)

### POST `/`
- Request: `LecturerCreateRequest`
- Response: `LecturerProfileDto`
- Status: `201 Created`
- Màn hình FE: form tạo giảng viên

### GET `/{id}`
- Response: `LecturerProfileDto`
- Màn hình FE: chi tiết giảng viên

### GET `/`
- Response: `LecturerProfileDto[]`
- Màn hình FE: danh sách giảng viên

### PUT `/{id}`
- Request: `LecturerUpdateRequest`
- Response: `LecturerProfileDto`
- Màn hình FE: form cập nhật giảng viên

### DELETE `/{id}`
- Response: rỗng
- Status: `204 No Content`
- Màn hình FE: action xóa trên danh sách

## 6.4 Course & CourseClass (`/api/v1/courses`)

### Course APIs

### POST `/`
- Request: `CourseDto`
- Response: `CourseDto`
- Status: `201 Created`

### GET `/{id}`
- Response: `CourseDto`

### GET `/code/{code}`
- Response: `CourseDto`

### GET `/`
- Response: `CourseDto[]`

### GET `/department/{departmentId}`
- Response: `CourseDto[]`

### PUT `/{id}`
- Request: `CourseDto`
- Response: `CourseDto`

### DELETE `/{id}`
- Response: rỗng
- Status: `204 No Content`

Màn hình FE gợi ý: danh sách môn học, form tạo/sửa môn học, filter theo khoa.

### CourseClass APIs

### POST `/classes`
- Request: `CourseClassDto`
- Response: `CourseClassDto`
- Status: `201 Created`

### GET `/classes/{id}`
- Response: `CourseClassDto`

### GET `/classes`
- Response: `CourseClassDto[]`

### GET `/{courseId}/classes`
- Response: `CourseClassDto[]`

### GET `/classes/semester/{semesterId}`
- Response: `CourseClassDto[]`

### PUT `/classes/{id}`
- Request: `CourseClassDto`
- Response: `CourseClassDto`

### DELETE `/classes/{id}`
- Response: rỗng
- Status: `204 No Content`

Màn hình FE gợi ý: danh sách lớp học phần theo môn/học kỳ, form mở lớp học phần.

## 6.5 Building (`/api/v1/buildings`)

### GET `/`
- Response: `ApiResponse<BuildingDto[]>`

### GET `/{id}`
- Response: `ApiResponse<BuildingDto>`

### POST `/`
- Request: `BuildingDto`
- Response: `ApiResponse<BuildingDto>`

### PUT `/{id}`
- Request: `BuildingDto`
- Response: `ApiResponse<BuildingDto>`

### DELETE `/{id}`
- Response: `ApiResponse<Void>`

Màn hình FE gợi ý: quản lý tòa nhà (table + create/update modal).

## 6.6 Room (`/api/v1/rooms`)

### GET `/`
- Response: `ApiResponse<RoomDto[]>`

### GET `/{id}`
- Response: `ApiResponse<RoomDto>`

### POST `/`
- Request: `RoomDto`
- Response: `ApiResponse<RoomDto>`

### PUT `/{id}`
- Request: `RoomDto`
- Response: `ApiResponse<RoomDto>`

### DELETE `/{id}`
- Response: `ApiResponse<Void>`

Màn hình FE gợi ý: quản lý phòng học, lọc theo tòa nhà/tầng/trạng thái.

## 6.7 TimeSlot (`/api/v1/time-slots`)

### GET `/`
- Response: `ApiResponse<TimeSlotDto[]>`

### GET `/{id}`
- Response: `ApiResponse<TimeSlotDto>`

### POST `/`
- Request: `TimeSlotDto`
- Response: `ApiResponse<TimeSlotDto>`

### PUT `/{id}`
- Request: `TimeSlotDto`
- Response: `ApiResponse<TimeSlotDto>`

### DELETE `/{id}`
- Response: `ApiResponse<Void>`

Màn hình FE gợi ý: quản trị ca học (khung giờ bắt đầu/kết thúc).

## 6.8 Schedule (`/api/v1/schedules`)

### GET `/`
- Response: `ApiResponse<ScheduleDto[]>`

### GET `/course-class/{id}`
- Response: `ApiResponse<ScheduleDto[]>`

### GET `/instructor/{id}`
- Response: `ApiResponse<ScheduleDto[]>`

### GET `/room/{id}`
- Response: `ApiResponse<ScheduleDto[]>`

### POST `/`
- Request: `ScheduleDto`
- Response: `ApiResponse<ScheduleDto>`

### PUT `/{id}`
- Request: `ScheduleDto`
- Response: `ApiResponse<ScheduleDto>`

### DELETE `/{id}`
- Response: `ApiResponse<Void>`

Màn hình FE gợi ý: lịch tuần/lịch tháng, lọc theo lớp học phần, giảng viên, phòng.

## 7) Mapping API -> Màn hình FE nên làm

## 7.1 Nhóm xác thực
- Login page: `POST /api/auth/login`
- User profile: `GET /api/auth/me`
- Đổi mật khẩu: `PUT /api/auth/change-password`
- Nút logout: `POST /api/auth/logout`
- Forgot password: `POST /api/auth/forgot-password`

## 7.2 Nhóm danh mục đào tạo
- Môn học: toàn bộ API `/api/v1/courses`
- Lớp học phần: toàn bộ API `/api/v1/courses/classes...`
- Sinh viên: `/api/v1/students`
- Giảng viên: `/api/v1/lecturers`

## 7.3 Nhóm cơ sở vật chất
- Tòa nhà: `/api/v1/buildings`
- Phòng học: `/api/v1/rooms`
- Ca học: `/api/v1/time-slots`

## 7.4 Nhóm thời khóa biểu
- Lịch học tổng: `GET /api/v1/schedules`
- Lịch theo lớp/giảng viên/phòng: các API filter trong `schedules`
- Tạo/sửa/xóa lịch: `POST/PUT/DELETE /api/v1/schedules`

## 8) Khuyến nghị tích hợp FE

- Tạo một API client chung có khả năng parse 2 kiểu response:
  - Có bọc: lấy dữ liệu từ `response.data.data`
  - Không bọc: lấy trực tiếp `response.data`
- Gắn interceptor tự thêm `Authorization` cho mọi endpoint ngoài `/api/auth/**`.
- Chuẩn hóa xử lý lỗi theo `status` + `message` để hiển thị toast/dialog.
- Với API mock (`refresh`, `forgot-password`, `reset-password`), FE nên hiển thị nhãn "đang mô phỏng" để tránh hiểu nhầm môi trường production.

## 9) Danh sách giao diện FE cần làm (chi tiết)

Phần này là checklist giao diện theo nghiệp vụ hiện tại của backend.

## 9.1 Nhóm xác thực

### Màn hình 01: Đăng nhập
- Route gợi ý: `/login`
- Mục tiêu: cho người dùng đăng nhập và lấy token.
- Thành phần UI:
  - Input `username`
  - Input `password`
  - Checkbox hiển thị/ẩn mật khẩu
  - Nút `Đăng nhập`
  - Link `Quên mật khẩu`
- API:
  - Submit form: `POST /api/auth/login`
  - Nếu thành công: lưu `accessToken`, `refreshToken`, `roles`, `requirePasswordChange`
- Điều hướng:
  - Nếu `requirePasswordChange = true`: chuyển sang màn đổi mật khẩu bắt buộc
  - Ngược lại: vào trang dashboard

### Màn hình 02: Hồ sơ người dùng
- Route gợi ý: `/profile`
- Mục tiêu: xem thông tin user đang đăng nhập.
- Thành phần UI:
  - `username`, `fullName`, `email`
  - Danh sách `roles`
  - Badge `requirePasswordChange`
- API:
  - Load dữ liệu: `GET /api/auth/me`

### Màn hình 03: Đổi mật khẩu
- Route gợi ý: `/change-password`
- Mục tiêu: đổi mật khẩu sau login hoặc theo nhu cầu.
- Thành phần UI:
  - Input `oldPassword`
  - Input `newPassword`
  - Input xác nhận mật khẩu mới (FE tự validate)
  - Nút `Lưu mật khẩu mới`
- API:
  - Submit: `PUT /api/auth/change-password`

### Màn hình 04: Quên mật khẩu
- Route gợi ý: `/forgot-password`
- Mục tiêu: gửi yêu cầu reset.
- Thành phần UI:
  - Input `email`
  - Nút `Gửi yêu cầu`
- API:
  - Submit: `POST /api/auth/forgot-password`
- Ghi chú: API đang mock, FE hiển thị thông báo phù hợp.

## 9.2 Nhóm sinh viên

### Màn hình 05: Danh sách sinh viên
- Route gợi ý: `/students`
- Mục tiêu: quản lý danh sách, tìm nhanh và thao tác CRUD.
- Thành phần UI:
  - Table cột: `studentCode`, `personId`, `trainingProgramId`, `isActive`, `createdAt`
  - Ô tìm kiếm theo mã sinh viên
  - Filter trạng thái active/inactive
  - Nút `Tạo mới`
  - Action mỗi dòng: `Xem`, `Sửa`, `Xóa`
- API:
  - Load list: `GET /api/v1/students`
  - Xóa: `DELETE /api/v1/students/{id}`

### Màn hình 06: Tạo sinh viên
- Route gợi ý: `/students/new`
- Thành phần UI (form):
  - `personId` (select)
  - `studentCode` (text)
  - `note` (textarea)
  - `trainingProgramId` (select)
- API:
  - Submit: `POST /api/v1/students`

### Màn hình 07: Chi tiết/Cập nhật sinh viên
- Route gợi ý: `/students/:id`
- Thành phần UI:
  - Tab thông tin chung (read-only các field định danh)
  - Form cập nhật: `note`, `trainingProgramId`, `isActive`
- API:
  - Load detail: `GET /api/v1/students/{id}`
  - Cập nhật: `PUT /api/v1/students/{id}`

## 9.3 Nhóm giảng viên

### Màn hình 08: Danh sách giảng viên
- Route gợi ý: `/lecturers`
- Table cột: `instructorCode`, `employeeCode`, `departmentId`, `degreeId`, `isActive`
- API:
  - Load list: `GET /api/v1/lecturers`
  - Xóa: `DELETE /api/v1/lecturers/{id}`

### Màn hình 09: Tạo giảng viên
- Route gợi ý: `/lecturers/new`
- Form field:
  - `employeeId`
  - `instructorCode`
  - `departmentId`
  - `degreeId`
- API:
  - Submit: `POST /api/v1/lecturers`

### Màn hình 10: Chi tiết/Cập nhật giảng viên
- Route gợi ý: `/lecturers/:id`
- API:
  - Load detail: `GET /api/v1/lecturers/{id}`
  - Cập nhật: `PUT /api/v1/lecturers/{id}`
- Form cập nhật:
  - `instructorCode`, `departmentId`, `degreeId`, `isActive`

## 9.4 Nhóm môn học và lớp học phần

### Màn hình 11: Danh sách môn học
- Route gợi ý: `/courses`
- Table cột chính:
  - `code`, `name`, `departmentId`, `courseType`, `credits`, `isActive`
- Bộ lọc:
  - Theo khoa (`departmentId`)
  - Theo mã môn (`code`)
- API:
  - Load list: `GET /api/v1/courses`
  - Filter khoa: `GET /api/v1/courses/department/{departmentId}`
  - Tìm theo mã: `GET /api/v1/courses/code/{code}`
  - Xóa: `DELETE /api/v1/courses/{id}`

### Màn hình 12: Tạo/Cập nhật môn học
- Route gợi ý: `/courses/new`, `/courses/:id/edit`
- Form field:
  - `departmentId`, `code`, `name`, `nameEn`, `courseType`
  - `credits`, `theoryHours`, `practiceHours`, `selfStudyHours`, `internshipCredits`
  - `description`, `isActive`
- API:
  - Tạo: `POST /api/v1/courses`
  - Cập nhật: `PUT /api/v1/courses/{id}`
  - Load detail khi sửa: `GET /api/v1/courses/{id}`

### Màn hình 13: Danh sách lớp học phần
- Route gợi ý: `/course-classes`
- Table cột:
  - `classCode`, `courseId`, `semesterId`, `roomId`, `maxStudent`, `currentStudent`, `status`
- Bộ lọc:
  - Theo môn: `courseId`
  - Theo học kỳ: `semesterId`
- API:
  - Tất cả: `GET /api/v1/courses/classes`
  - Theo môn: `GET /api/v1/courses/{courseId}/classes`
  - Theo học kỳ: `GET /api/v1/courses/classes/semester/{semesterId}`
  - Xóa: `DELETE /api/v1/courses/classes/{id}`

### Màn hình 14: Tạo/Cập nhật lớp học phần
- Route gợi ý: `/course-classes/new`, `/course-classes/:id/edit`
- Form field:
  - `classCode`, `courseId`, `semesterId`, `roomId`
  - `maxStudent`, `currentStudent`, `status`, `isActive`
- API:
  - Tạo: `POST /api/v1/courses/classes`
  - Cập nhật: `PUT /api/v1/courses/classes/{id}`
  - Detail: `GET /api/v1/courses/classes/{id}`

## 9.5 Nhóm cơ sở vật chất

### Màn hình 15: Quản lý tòa nhà
- Route gợi ý: `/buildings`
- Table cột:
  - `code`, `name`, `address`, `totalFloors`, `buildingType`
- API:
  - List: `GET /api/v1/buildings`
  - Detail: `GET /api/v1/buildings/{id}`
  - Create: `POST /api/v1/buildings`
  - Update: `PUT /api/v1/buildings/{id}`
  - Delete: `DELETE /api/v1/buildings/{id}`

### Màn hình 16: Quản lý phòng học
- Route gợi ý: `/rooms`
- Table cột:
  - `code`, `name`, `buildingName`, `floorNumber`, `capacity`, `type`, `status`
  - Cờ thiết bị: `hasProjector`, `hasAirConditioner`, `hasComputer`
- Bộ lọc:
  - Theo tòa nhà, tầng, loại phòng, trạng thái
- API:
  - List: `GET /api/v1/rooms`
  - Detail: `GET /api/v1/rooms/{id}`
  - Create: `POST /api/v1/rooms`
  - Update: `PUT /api/v1/rooms/{id}`
  - Delete: `DELETE /api/v1/rooms/{id}`

### Màn hình 17: Quản lý ca học
- Route gợi ý: `/time-slots`
- Table cột:
  - `slotCode`, `startTime`, `endTime`, `isActive`
- API:
  - List: `GET /api/v1/time-slots`
  - Detail: `GET /api/v1/time-slots/{id}`
  - Create: `POST /api/v1/time-slots`
  - Update: `PUT /api/v1/time-slots/{id}`
  - Delete: `DELETE /api/v1/time-slots/{id}`

## 9.6 Nhóm thời khóa biểu

### Màn hình 18: Lịch học tổng quan
- Route gợi ý: `/schedules`
- Kiểu hiển thị:
  - Calendar theo tuần
  - Table danh sách lịch
- Dữ liệu hiển thị chính:
  - `courseClassName`, `courseName`, `instructorName`, `roomCode`
  - `dayOfWeek`, `date`, `slotCode`, `numberOfPeriods`, `status`
- API:
  - List tất cả: `GET /api/v1/schedules`
  - Lọc theo lớp: `GET /api/v1/schedules/course-class/{id}`
  - Lọc theo giảng viên: `GET /api/v1/schedules/instructor/{id}`
  - Lọc theo phòng: `GET /api/v1/schedules/room/{id}`

### Màn hình 19: Tạo/Cập nhật lịch học
- Route gợi ý: `/schedules/new`, `/schedules/:id/edit`
- Form field:
  - `courseClassId`, `instructorId`, `semesterId`, `roomId`
  - `dayOfWeek`, `date`, `shift`, `timeSlotId`, `numberOfPeriods`
  - `startDate`, `endDate`, `mode`, `status`, `scheduleStatus`, `note`
- API:
  - Tạo: `POST /api/v1/schedules`
  - Cập nhật: `PUT /api/v1/schedules/{id}`
  - Xóa: `DELETE /api/v1/schedules/{id}`

## 10) Thứ tự ưu tiên làm giao diện (đề xuất)

1. Đăng nhập + interceptor token + xử lý 401.
2. Sinh viên, giảng viên, môn học (CRUD cơ bản).
3. Tòa nhà, phòng học, ca học (danh mục nền cho lịch).
4. Lớp học phần.
5. Lịch học (calendar + filter + tạo lịch).

## 11) Danh sách route FE đề xuất (1 lần nhìn là biết cần làm gì)

- `/login`
- `/forgot-password`
- `/profile`
- `/change-password`
- `/students`
- `/students/new`
- `/students/:id`
- `/lecturers`
- `/lecturers/new`
- `/lecturers/:id`
- `/courses`
- `/courses/new`
- `/courses/:id/edit`
- `/course-classes`
- `/course-classes/new`
- `/course-classes/:id/edit`
- `/buildings`
- `/rooms`
- `/time-slots`
- `/schedules`
- `/schedules/new`
- `/schedules/:id/edit`
