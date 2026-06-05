# Module điểm học phần - phân quyền nhập điểm

Luồng chuẩn đang triển khai:

1. Admin/phòng đào tạo cấu hình cột điểm theo học phần tại `/api/v1/admin/grades/components`.
2. Admin phân công giảng dạy qua `TeachingAssignments`.
3. Giảng viên chỉ được nhập điểm cho `CourseClass` mà mình được phân công.
4. Admin/phòng đào tạo chốt điểm tổng kết tại `/api/v1/admin/grades/registrations/{courseRegistrationId}/finalize`.
5. Sau khi điểm đã chốt, điểm thành phần bị khóa và không được cập nhật nữa.

## API cho giảng viên

| Method | Endpoint | Query/Body | Chức năng |
|---|---|---|---|
| GET | `/api/v1/instructors/grades/course-classes` | `semesterId?` | Lấy danh sách lớp học phần giảng viên đang được phân công nhập điểm. Response có `totalStudents`, `gradedStudents`, `finalizedStudents`. |
| GET | `/api/v1/instructors/grades/course-classes/{courseClassId}/components` |  | Lấy cấu hình cột điểm của lớp học phần. Backend validate lớp này thuộc phân công của giảng viên đăng nhập. |
| GET | `/api/v1/instructors/grades/course-classes/{courseClassId}/students` |  | Lấy danh sách sinh viên trong lớp học phần, kèm điểm thành phần đã nhập và trạng thái chốt điểm. |
| GET | `/api/v1/instructors/grades/registrations/{courseRegistrationId}/component-scores` |  | Xem điểm thành phần của một lượt học. Backend kiểm tra lượt học thuộc lớp giảng viên được phân công. |
| POST | `/api/v1/instructors/grades/registrations/{courseRegistrationId}/component-scores` | `{ gradeComponentId, score, note }` | Nhập/cập nhật điểm thành phần. Chặn nếu cột điểm không thuộc học phần, điểm ngoài min/max, điểm đã khóa hoặc kết quả đã chốt. |

## API cho admin/phòng đào tạo

| Method | Endpoint | Chức năng |
|---|---|---|
| GET/POST/PUT | `/api/v1/admin/grades/components` | Quản lý cấu hình cột điểm theo học phần. |
| GET/POST | `/api/v1/admin/grades/registrations/{courseRegistrationId}/component-scores` | Admin xem hoặc nhập/cập nhật điểm khi cần xử lý nghiệp vụ đặc biệt. |
| POST | `/api/v1/admin/grades/registrations/{courseRegistrationId}/finalize` | Tính tổng điểm theo tỷ trọng, xác định thang điểm/kết quả, ghi `StudentSummaries`, khóa `StudentGrades`. |
| GET | `/api/v1/admin/grades/students/{studentId}/summaries` | Xem kết quả học phần đã chốt của sinh viên, dùng cho đăng ký học lại/cải thiện. |

FE nên tổ chức màn hình giảng viên theo thứ tự:

`Chọn học kỳ -> Danh sách lớp học phần -> Danh sách sinh viên -> Nhập điểm thành phần -> Chờ admin chốt điểm`.
