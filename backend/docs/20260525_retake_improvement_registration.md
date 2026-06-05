# Đăng ký học lại và học cải thiện

## Điều kiện nghiệp vụ

Đăng ký học phần trong màn hình này chỉ phục vụ:

- Học lại: sinh viên đã học học phần này và kết quả tổng kết đã chốt là `FAILED` hoặc `TotalScore < 4.0`.
- Học cải thiện: sinh viên đã học học phần này và kết quả tổng kết đã chốt là `PASSED` hoặc `TotalScore >= 4.0`.

Học phần lần đầu không đi qua API này. Học phần lần đầu do admin/phòng đào tạo gán theo chương trình đào tạo, lớp học phần và kế hoạch học kỳ.

## API cho sinh viên

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/v1/students/me/retake-improvement-registrations/options?semesterId={semesterId}` | Lấy danh sách lớp học phần đang mở mà sinh viên đủ điều kiện học lại/cải thiện. |
| POST | `/api/v1/students/me/retake-improvement-registrations` | Đăng ký một lớp học phần học lại/cải thiện. Body: `{ "courseClassId": "..." }`. |

## Validate backend

- Sinh viên phải có tài khoản liên kết với hồ sơ sinh viên.
- Lớp học phần phải active và còn chỗ (`CurrentStudent < MaxStudent` nếu có giới hạn).
- Học kỳ của lớp phải có `RegistrationPeriods` đang mở, `Status = 1`, `AllowRetake = true`.
- Học phần phải thuộc `TrainingProgramCourses` của chương trình đào tạo hiện tại của sinh viên.
- Sinh viên phải có `StudentSummaries.IsFinalized = true` cho cùng học phần.
- Không cho đăng ký cùng học phần nhiều lần trong cùng học kỳ.
- Không cho đăng ký nếu lịch học bị trùng với học phần đang active.

## Dữ liệu kiểm thử

- Test tự động: `backend/src/test/java/com/quanlydaotao/backend/workflow/RetakeImprovementRegistrationWorkflowTest.java`.
- SQL mẫu cho database dev: `backend/docs/sql/retake_improvement_sample_postgresql.sql`.

SQL mẫu tạo:

- Một sinh viên `SVRETAKEDEMO`.
- Một môn đã rớt để đăng ký học lại.
- Một môn đã qua để đăng ký học cải thiện.
- Một đợt đăng ký đang mở có `AllowRetake = true`.
- Hai lớp học phần kỳ hiện tại: `DEMO-FAIL-RETAKE`, `DEMO-PASS-IMPROVE`.
