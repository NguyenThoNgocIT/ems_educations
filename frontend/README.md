mona_web - Hệ thống Quản lý Đào tạo Tín chỉ
Đồ án Tốt nghiệp - Xây dựng hệ thống phần mềm quản lý đào tạo cho trường Đại học.

📌 Giới thiệu dự án
mona_web là giải pháp phần mềm quản lý giáo dục (LMS) hiện đại, tập trung vào việc tối ưu hóa quy trình quản lý tín chỉ, tài chính và tương tác khách hàng cho các trung tâm đào tạo hoặc trường đại học. Hệ thống được thiết kế với giao diện quản trị (Admin Dashboard) mạnh mẽ, tập trung vào trải nghiệm người dùng và khả năng tùy biến cao.

✨ Tính năng nổi bật

1. Quản lý Tài chính & Hoa hồng
   Theo dõi doanh thu thực tế và quản lý hoa hồng cho nhân viên tư vấn.

Hệ thống thẻ thống kê (Stats Cards) trực quan về dòng tiền.

2. Cấu hình Học tập (Core Logic)
   Quản lý chuyên môn, chương trình học đa cấp và ca học linh hoạt.

Tích hợp cấu hình Zoom cho các lớp học trực tuyến (Add-on).

Bảng điểm mẫu và các gói học phí ưu đãi.

3. Hệ thống & Bảo mật
   Quản lý đa trung tâm (Multi-centers) và lịch nghỉ lễ.

Phân quyền thanh toán và kiểm duyệt thiết bị đăng nhập của học viên.

Kho mẫu hợp đồng và câu hỏi thường gặp (FAQs) chuyên nghiệp.

4. Danh mục & CRM (Marketing)
   Phân loại nhu cầu học, nguồn khách hàng và trạng thái chăm sóc (Lead Status).

Hệ thống Popup thông báo tùy chỉnh thời gian và độ trễ để tăng tương tác.

🛠 Công nghệ sử dụng
Hệ thống được phát triển dựa trên mô hình Web API hiện đại:

Frontend: React.js / Next.js (App Router), Tailwind CSS, Lucide Icons.

Backend: Spring Boot (Java), RESTful API.

Database: Microsoft SQL Server.

Tools: Git, npm/yarn.

🚀 Hướng dẫn cài đặt
Frontend (mona_web)
Bash

# Di chuyển vào thư mục dự án

cd mona_web

# Cài đặt các thư viện

npm install

# Chạy dự án ở chế độ phát triển

npm run dev
Backend (Spring Boot)
Cấu hình kết nối SQL Server trong file application.properties.

Chạy ứng dụng thông qua IDE (IntelliJ/Eclipse) hoặc sử dụng Maven:

Bash
mvn spring-boot:run
📂 Cấu trúc thư mục chính (Frontend)
/app: Chứa các Route và Page chính của hệ thống Next.js.

/components: Các thành phần giao diện tái sử dụng (Tables, Modals, Nav, v.v.).

/public: Chứa tài nguyên tĩnh (Images, Icons).

/utils: Các hàm bổ trợ và cấu hình API.
