# Project Title: University Training Management System

## Project Overview

This project aims to develop a web platform for University Training Management System supply at University Viet Nam. The platform will leverage Spring Boot Web API for the backend, Bootstrap/ReactJS for the frontend, and SQL Server for the database.

## Objectives

- To design and develop a centralized system for managing academic programs, courses, and student records efficiently.
- To automate core training management processes such as course registration, scheduling, grading, and graduation evaluation.
- To provide role-based access control for administrators, lecturers, and students to ensure data security and accuracy.
- To improve transparency and real-time information access for academic progress, schedules, and notifications.
- To enhance decision-making by providing reports and analytics on training performance and resource utilization.

## Scope

- **Frontend**: Bootstrap/ReactJS application for users to interact with the platform.
- **Backend**: Spring Boot Web API to handle business logic and data management.
- **Database**: SQL Server to store and manage event and ticket information.
- **Authentication & Authorization**: Secure login and role-based access control.
- **Notifications**: Real-time updates and email notifications for users use Firebase,...

## Task Board (Scrum)

### Product Backlog
**I. NHÓM QUẢN LÝ NGƯỜI DÙNG – PHÂN QUYỀN**
| STT | Tên bảng         | Chức năng                                                          |
| --- | ---------------- | ------------------------------------------------------------------ |
| 1   | users            | Lưu tài khoản đăng nhập hệ thống cho SV, GV, giáo vụ, admin        |
| 2   | roles            | Định nghĩa vai trò người dùng (ADMIN, GIAOVU, GIANGVIEN, SINHVIEN) |
| 3   | user_roles       | Gán nhiều vai trò cho một user                                     |
| 4   | permissions      | Danh sách quyền chức năng trong hệ thống                           |
| 5   | role_permissions | Gán quyền cụ thể cho từng vai trò                                  |

**II. NHÓM QUẢN LÝ SINH VIÊN**
| STT | Tên bảng        | Chức năng                                                      |
| --- | --------------- | -------------------------------------------------------------- |
| 6   | students        | Thông tin hồ sơ sinh viên                                      |
| 7   | student_status  | Trạng thái sinh viên (đang học, bảo lưu, thôi học, tốt nghiệp) |
| 8   | student_classes | Gán sinh viên vào lớp hành chính                               |

**III. NHÓM QUẢN LÝ GIẢNG VIÊN – NHÂN SỰ**
| STT | Tên bảng    | Chức năng                                   |
| --- | ----------- | ------------------------------------------- |
| 9   | lecturers   | Thông tin giảng viên                        |
| 10  | departments | Khoa / Viện quản lý giảng viên và ngành học |
| 11  | positions   | Chức danh giảng viên (GV, ThS, TS, PGS…)    |

**IV. NHÓM QUẢN LÝ CHƯƠNG TRÌNH – MÔN HỌC**
| STT | Tên bảng             | Chức năng                                            |
| --- | -------------------- | ---------------------------------------------------- |
| 12  | majors               | Ngành đào tạo (Kỹ thuật máy tính, Trí tuệ nhân tạo…) |
| 13  | training_programs    | Chương trình đào tạo theo ngành và khóa              |
| 14  | courses              | Môn học / học phần                                   |
| 15  | course_prerequisites | Môn học tiên quyết                                   |

**V. NHÓM QUẢN LÝ HỌC KỲ – LỚP HỌC PHẦN**
| STT | Tên bảng                | Chức năng                             |
| --- | ----------------------- | ------------------------------------- |
| 16  | semesters               | Học kỳ (HK1 2024–2025…)               |
| 17  | course_classes          | Lớp học phần mở trong học kỳ          |
| 18  | lecturer_course_classes | Phân công giảng viên dạy lớp học phần |

**VI. NHÓM ĐĂNG KÝ HỌC PHẦN**
| STT | Tên bảng             | Chức năng                  |
| --- | -------------------- | -------------------------- |
| 19  | course_registrations | Sinh viên đăng ký học phần |
| 20  | registration_periods | Đợt đăng ký học phần       |

**VII. NHÓM QUẢN LÝ LỊCH HỌC – PHÒNG HỌC**
| STT | Tên bảng  | Chức năng                          |
| --- | --------- | ---------------------------------- |
| 21  | rooms     | Phòng học                          |
| 22  | buildings | Tòa nhà / khu giảng đường          |
| 23  | schedules | Lịch học chi tiết cho lớp học phần |

**VIII. NHÓM ĐIỂM – ĐÁNH GIÁ HỌC TẬP**
| STT | Tên bảng         | Chức năng                                       |
| --- | ---------------- | ----------------------------------------------- |
| 24  | grade_components | Thành phần điểm (chuyên cần, giữa kỳ, cuối kỳ…) |
| 25  | student_grades   | Điểm sinh viên theo học phần                    |
| 26  | grade_scales     | Thang điểm (10, chữ A–F…)                       |

**IX. NHÓM HỌC PHÍ – TÀI CHÍNH**
| STT | Tên bảng        | Chức năng                               |
| --- | --------------- | --------------------------------------- |
| 27  | tuition_fees    | Mức học phí theo tín chỉ / chương trình |
| 28  | student_tuition | Học phí sinh viên theo học kỳ           |
| 29  | payments        | Lịch sử thanh toán học phí              |

**X. NHÓM QUẢN LÝ THI – KHẢO THÍ**
| STT | Tên bảng   | Chức năng                                  |
| --- | ---------- | ------------------------------------------ |
| 30  | exam_types | Loại kỳ thi (giữa kỳ, cuối kỳ, cải thiện…) |
| 31  | exams      | Lịch thi                                   |
| 32  | exam_rooms | Phân phòng thi                             |

**XI. NHÓM QUẢN LÝ TỐT NGHIỆP**
| STT | Tên bảng              | Chức năng                |
| --- | --------------------- | ------------------------ |
| 33  | graduation_conditions | Điều kiện xét tốt nghiệp |
| 34  | graduation_results    | Kết quả xét tốt nghiệp   |

**XII. NHÓM THÔNG BÁO – HỆ THỐNG**
| STT | Tên bảng      | Chức năng                           |
| --- | ------------- | ----------------------------------- |
| 35  | notifications | Thông báo hệ thống                  |
| 36  | logs          | Nhật ký hoạt động (audit, truy vết) |
| 37  | settings      | Cấu hình hệ thống                   |

**XIII. NHÓM MỞ RỘNG THƯỜNG DÙNG**
| STT | Tên bảng   | Chức năng                     |
| --- | ---------- | ----------------------------- |
| 38  | documents  | Tài liệu học tập              |
| 39  | feedbacks  | Đánh giá giảng viên / môn học |
| 40  | attendance | Điểm danh sinh viên           |


### Sprint 1

| Task ID | Description                        | Assignee    | Priority | Status      | Start Date | Due Date   |
|--------|------------------------------------|-------------|----------|-------------|------------|------------|
| 1      | Setup project repository           | Your Name   | High     | Done        | 2026-01-29 | 2026-02-05 |
| 2      | Design database schema             | Developer 1 | High     | In Progress | 2026-01-29 | 2026-02-05 |
| 3      | Develop user authentication module | Developer 2 | High     | Pending     | 2026-01-29 | 2026-02-05 |
| 4      | Develop login                      | Developer 2 | High     | Pending     | 2026-01-29 | 2026-02-05 |

### Sprint 2

| Task ID | Description                                   | Assignee    | Priority | Status  | Start Date | Due Date   |
|--------:|-----------------------------------------------|-------------|----------|---------|------------|------------|
| 1       | Create components system                      | Developer 1 | Medium   | Pending | 2026-01-29 | 2026-02-05 |
| 2       | Implement API for system                      | Developer 2 | High     | Pending | 2026-01-29 | 2026-02-05 |
| 3       | Setup CI/CD pipeline                          | DevOps      | Medium   | Pending | 2026-01-29 | 2026-02-05 |

### Sprint 3

| Task ID | Description                                   | Assignee    | Priority | Status  | Start Date | Due Date   |
|--------:|-----------------------------------------------|-------------|----------|---------|------------|------------|
| 1       | Create components system                      | Developer 1 | Medium   | Pending | 2026-01-29 | 2026-02-05 |
| 2       | Implement API for system                      | Developer 2 | High     | Pending | 2026-01-29 | 2026-02-05 |
| 3       | Setup CI/CD pipeline                          | DevOps      | Medium   | Pending | 2026-01-29 | 2026-02-05 |

### Sprint 4

| Task ID | Description                                   | Assignee    | Priority | Status  | Start Date | Due Date   |
|--------:|-----------------------------------------------|-------------|----------|---------|------------|------------|
| 1       | Create components system                      | Developer 1 | Medium   | Pending | 2026-01-29 | 2026-02-05 |
| 2       | Implement API for system                      | Developer 2 | High     | Pending | 2026-01-29 | 2026-02-05 |
| 3       | Setup CI/CD pipeline                          | DevOps      | Medium   | Pending | 2026-01-29 | 2026-02-05 |

### Sprint 5

| Task ID | Description                                   | Assignee    | Priority | Status  | Start Date | Due Date   |
|--------:|-----------------------------------------------|-------------|----------|---------|------------|------------|
| 1       | Create components system                      | Developer 1 | Medium   | Pending | 2026-01-29 | 2026-02-05 |
| 2       | Implement API for system                      | Developer 2 | High     | Pending | 2026-01-29 | 2026-02-05 |
| 3       | Setup CI/CD pipeline                          | DevOps      | Medium   | Pending | 2026-01-29 | 2026-02-05 |

### Sprint 6

| Task ID | Description                                   | Assignee    | Priority | Status  | Start Date | Due Date   |
|--------:|-----------------------------------------------|-------------|----------|---------|------------|------------|
| 1       | Create components system                      | Developer 1 | Medium   | Pending | 2026-01-29 | 2026-02-05 |
| 2       | Implement API for system                      | Developer 2 | High     | Pending | 2026-01-29 | 2026-02-05 |
| 3       | Setup CI/CD pipeline                          | DevOps      | Medium   | Pending | 2026-01-29 | 2026-02-05 |


## Milestones

| Milestone ID | Description                                         | Due Date   | Status      |
|-------------:|-----------------------------------------------------|------------|-------------|
| 1            | Initial project setup complete                      | 2026-01-01 | Completed   |
| 2            | Database schema design complete                     | 2026-02-05 | In Progress |
| 3            | User authentication module development complete     | 2026-02-15 | Pending     |
| 4            | UI components                                       | 2026-08-17 | Pending     |
| 5            | API for management complete                         | 2026-08-19 | Pending     |
| 6            | CI/CD pipeline setup complete                       | 2026-08-25 | Pending     |
| 7            | MVP ready for internal testing                      | 2026-09-01 | Pending     |
## Notes:
- Project repository setup is high priority.
- Database schema design should start immediately.
- Authentication module development planned for next week.

### Sprint Review Meeting (2025-02-05)

**Attendees:** Your Name, Developer 1, Developer 2, DevOps, QA

**Agenda:**
- Review completed tasks in Sprint 1
- Discuss challenges faced during the sprint
- Plan for Sprint 2

**Notes:**
- Project repository setup completed successfully.
- Database schema design is in progress, expected to complete on time.
- Authentication module development to begin tomorrow.

## Issues and Risks

| Issue ID | Description                                   | Severity | Status  | Mitigation Plan                         |
|---------|-----------------------------------------------|----------|---------|-----------------------------------------|
| 1       | Delay in database schema design               | Medium   | Open    | Adjust timeline, reassign tasks          |
| 2       | Authentication module integration issues      | High     | Pending | Conduct code reviews, add tests          |

## Useful Links

- [Project Repository](https://github.com/....)
- [Design Mockups](https://www.figma.com/file/XXXXXX/Project-Designs)
- [Project analysis] https://docs.google.com/spreadsheets/d/1hEFl53luJZqVWlzLvfg0kmV_pNOnnnARoiAl3UasRRw/edit?usp=sharing
- [API Documentation](https://project-docs.com/api)
- [Check payment](https://payos.vn/)
- [Official Website](https://spring.io/)
- [Build, deploy, and scale]-https://render.com/
- [Build, deploy, and scale]-https://railway.com/
---

### Notes

- Regularly update this README.md to reflect the current state of the project.
- Use GitHub Issues to track detailed tasks and bugs.
- Utilize GitHub Projects for more advanced project management.


