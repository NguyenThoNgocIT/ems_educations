# UEMS Project AI Rules & Standards

Chào mừng AI Assistant! Đây là hướng dẫn tiêu chuẩn cho dự án Xây dựng hệ thống phần mềm quản lý hoạt động đào tạo – Web API (Spring Boot, SQL Server, …)
– Web Admin phục vụ quản lý đào tạo – Web Client phục vụ người học / đào tạo cho trường đại học. UEMS (University Education Management System). Hãy tuân thủ các quy tắc này để viết code đồng nhất và chất lượng cao.

## 🚀 1. Tổng quan Dự án

- **Công nghệ:** Java 17, Spring Boot 3.3.5, MS SQL Server, Spring Data JPA.
- **Quản lý DB:** Flyway (tất cả thay đổi DB phải qua file migration `.sql`).
- **Phân quyền:** JWT + Spring Security (RBAC).
- Tất cả controller đều phải qua middelware được bảo về bởi JWT Spring Security đã được cấu hình trong thư mục E:\Downloads\quanlydaotao-main\backend\src\main\java\com\quanlydaotao\backend\infrastructure\security
  E:\Downloads\quanlydaotao-main\backend\src\main\java\com\quanlydaotao\backend\common\config\SecurityConfig.java

## 🛠 2. Tiêu chuẩn viết Entity

- **ID:** Luôn sử dụng `UUID` cho tất cả các Primary Key.
- **Kế thừa:** Mọi Entity (trừ bảng trung gian) phải kế thừa `com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity`.
- **Annotation:**
  - Sử dụng `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor` từ Lombok.
  - Sử dụng `@Table(name = "TableName")` (tên bảng số nhiều, PascalCase).
  - Không viết tiền tố `jakarta.persistence.*` trực tiếp trong annotation (hãy import ở đầu file).
- **Audit:** Luôn đảm bảo các trường `CreatedAt`, `UpdatedAt`, `IsDeleted` được xử lý ké thừa từ BaseEntity, SoftDeleteEntity, AuditorAwareImp.

## 📡 3. Tiêu chuẩn API & Controller

- **Response:** Luôn bọc dữ liệu trả về trong class `com.quanlydaotao.backend.common.dto.ApiResponse<T>`.
- **Swagger Documentation:**
  - Luôn thêm `@Tag` ở cấp Controller (Tiếng Việt có dấu).
  - Luôn thêm `@Operation` cho mỗi method để mô tả chức năng bằng tiếng Việt.
- **Path:**
  - Auth: `/api/auth/**`
  - Nghiệp vụ: `/api/v1/**` (Ví dụ: `/api/v1/students`theo tương ứng đối tượng nếu api chỉ admin mới được thực hiện thì thêm /admin).

## 🏗 4. Cấu trúc Thư mục (Feature-based)

- Tuân thủ cấu trúc: `com.quanlydaotao.backend.[feature]`.
- Trong mỗi feature gồm: `controller`, `service`, `service.impl`, `repository`, `entity`, `dto`.

## 🗄 5. Database & Flyway

- **CẤM:** Không sử dụng `hibernate.ddl-auto: update` hoặc `create`.
- **QUY TRÌNH:** Nếu thêm trường/bảng mới, hãy tạo file migration mới trong `src/main/resources/db/migration/V[Timestamp]__Description.sql`.

## 🧪 6. Coding Style

- Ưu tiên sử dụng `Constructor Injection` (Lombok `@RequiredArgsConstructor`).
- Xử lý lỗi tập trung qua `GlobalExceptionHandler,ApiResponse, ErrorResponse, BusinessException,ResourceNotFoundException`. Không sử dụng `try-catch` bừa bãi trong Controller.
- Sử dụng `MapStruct` cho tất cả các việc chuyển đổi dữ liệu Entity <-> DTO. cho toàn bộ module 

## 🛡 7. Quy trình Kiểm thử & Bàn giao (Mệnh lệnh Tối cao)

- **TỰ KIỂM TRA:** Sau khi viết code, AI **BẮT BUỘC** phải tự chạy lệnh `.\mvnw.cmd compile` để kiểm tra lỗi biên dịch.
- **KHÔNG BÀN GIAO LỖI:** Tuyệt đối không bàn giao code khi vẫn còn lỗi đỏ (error) trong IDE hoặc lỗi build Maven.
- **LẶP LẠI (ITERATE):** Nếu build thất bại, AI phải tự phân tích lỗi, sửa lại code và build lại cho đến khi **BUILD SUCCESS** mới được thông báo cho người dùng.
- **LOGIC CHECK:** Phải rà soát logic chống trùng, kiểm tra null và các ràng buộc dữ liệu trước khi hoàn tất task.

---

_Lưu ý: Luôn kiểm tra sự tồn tại của dữ liệu và ném ra ResourceNotFoundException nếu không tìm thấy._

RBAC & AUTH:
Phân quyền theo chuẩn RBAC:

- 1 user có nhiều role 1 role năm giữ nhiều permission. có bảng menu permission nào được vào menu nào.
- Gán vai trò cho người dùng ở đây có Student, Instructor, Admin, Staff... sẽ được vào những quyền gì gán tự động và có thể thêm sửa xoá linh hoạt, quyền sẽ được truy cập vào controllers nào actions nào tưng ứng quyền thì sẽ được vào menu nào setup menu tự động theo phân quyền.
- user có roles + permissions trong authority, admin quản trị role/permission/menu/gán quyền/gán role, và endpoint trả menu theo user.
- Mọi request gửi kèm Access Token (JWT) ở header:
  1. Bộ lọc (Filter Chain) chặn Request
  2. Trích xuất và Giải mã Token
  3. Trích xuất Roles/Authorities
  4. Lưu vào SecurityContext
  5. Kiểm tra quyền trước khi vào Controller
- Cơ chế bảo vệ dữ liệu nhạy cảm (Identity Protection) đã được áp dụng cho các API cập nhật thông tin người dùng
- (ví dụ: `PUT /api/auth/users/{id}`). Các trường như `userId` và `email` sẽ bị khóa,
- không cho phép thay đổi sau khi đăng ký. FE cần chuyển các trường này sang trạng thái `disabled` hoặc `read-only`
- và hiển thị thông báo: _"Không thể thay đổi Mã định danh và Email sau khi đăng ký"_.
- Những api nào cũng phải kiểm tra quyền truyền access token hết hạn thì trả về lỗi 401 để FE bắt đăng nhập lại.
- Tk để test có thể dùng tk `admin` hoặc `user` đã đăng ký trước đó.
- admin: pass `Admin@123`
- superadmin: pass `Admin@123`
  Quy trình tạo tài khoản là student, instructor, staff sẽ được tạo bởi admin hoặc superadmin thông qua giao diện quản
  lý người dùng. Sau khi tạo,các tài khoản này sẽ có quyền truy cập vào các chức năng tương ứng với vai trò của họ trong hệ thống.
- Tạo CRUD cơ bản cho các đối tượng: Persons, Students, Employees, Instructors, Staffs, Users, UserRoles
- Chức năng tạo tk của admin sẽ có 3 loại đối tượng chính: Sinh viên, Giảng viên, Nhân viên hành chính.
- Mỗi loại sẽ có form nhập liệu riêng biệt nhưng vẫn tuân theo quy trình chung:
- Tạo api để hoàn thành logic workflow tạo tài khoản cho từng loại đối tượng (student, instructor, staff) trong 1 transaction duy nhất để đảm bảo tính toàn vẹn dữ liệu.
- Các bước trong workflow sẽ bao gồm:
  1. Tạo bản ghi trong bảng Persons để lưu thông tin chung
  2. Tạo bản ghi trong bảng tương ứng (Students, Employees, Instructors, Staffs) để lưu thông tin chuyên biệt
  3. Tự động generate username, password, email edu dựa trên quy tắc đã định sẵn
  4. Tạo bản ghi trong bảng Users để quản lý đăng nhập
  5. Gán role tương ứng trong bảng UserRoles
Đã thêm trường mới:
     Students thêm AdmissionDate DATE NULL (ngày nhập học)
     Users thêm EmailConfirmed BIT DEFAULT 0 và ConfirmationToken NVARCHAR(255) NULL (cho xác thực email sau)
     Persons thêm FullNameNoAccent NVARCHAR(150) NULL (để generate email.edu nhanh hơn, tránh xử lý accent trong code) đôi với tên không dấu của người dùng ví dụ fullname là Nguyễn Thọ Ngọc thì FullNameNoAccent lưu ngoc.
- Tạo từng đối tượng 1 thì admin nhập ô input còn nếu import nhiều thì sẽ có file excel mẫu để admin nhập liệu cho nhanh rồi import vào hệ thống (file excel sẽ có cột tương ứng với các trường dữ liệu cần thiết, sau đó backend sẽ đọc file này và thực hiện quy trình tạo tài khoản tương tự như trên cho từng dòng dữ liệu trong file).
       Employees thêm EmployeeType NVARCHAR(20) NULL (để phân biệt Instructor/Staff dễ dàng hơn khi query)
- Workflow chính thức cho Sinh viên:
  Admin nhấn [+ Tạo mới]
  │
  ▼
  Chọn loại đối tượng (3 nút lớn / dropdown):
  ┌─────────────┬─────────────┬─────────────┐
  │ Sinh viên │ Giảng viên │ Nhân viên │
  └─────────────┴─────────────┴─────────────┘
  │
  ▼ (chọn Sinh viên)
  │
  Form duy nhất (dynamic):
  • Section 1: Thông tin chung (Persons)
  - Họ tên,FullNameNoAccent, Ngày sinh, Giới tính, CCCD, Địa chỉ, SĐT, Email cá nhân, Avatar…
    • Section 2: Thông tin sinh viên (Students)
  - Mã sinh viên (StudentCode) ← auto-gen unique theo quy tắc (ví dụ: 101292)
  - Department (Khoa/Bộ môn) lấy tên từ danh sách đã có từ bảng Departments dạng dropdown có search 
  - Major (Ngành) ← lấy tên từ danh sách đã có từ bảng major dạng dropdown có search,Filter theo Khoa đã chọn 
  - TrainingProgram (Ngành/Chuyên ngành) lấy tên từ danh sách đã có từ bảng TrainingPrograms dạng dropdown có search Filter theo Ngành + Khóa
  - AcademicCohort (Khóa học) lấy tên từ danh sách đã có từ bảng AcademicCohorts dạng dropdown có search
  - Class (Lớp) lấy tên từ danh sách đã có từ bảng Classes dạng dropdown có search. Filter theo Khoa + AcademicCohort + chưa đầy chỗ (CurrentStudent < MaxSize)
  - Ghi chú
    │
    ▼
    Backend xử lý **1 API atomic** (trong @Transactional):
    1. INSERT Persons → personId
    2. INSERT Students → studentId, StudentCode,MajorId TrainingProgramId, PersonId
    3. INSERT StudentClasses (gán lớp hành chính)
    4. Tự động generate (theo quy tắc bạn đưa):
       • Username = StudentCode lấy từ bảng Students (ví dụ: 101292)
       • Password = ddMMyyyy (ngày sinh, ví dụ: 15032005)
       • Email Edu = ngoc101292@donga.edu.vn (tên không dấu lấy từ FullNameNoAccent ở bảng person + mã SV)
       • RequirePasswordChange = true
    5. INSERT Users
    6. INSERT UserRoles (gán role SINHVIEN tự động theo loại đã chọn)
       │
       ▼
       Trả về thông báo thành công + nút “Gửi lại email”
    7. INSERT StudentStatusHistories (trạng thái DANG_HOC, IsCurrent = true)
* Gửi email tài khoản cho sinh viên là email edu chứ k phải email cá nhân
* Nếu có lỗi ở bất kỳ bước nào, rollback toàn bộ transaction và trả về lỗi chi tiết để FE hiển thị.

- WORKFLOW CHÍNH THỨC CHO STAFF (Nhân viên hành chính)
  Admin nhấn [+ Tạo mới]
  │
  ▼
  Chọn loại đối tượng (3 nút lớn / dropdown):
  ┌─────────────┬─────────────┬─────────────┐
  │ Sinh viên │ Giảng viên │ Nhân viên │
  └─────────────┴─────────────┴─────────────┘
  │
  ▼ (chọn Nhân viên)
  │
  Form duy nhất (dynamic):
  • Section 1: Thông tin chung (Persons)
  - Họ tên,FullNameNoAccent, Ngày sinh, Giới tính, CCCD, Địa chỉ thường trú/tạm trú, SĐT, Email cá nhân, Avatar…
    • Section 2: Thông tin nhân viên (Employees + Staffs)
  - Mã nhân viên (EmployeeCode) ← lấy từ bảng Employees (2024045)" EmployeeCode ở Employees là auto-gen unique"
  - StaffCode "NV2024045" ← prefix "NV" + EmployeeCode
  - Ngày bắt đầu làm việc (StartWorkDate)
  - Division (Phòng ban) lấy tên từ danh sách đã có từ bảng Divisions dạng dropdown có search
  - Position (Chức vụ) lấy từ tên danh sách đã có từ bảng Positions dạng dropdown có search
  - ContractType (Hợp đồng) lấy từ danh sách đã có từ bảng Contract dạng dropdown có search
  - Ghi chú
    │
    ▼
    Backend xử lý **1 API atomic** (trong @Transactional):
    1. INSERT Persons → personId
    2. INSERT Employees → employeeId, EmployeeCode, PersonId, StartWorkDate…
    3. INSERT Staffs → lấy employeeId + StaffCode, DivisionId, PositionId
    4. Tự động generate (theo quy tắc chung):
       • Username = nv2024045 ( theo StaffCode/EmployeeCode)
       • Password = ddMMyyyy (ngày sinh)
       • Email Edu = ngocnv2024045@donga.edu.vn(tên không dấu lấy từ FullNameNoAccent ở bảng person + mã NV)
       • RequirePasswordChange = true
    5. INSERT Users
    6. INSERT UserRoles (gán role NHANVIEN hoặc STAFF tự động theo loại đã chọn)
       │
       ▼
       Trả về thông báo thành công

* Gửi email tài khoản cho nhân viên là email edu chứ k phải email cá nhân

- WORKFLOW CHÍNH THỨC CHO INSTRUCTORS (Giảng viên)
  Admin nhấn [+ Tạo mới]
  │
  ▼
  Chọn loại đối tượng (3 nút lớn / dropdown):
  ┌─────────────┬─────────────┬─────────────┐
  │ Sinh viên │ Giảng viên │ Nhân viên │
  └─────────────┴─────────────┴─────────────┘
  │
  ▼ (chọn Giảng viên)
  │
  Form duy nhất (dynamic):
  • Section 1: Thông tin chung (Persons)
  - Họ tên, Ngày sinh, Giới tính, CCCD, Nơi sinh, Địa chỉ thường trú/tạm trú, SĐT, Email cá nhân, Avatar…
    • Section 2: Thông tin giảng viên (Employees + Instructors)
  - Mã nhân viên (EmployeeCode) ← lấy từ bảng Employees sau khi insert (2024045)" EmployeeCode ở Employees là auto-gen unique"
  - Mã giảng viên (InstructorCode) ← "GV2024045" ← prefix "GV" + EmployeeCode
  - Ngày bắt đầu làm việc (StartWorkDate)
  - Department (Khoa/Bộ môn) lấy tên từ danh sách đã có từ bảng Departments dạng dropdown có search
  - Degree (Học vị) lấy từ tên danh sách đã có từ bảng Degrees dạng dropdown có search
  - AcademicRank (Học hàm) từ bảng Degrees ← dropdown: GS / PGS / Không
  - Major ← dropdown search → lấy tên từ bảng Majors (Majors đã lọc theo DepartmentId vừa chọn)
  - Specialization Chuyên sâu ← input tự nhập tự do
  - Institution Trường cấp bằng ← input tự nhập
  - GraduationYear Năm tốt nghiệp ← input số
  - ContractType (Hợp đồng) lấy từ danh sách đã có từ bảng Contract dạng dropdown có search
  - Ghi chú
    │
    ▼
    Backend xử lý **1 API atomic** (trong @Transactional):
    1. INSERT Persons → personId
    2. INSERT Employees → employeeId, EmployeeCode, PersonId, StartWorkDate…
    3. INSERT Instructors → lấy employeeId (PK) + InstructorCode, DepartmentId, DegreeId
    4. Tự động generate (theo quy tắc bạn đưa):
       • Username = gv2024045 (hoặc InstructorCode)
       • Password = ddMMyyyy (ngày sinh)
       • Email Edu = ngocgv2024045@donga.edu.vn (tên không dấu lấy từ FullNameNoAccent ở bảng person + mã GV)
       • RequirePasswordChange = true
    5. INSERT Users
    6. INSERT UserRoles (gán role GIANGVIEN tự động theo loại đã chọn)
       │
       ▼
       Trả về thông báo thành công

* Gửi email tài khoản cho giảng viên là email edu chứ k phải email cá nhân
- thêm đối tượng thì nó tự động generate ra tk mk tạo email rồi
- với lần đăng nhập đầu tiên user có xử lí trường requirePassChange true chuyến đển trang đổi mk đổi thành false. khi tạo có gửi xác nhận click vào để đổi mk có thể vào email để đổi.
- Đối với xử lí user quên mk thì user sẽ gửi yêu cầu lên admin kèm các thông tin cần thiết mã sinh viên giáo viên nhân viên kèm email edu số điện thoại họ và tên. Sau đó admin sẽ tiến hành reset pass lại cho bạn dạng mặc định là ngày sinh sau đó bạn đăng nhập giống lần đầu tiên nó sẽ chuyển đến trang đổi pass hoặc vào email để đổi pass
- Thêm validation nghiệp vụ:
- Ngành phải thuộc khoa.
- Chương trình đào tạo phải có ngành + khoa + niên khóa, và ngành phải khớp khoa.
- Học kỳ phải nằm trong năm học.
- Lớp hành chính phải có khoa + niên khóa, cố vấn nếu có phải là instructor.
- Chức vụ kiểm tra phòng ban.
- Hợp đồng kiểm tra employee, ngày hiệu lực, lương/phụ cấp/ngày phép.

class lớp hành chính sẽ được admin tạo trước đúng . nghiệp vụ kèm theo khi thêm 1 class là sẽ chọn department, AdvisorId gíao viên cố vấn xử lí là 1 giáo viên cố vấn chỉ được gán cho 1 lớp hành chính, AcademicCohortId... sau đó khi thêm student chọn class cho student trong bước thêm sinh viên record được lưu trong bảng studentclass, StudentStatusCatalog Danh mục — định nghĩa các loại trạng thái gán cho sinh viên đó, Admin quản lý qua UI. StudentStatusHistories Lịch sử — ghi lại từng lần thay đổi trạng thái của từng sinh viên.
