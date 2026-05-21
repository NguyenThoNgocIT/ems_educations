Tổng quan mối quan hệ các bảng
Majors (Ngành học)
  └─► TrainingPrograms (Chương trình đào tạo)
          └─► TrainingProgramCourses (Môn học trong CTĐT)
                    └─► Courses (Môn học)
                              ├─► CoursePrerequisites (Tiên quyết)
                              └─► EquivalentCourses (Tương đương)
                                        │
                              CourseClasses (Lớp học phần/kỳ)
                                        │
                         RegistrationPeriods (Đợt đăng ký)
                                        │
                         CourseRegistrations (Phiếu đăng ký)

Luồng 1 — Admin chuẩn bị đầu kỳ
Bước 1: Tạo Semester (học kỳ mới)
        │
        ▼
Bước 2: Mở CourseClasses (lớp học phần)
        │
        ├─► Chọn Course (môn học)
        ├─► Chọn Instructor (giảng viên phụ trách)
        ├─► Chọn Semester
        ├─► MaxStudents (sĩ số tối đa)
        ├─► MinStudents (sĩ số tối thiểu để mở lớp)
        └─► Status = OPEN (sẵn sàng nhận đăng ký)
        │
        ▼
Bước 3: Tạo RegistrationPeriods (đợt đăng ký)
        │
        ├─► SemesterId
        ├─► StartDate / EndDate (08:00 01/08 → 17:00 07/08)
        ├─► MinCredits = 12 / MaxCredits = 25
        ├─► AllowRetake = true/false
        ├─► TargetConfig → đối tượng sinh viên nào được đăng ký
        └─► Status = UPCOMING → OPEN → CLOSED
        │
        ▼
Bước 4: Assign TeachingAssignments + Schedules
        (phân công lịch dạy, phòng học cho từng lớp)

Luồng 2 — Sinh viên đăng ký học phần
Sinh viên login → vào trang Đăng ký học phần
        │
        ▼
GATE 1: Kiểm tra đợt đăng ký có mở không
        │
        ├─► RegistrationPeriods.Status = OPEN?          → Không: "Chưa đến đợt đăng ký"
        ├─► NOW() >= StartDate AND NOW() <= EndDate?     → Không: "Ngoài thời gian đăng ký"
        └─► StudentId có trong TargetConfig?             → Không: "Không thuộc đối tượng đợt này"
        │
        ▼
GATE 2: Kiểm tra trạng thái sinh viên
        │
        ├─► StudentStatusHistory.IsCurrent = true
        ├─► AllowRegister = true?                        → Không: "Đang bảo lưu/đình chỉ"
        └─► WarningLevel < MAX?                          → Vượt: "Cảnh báo học vụ — không được đăng ký"
        │
        ▼
Sinh viên xem danh sách CourseClasses còn mở
        │
        ├─► Lọc theo TrainingProgramCourses của Major sinh viên
        │       └─► Chỉ hiển thị môn thuộc CTĐT của ngành mình
        ├─► Hiển thị: Tên môn, Tín chỉ, Giảng viên, Lịch học, Còn chỗ
        └─► Badge: [Bình thường] [Học lại] [Cải thiện] [Đã đăng ký] [Đã hoàn thành]
        │
        ▼
Sinh viên chọn môn → nhấn [Đăng ký]
        │
        ▼
GATE 3: Validate từng môn đăng ký
        │
        ├─► A. Kiểm tra môn tiên quyết (CoursePrerequisites)
        │       │
        │       ├─► Lấy danh sách PrerequisiteCourseId của môn này
        │       ├─► Với mỗi môn tiên quyết:
        │       │       └─► Check StudentGrades/StudentSummaries
        │       │               có điểm >= điểm đạt không?
        │       ├─► Nếu chưa qua tiên quyết:
        │       │       └─► Kiểm tra EquivalentCourses
        │       │               môn tương đương đã học chưa?
        │       └─► Vẫn chưa đủ → "Chưa hoàn thành môn tiên quyết: [Tên môn]"
        │
        ├─► B. Kiểm tra đã học/đang học môn này chưa
        │       │
        │       ├─► Đã có CourseRegistration Status=CONFIRMED môn này kỳ này?
        │       │       └─► "Đã đăng ký môn này rồi"
        │       ├─► Đã có điểm đạt môn này (StudentSummaries)?
        │       │       └─► AllowRetake = false → "Đã hoàn thành môn này"
        │       │       └─► AllowRetake = true  → cho đăng ký IMPROVE
        │       └─► Điểm không đạt → cho đăng ký RETAKE
        │
        ├─► C. Kiểm tra trùng lịch học (Schedules)
        │       │
        │       ├─► Lấy tất cả Schedule của lớp muốn đăng ký
        │       ├─► So sánh với Schedule của các lớp đã đăng ký
        │       └─► Trùng DayOfWeek + TimeSlotId → "Trùng lịch với môn [Tên môn]"
        │
        ├─► D. Kiểm tra sĩ số lớp
        │       │
        │       ├─► COUNT(CourseRegistrations WHERE CourseClassId=? AND Status=CONFIRMED)
        │       ├─► >= CourseClass.MaxStudents?
        │       └─► "Lớp đã đầy — còn 0 chỗ"
        │
        └─► E. Kiểm tra tổng tín chỉ
                │
                ├─► Tính tổng tín chỉ đã đăng ký trong đợt này
                ├─► + Tín chỉ môn muốn thêm
                ├─► < MinCredits → cảnh báo (chưa đủ, không chặn)
                └─► > MaxCredits → "Vượt quá số tín chỉ tối đa (25TC)"
        │
        ▼
GATE 4: Xử lý concurrency (nhiều SV đăng ký cùng lúc)
        │
        ├─► Dùng ROWVERSION optimistic lock
        ├─► Double-check sĩ số trong transaction
        │       SELECT COUNT(*) ... WITH (UPDLOCK, ROWLOCK)
        ├─► Nếu conflict → "Lớp vừa hết chỗ — vui lòng chọn lớp khác"
        └─► Không dùng pessimistic lock → tránh deadlock khi nhiều SV
        │
        ▼
INSERT CourseRegistrations
        │
        ├─► StudentId, CourseClassId, RegistrationPeriodId
        ├─► RegistrationType = NORMAL / RETAKE / IMPROVE
        ├─► ReplacedGradeId = null (NORMAL) / gradeId (RETAKE/IMPROVE)
        ├─► RegisteredAt = NOW()
        ├─► Status = CONFIRMED
        ├─► IsPaid = false
        └─► RowVersion tự động
        │
        ▼
Cập nhật CurrentEnrollment của CourseClass
        │
        ▼
Trả về response: Đăng ký thành công

Luồng 3 — Sinh viên hủy đăng ký
Sinh viên nhấn [Hủy đăng ký] môn đã đăng ký
        │
        ▼
GATE 1: Còn trong thời gian đăng ký không?
        └─► NOW() > RegistrationPeriods.EndDate → "Hết hạn hủy đăng ký"

GATE 2: Môn này đã có điểm chưa?
        └─► Có điểm → "Không thể hủy — đã có điểm"

GATE 3: Nếu hủy thì còn đủ MinCredits không?
        └─► Tổng TC - TC môn hủy < MinCredits
            → Cảnh báo: "Sẽ dưới mức tín chỉ tối thiểu"
        │
        ▼
UPDATE CourseRegistrations
        └─► Status = CANCELLED
        └─► CurrentEnrollment của CourseClass - 1

Luồng 4 — Sau khi kết thúc đợt đăng ký
RegistrationPeriods.EndDate qua → Status = CLOSED
        │
        ▼
Hệ thống tự động (Scheduled Job):
        │
        ├─► Kiểm tra CourseClasses có đủ MinStudents không
        │       └─► < MinStudents → Status = CANCELLED
        │               → Thông báo SV lớp bị hủy
        │               → SV được đăng ký lại lớp khác (nếu có)
        │
        ├─► Tạo StudentTuition
        │       └─► Tính học phí dựa trên tổng tín chỉ đã đăng ký
        │
        └─► Gửi email xác nhận lịch học cho SV

Validate đầy đủ — Bảng tổng hợp
┌──────┬────────────────────────────────┬────────────────────────────────────┐
│ Gate │ Điều kiện kiểm tra             │ Lỗi trả về                         │
├──────┼────────────────────────────────┼────────────────────────────────────┤
│  1   │ Đợt đăng ký đang OPEN         │ Chưa/Hết đợt đăng ký               │
│  1   │ Đúng thời gian StartDate/End  │ Ngoài thời gian đăng ký            │
│  1   │ Sinh viên thuộc TargetConfig  │ Không thuộc đối tượng đợt này      │
├──────┼────────────────────────────────┼────────────────────────────────────┤
│  2   │ AllowRegister = true          │ Đang bảo lưu / đình chỉ            │
│  2   │ WarningLevel < MAX            │ Cảnh báo học vụ                    │
├──────┼────────────────────────────────┼────────────────────────────────────┤
│  3A  │ Đủ môn tiên quyết            │ Chưa hoàn thành: [Tên môn]         │
│  3A  │ Môn tương đương được công nhận│ (tự động pass nếu có equivalent)   │
│  3B  │ Chưa đăng ký môn này kỳ này  │ Đã đăng ký rồi                     │
│  3B  │ Chưa có điểm đạt (nếu NORMAL)│ Đã hoàn thành môn — dùng IMPROVE   │
│  3C  │ Không trùng lịch             │ Trùng lịch với: [Tên môn]          │
│  3D  │ Lớp chưa đầy                 │ Lớp đã đầy (còn N chỗ)            │
│  3E  │ Không vượt MaxCredits        │ Vượt tín chỉ tối đa (25TC)         │
├──────┼────────────────────────────────┼────────────────────────────────────┤
│  4   │ ROWVERSION không conflict     │ Lớp vừa hết chỗ — chọn lớp khác   │
└──────┴────────────────────────────────┴────────────────────────────────────┘

Điểm đặc biệt quan trọng
EquivalentCourses tham gia validate tiên quyết:
Môn "Lập trình OOP" yêu cầu tiên quyết "Lập trình Java cũ"
    └─► SV học chương trình mới chưa có "Java cũ"
    └─► Hệ thống check EquivalentCourses
    └─► "Lập trình Java cũ" ≡ "Lập trình Cơ bản mới"
    └─► SV đã học "Lập trình Cơ bản mới" → PASS ✅
TrainingProgramCourses lọc môn hiển thị:
SV ngành CNTT → chỉ thấy môn thuộc CTĐT ngành CNTT
SV ngành Kế toán → chỉ thấy môn thuộc CTĐT ngành Kế toán
Không bị lẫn lộn môn của ngành khác
RegistrationType ảnh hưởng tính điểm:
NORMAL  → điểm mới là điểm chính thức
RETAKE  → lấy điểm cao hơn giữa lần cũ và lần mới
IMPROVE → lấy điểm cao hơn, cập nhật StudentSummaries


mới thêm  specialization, studentspecialization , mỗi major sẽ có tương ứng tranningprogram tương ứng. có couses môn học và bổ sung thêm logic nghiệp vụ chức năng Tiến độ giảng dạy — theo dõi từng buổi dạy thực tế so với kế hoạch. Phân tích đầy đủ:
Lớp học tập  → CourseClasses.CourseClassCode
Học phần     → Courses.Name + Credits
Bắt đầu      → CourseClasses.StartDate
Kết thúc     → CourseClasses.EndDate
Tiết HP      → Tổng số tiết theo tín chỉ (15 tiết/TC)
GV_nghi      → Số buổi giảng viên vắng/nghỉ
Đã dạy       → Số buổi đã dạy thực tế
Còn          → Tiết HP - Đã dạy (còn lại phải dạy)

Quy đổi tín chỉ → số tiết
Chuẩn phòng đào tạo thường quy định:
    1 tín chỉ = 15 tiết lý thuyết
    1 tín chỉ = 30 tiết thực hành/thí nghiệm
    1 tín chỉ = 45 tiết thực tập
    3TC → 45 tiết   (3 x 15 = 45) ← lý thuyết
    2TC → 30 tiết   (2 x 15 = 30)
    1TC → 15 tiết   (1 x 15 = 15) học phần nó bao gồm CoursePrerequisites “ môn tiên quyết”,equivalent_courses (Môn tương đương)	 
  nó cũng sẽ được gán cho TrainingProgramCourses, để thực hiện chức năng đăng kí học lại học phần theo logic nghiệp vụ  Course_class Lớp học phần mở theo học kỳ semester , course_registrations ( CHI TIẾT ĐĂNG KÍ ), registration_periods ( Đợt đăng kí học phần), validate chuẩn đầy đủ cho nghiệp vụ này .sau đó Assign TeachingAssignments phân công giảng dạy + Schedules
        (phân công lịch dạy, phòng học cho từng lớp) phải kiểm tra validate đầy đủ ngày đó giảng viên xin nghỉ hoặc giảng viên phân công trùng...