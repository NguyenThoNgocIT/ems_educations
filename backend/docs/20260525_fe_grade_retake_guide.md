# FE Guide - Nhập điểm, chốt điểm, đăng ký học lại/cải thiện

Tài liệu này mô tả các chức năng backend đã triển khai để FE dựng giao diện.

Mọi API đều trả về dạng chuẩn:

```json
{
  "success": true,
  "message": "Thông báo nghiệp vụ",
  "data": {}
}
```

## 1. Phân quyền và màn hình

| Role | Menu gợi ý | Chức năng |
|---|---|---|
| `LECTURER` | `/dashboard/instructor/grades` | Giảng viên xem lớp được phân công và nhập điểm thành phần. |
| `ADMIN`, `SUPER_ADMIN` | `/dashboard/admin/grades` | Admin cấu hình cột điểm, xem điểm, chốt điểm tổng kết. |
| `STUDENT` | `/dashboard/student/retake-improvement` | Sinh viên xem lớp đủ điều kiện học lại/cải thiện và đăng ký. |

## 2. Workflow tổng thể

```text
Admin cấu hình cột điểm theo học phần
        ↓
Admin phân công giảng dạy cho CourseClass
        ↓
Giảng viên nhập điểm thành phần cho sinh viên trong lớp mình phụ trách
        ↓
Admin chốt điểm tổng kết
        ↓
Backend ghi StudentSummaries và khóa StudentGrades
        ↓
Sinh viên có thể đăng ký học lại/cải thiện dựa trên StudentSummaries đã chốt
```

## 3. Giảng viên nhập điểm

Base path:

```text
/api/v1/instructors/grades
```

Yêu cầu token role `LECTURER`.

### 3.1. Lấy lớp học phần được phân công

```http
GET /api/v1/instructors/grades/course-classes?semesterId={semesterId}
```

`semesterId` không bắt buộc.

Response `data[]`:

```json
[
  {
    "courseClassId": "uuid",
    "classCode": "IT301.001",
    "courseId": "uuid",
    "courseCode": "CSDL101",
    "courseName": "Cơ sở dữ liệu",
    "semesterId": "uuid",
    "startDate": "2026-05-01",
    "endDate": "2026-08-30",
    "maxStudent": 40,
    "currentStudent": 35,
    "totalStudents": 35,
    "gradedStudents": 20,
    "finalizedStudents": 0
  }
]
```

FE gợi ý:

- Màn hình danh sách lớp: filter theo học kỳ.
- Hiển thị tiến độ nhập điểm bằng `gradedStudents / totalStudents`.
- Nếu `finalizedStudents = totalStudents`, có thể khóa UI nhập điểm hoặc hiển thị trạng thái đã chốt.

### 3.2. Lấy cấu hình cột điểm của lớp

```http
GET /api/v1/instructors/grades/course-classes/{courseClassId}/components
```

Response `data[]`:

```json
[
  {
    "gradeComponentId": "uuid",
    "courseId": "uuid",
    "componentCode": "QT",
    "componentName": "Quá trình",
    "weightPercentage": 40.00,
    "minScore": 0.00,
    "maxScore": 10.00,
    "isRequired": true,
    "inputOrder": 1,
    "description": "Điểm quá trình"
  }
]
```

FE dùng response này để render bảng điểm động theo từng học phần.

### 3.3. Lấy danh sách sinh viên và điểm trong lớp

```http
GET /api/v1/instructors/grades/course-classes/{courseClassId}/students
```

Response `data[]`:

```json
[
  {
    "studentId": "uuid",
    "studentCode": "SV001",
    "fullName": "Nguyễn Văn A",
    "courseRegistrationId": "uuid",
    "registrationStatus": 1,
    "isFinalized": false,
    "totalScore": null,
    "letterGrade": null,
    "gpaValue": null,
    "result": null,
    "componentScores": [
      {
        "courseRegistrationId": "uuid",
        "gradeComponentId": "uuid",
        "componentCode": "QT",
        "componentName": "Quá trình",
        "weightPercentage": 40.00,
        "score": 8.0,
        "isLocked": false,
        "note": "Điểm lần 1"
      }
    ]
  }
]
```

FE gợi ý:

- Render bảng: `studentCode`, `fullName`, các cột điểm động.
- Nếu `isFinalized = true`, disable input toàn dòng.
- Nếu `componentScores[].isLocked = true`, disable ô điểm tương ứng.

### 3.4. Xem điểm thành phần của một lượt học

```http
GET /api/v1/instructors/grades/registrations/{courseRegistrationId}/component-scores
```

### 3.5. Nhập/cập nhật điểm thành phần

```http
POST /api/v1/instructors/grades/registrations/{courseRegistrationId}/component-scores
```

Request:

```json
{
  "gradeComponentId": "uuid",
  "score": 8.5,
  "note": "Điểm cập nhật"
}
```

Validate backend:

- Giảng viên phải được phân công đúng `CourseClass`.
- Cột điểm phải thuộc học phần của lớp.
- Điểm nằm trong `minScore` và `maxScore`.
- Không được sửa nếu điểm thành phần đã khóa.
- Không được sửa nếu kết quả học phần đã chốt.

## 4. Admin quản lý điểm

Base path:

```text
/api/v1/admin/grades
```

Yêu cầu token role `ADMIN` hoặc `SUPER_ADMIN`.

### 4.1. Lấy cột điểm theo học phần

```http
GET /api/v1/admin/grades/components?courseId={courseId}
```

### 4.2. Tạo cột điểm

```http
POST /api/v1/admin/grades/components
```

Request:

```json
{
  "courseId": "uuid",
  "componentCode": "QT",
  "componentName": "Quá trình",
  "weightPercentage": 40,
  "minScore": 0,
  "maxScore": 10,
  "isRequired": true,
  "inputOrder": 1,
  "description": "Điểm quá trình"
}
```

### 4.3. Cập nhật cột điểm

```http
PUT /api/v1/admin/grades/components/{componentId}
```

Body giống tạo cột điểm.

### 4.4. Admin xem/nhập điểm thành phần

```http
GET  /api/v1/admin/grades/registrations/{courseRegistrationId}/component-scores
POST /api/v1/admin/grades/registrations/{courseRegistrationId}/component-scores
```

POST body giống giảng viên nhập điểm.

### 4.5. Chốt điểm tổng kết

```http
POST /api/v1/admin/grades/registrations/{courseRegistrationId}/finalize
```

Response `data`:

```json
{
  "courseRegistrationId": "uuid",
  "studentId": "uuid",
  "courseClassId": "uuid",
  "courseId": "uuid",
  "courseCode": "CSDL101",
  "courseName": "Cơ sở dữ liệu",
  "semesterId": "uuid",
  "totalScore": 7.5,
  "gradeScaleId": "uuid",
  "letterGrade": "B",
  "gpaValue": 3.0,
  "result": "PASSED",
  "isFinalized": true
}
```

Backend khi chốt:

- Kiểm tra tổng tỷ trọng cột điểm phải bằng `100`.
- Kiểm tra các cột `isRequired = true` đã có điểm.
- Tính `totalScore`.
- Tìm thang điểm trong `GradeScales`, nếu chưa có thì fallback A/B/C/D/F.
- Ghi `StudentSummaries`.
- Khóa toàn bộ `StudentGrades` của lượt học.

### 4.6. Xem điểm tổng kết

```http
GET /api/v1/admin/grades/registrations/{courseRegistrationId}/summary
GET /api/v1/admin/grades/students/{studentId}/summaries
```

## 5. Sinh viên đăng ký học lại/cải thiện

Base path:

```text
/api/v1/students/me/retake-improvement-registrations
```

Yêu cầu token role `STUDENT`.

### 5.1. Lấy danh sách lớp đủ điều kiện

```http
GET /api/v1/students/me/retake-improvement-registrations/options?semesterId={semesterId}
```

`semesterId` không bắt buộc.

Response `data[]`:

```json
[
  {
    "courseClassId": "uuid",
    "courseClassCode": "DEMO-FAIL-RETAKE",
    "courseId": "uuid",
    "courseCode": "DEMO-FAIL",
    "courseName": "Môn demo học lại",
    "semesterId": "uuid",
    "startDate": "2026-05-25",
    "endDate": "2026-07-25",
    "maxStudent": 40,
    "currentStudent": 0,
    "availableSeats": 40,
    "registrationType": 1,
    "registrationTypeName": "Học lại",
    "previousCourseRegistrationId": "uuid",
    "previousTotalScore": 3.50,
    "previousLetterGrade": "F",
    "previousResult": "FAILED",
    "canRegister": true,
    "blockedReason": null
  }
]
```

Quy ước:

| Field | Ý nghĩa |
|---|---|
| `registrationType = 1` | Học lại vì đã rớt môn hoặc tổng điểm `< 4.0`. |
| `registrationType = 2` | Học cải thiện vì đã qua môn hoặc tổng điểm `>= 4.0`. |
| `canRegister = false` | FE vẫn có thể hiển thị dòng nhưng disable nút đăng ký. |
| `blockedReason` | Lý do không cho đăng ký: lớp đầy, trùng lịch, không thuộc CTĐT, đã đăng ký trong kỳ. |

FE gợi ý:

- Chia tab: `Tất cả`, `Học lại`, `Học cải thiện`.
- Hiển thị điểm cũ: `previousTotalScore`, `previousLetterGrade`, `previousResult`.
- Nút `Đăng ký` chỉ enable khi `canRegister = true`.

### 5.2. Đăng ký lớp học phần

```http
POST /api/v1/students/me/retake-improvement-registrations
```

Request:

```json
{
  "courseClassId": "uuid"
}
```

Response `data`:

```json
{
  "courseRegistrationId": "uuid",
  "studentId": "uuid",
  "courseClassId": "uuid",
  "courseClassCode": "DEMO-FAIL-RETAKE",
  "courseId": "uuid",
  "courseCode": "DEMO-FAIL",
  "courseName": "Môn demo học lại",
  "semesterId": "uuid",
  "registrationPeriodId": "uuid",
  "registrationType": 1,
  "registrationTypeName": "Học lại",
  "replacedGradeId": "uuid",
  "registeredAt": "2026-05-25T23:30:00",
  "status": 1,
  "isPaid": false
}
```

Backend sẽ tự:

- Xác định học lại/cải thiện từ điểm cũ.
- Ghi `replacedGradeId = previous CourseRegistrationId`.
- Tăng `CourseClasses.CurrentStudent`.
- Set `status = 1`, `isPaid = false`.

## 6. Điều kiện nghiệp vụ đăng ký học lại/cải thiện

Backend chỉ cho đăng ký nếu:

- Sinh viên có hồ sơ sinh viên liên kết tài khoản.
- Lớp học phần active.
- Lớp còn chỗ nếu có `MaxStudent`.
- Học kỳ có đợt đăng ký active, `Status = 1`, `AllowRetake = true`.
- Học phần thuộc `TrainingProgramCourses` của sinh viên.
- Sinh viên đã có `StudentSummaries.IsFinalized = true` cho cùng học phần.
- Không đăng ký cùng học phần nhiều lần trong cùng học kỳ.
- Không trùng lịch với học phần đã đăng ký active.

Không dùng API này cho học phần lần đầu. Học phần lần đầu do admin/phòng đào tạo gán theo chương trình đào tạo.

## 7. Dữ liệu demo trên Neon

Đã insert dữ liệu demo:

| Dữ liệu | Giá trị |
|---|---|
| StudentCode | `SVRETAKEDEMO` |
| Username | `sv_retake_demo` |
| Môn rớt | `DEMO-FAIL` |
| Lớp học lại | `DEMO-FAIL-RETAKE` |
| Điểm cũ | `3.50`, `FAILED` |
| Môn đã qua | `DEMO-PASS` |
| Lớp cải thiện | `DEMO-PASS-IMPROVE` |
| Điểm cũ | `7.50`, `PASSED` |
| Đợt đăng ký | `RP-DEMO-CUR`, `AllowRetake = true` |

Kết quả query xác nhận:

```text
DEMO-FAIL-RETAKE | DEMO-FAIL | score=3.50 | result=FAILED | type=1 | seats=40
DEMO-PASS-IMPROVE | DEMO-PASS | score=7.50 | result=PASSED | type=2 | seats=40
```

SQL mẫu nằm tại:

```text
backend/docs/sql/retake_improvement_sample_postgresql.sql
```

## 8. Lỗi thường gặp FE cần hiển thị

Backend trả lỗi qua `ApiResponse.error(...)`. FE nên hiển thị `message`.

Một số message nghiệp vụ:

```text
Hiện không có đợt đăng ký học lại/cải thiện hợp lệ
Sinh viên đã đăng ký lớp học phần này
Lớp học phần đã đầy sinh viên
Học phần không thuộc chương trình đào tạo hiện tại của sinh viên
Sinh viên đã đăng ký học lại/cải thiện học phần này trong học kỳ
Lịch học lại/cải thiện bị trùng với học phần đã đăng ký trong học kỳ
Đăng ký học phần chỉ áp dụng cho học lại hoặc học cải thiện; học phần lần đầu do admin/phòng đào tạo gán theo chương trình đào tạo
```

## 9. Checklist màn hình FE

### Giảng viên

- Chọn học kỳ.
- Danh sách lớp học phần được phân công.
- Vào lớp, tải cấu hình cột điểm.
- Render bảng sinh viên và điểm thành phần.
- Lưu từng ô hoặc từng dòng bằng API POST component score.
- Disable input nếu điểm đã khóa hoặc đã chốt.

### Admin

- Danh sách học phần.
- Cấu hình cột điểm theo học phần.
- Xem điểm theo lượt học.
- Chốt điểm tổng kết.
- Xem kết quả học phần đã chốt của sinh viên.

### Sinh viên

- Chọn học kỳ đăng ký.
- Danh sách lớp đủ điều kiện học lại/cải thiện.
- Xem điểm cũ và loại đăng ký.
- Đăng ký lớp.
- Sau khi đăng ký thành công, refresh danh sách option và danh sách học phần đã đăng ký.
