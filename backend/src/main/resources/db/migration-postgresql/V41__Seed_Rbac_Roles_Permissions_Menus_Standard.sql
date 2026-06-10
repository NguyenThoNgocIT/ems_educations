-- Standard RBAC seed: User -> Roles -> Permissions -> APIs -> Menus.
-- Idempotent by Code/MenuUrl so it can safely run on existing Neon data.

INSERT INTO Roles (RoleId, Code, Name, Description, Level, IsSystem, DisplayOrder, Color, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Level, TRUE, src.DisplayOrder, src.Color, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('SUPER_ADMIN', 'Quản trị cấp cao', 'Toàn quyền hệ thống và cấu hình bảo mật', 0, 0, '#991B1B'),
    ('ADMIN', 'Quản trị viên', 'Toàn quyền vận hành hệ thống', 1, 1, '#DC2626'),
    ('STAFF', 'Nhân viên phòng đào tạo', 'Vận hành hồ sơ, học vụ, lịch học và danh mục đào tạo', 2, 2, '#7C3AED'),
    ('LECTURER', 'Giảng viên', 'Xem lịch dạy, nhập điểm và gửi yêu cầu điều chỉnh lịch', 3, 3, '#2563EB'),
    ('STUDENT', 'Sinh viên', 'Xem hồ sơ, lịch học, kết quả học tập và đăng ký học lại/cải thiện', 4, 4, '#16A34A')
) AS src(Code, Name, Description, Level, DisplayOrder, Color)
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    Description = EXCLUDED.Description,
    Level = EXCLUDED.Level,
    DisplayOrder = EXCLUDED.DisplayOrder,
    Color = EXCLUDED.Color,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO Permissions (PermissionId, Code, Name, Description, Module, IsActive, CreatedAt)
SELECT gen_random_uuid(), src.Code, src.Name, src.Description, src.Module, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('DASHBOARD_ADMIN_VIEW', 'Xem tổng quan admin', 'Xem số liệu tổng quan và thống kê học vụ', 'DASHBOARD'),

    ('STUDENT_VIEW', 'Xem sinh viên', 'Xem danh sách và chi tiết sinh viên', 'PERSON'),
    ('STUDENT_CREATE', 'Tạo sinh viên', 'Tạo sinh viên và tài khoản tự động', 'PERSON'),
    ('STUDENT_EDIT', 'Sửa sinh viên', 'Cập nhật hồ sơ, học vụ và trạng thái sinh viên', 'PERSON'),
    ('STUDENT_DELETE', 'Xóa sinh viên', 'Xóa mềm sinh viên và khóa tài khoản liên quan', 'PERSON'),
    ('STUDENT_IMPORT', 'Nhập Excel sinh viên', 'Tạo sinh viên hàng loạt bằng Excel', 'PERSON'),
    ('INSTRUCTOR_VIEW', 'Xem giảng viên', 'Xem danh sách và chi tiết giảng viên', 'PERSON'),
    ('INSTRUCTOR_CREATE', 'Tạo giảng viên', 'Tạo giảng viên và tài khoản tự động', 'PERSON'),
    ('INSTRUCTOR_EDIT', 'Sửa giảng viên', 'Cập nhật hồ sơ giảng viên', 'PERSON'),
    ('INSTRUCTOR_DELETE', 'Xóa giảng viên', 'Xóa mềm giảng viên và khóa tài khoản liên quan', 'PERSON'),
    ('STAFF_VIEW', 'Xem nhân viên', 'Xem danh sách và chi tiết nhân viên', 'PERSON'),
    ('STAFF_CREATE', 'Tạo nhân viên', 'Tạo nhân viên và tài khoản tự động', 'PERSON'),
    ('STAFF_EDIT', 'Sửa nhân viên', 'Cập nhật hồ sơ nhân viên', 'PERSON'),
    ('STAFF_DELETE', 'Xóa nhân viên', 'Xóa mềm nhân viên và khóa tài khoản liên quan', 'PERSON'),

    ('USER_VIEW', 'Xem tài khoản', 'Xem tài khoản người dùng', 'RBAC'),
    ('USER_EDIT', 'Sửa tài khoản', 'Khóa, mở khóa, khôi phục và gán vai trò cho tài khoản', 'RBAC'),
    ('USER_DELETE', 'Xóa tài khoản', 'Xóa mềm tài khoản và thu hồi phiên', 'RBAC'),
    ('ROLE_VIEW', 'Xem vai trò', 'Xem vai trò và số lượng quyền/người dùng', 'RBAC'),
    ('ROLE_CREATE', 'Tạo vai trò', 'Tạo vai trò mới', 'RBAC'),
    ('ROLE_EDIT', 'Sửa vai trò', 'Cập nhật vai trò và gán quyền cho vai trò', 'RBAC'),
    ('ROLE_DELETE', 'Xóa vai trò', 'Xóa mềm vai trò', 'RBAC'),
    ('PERMISSION_VIEW', 'Xem quyền', 'Xem quyền và API đang được bảo vệ', 'RBAC'),
    ('PERMISSION_CREATE', 'Tạo quyền', 'Tạo quyền nghiệp vụ mới', 'RBAC'),
    ('PERMISSION_EDIT', 'Sửa quyền', 'Cập nhật quyền và mapping API', 'RBAC'),
    ('PERMISSION_DELETE', 'Xóa quyền', 'Xóa mềm quyền', 'RBAC'),
    ('MENU_VIEW', 'Xem menu', 'Xem cấu hình menu theo quyền', 'RBAC'),
    ('MENU_CREATE', 'Tạo menu', 'Tạo menu cha hoặc menu màn hình', 'RBAC'),
    ('MENU_EDIT', 'Sửa menu', 'Cập nhật menu và quyền hiển thị', 'RBAC'),
    ('MENU_DELETE', 'Xóa menu', 'Xóa mềm menu', 'RBAC'),
    ('PASSWORD_RESET_MANAGE', 'Duyệt yêu cầu đặt lại mật khẩu', 'Xem, duyệt và từ chối yêu cầu đặt lại mật khẩu', 'RBAC'),

    ('DEPARTMENT_VIEW', 'Xem khoa', 'Xem khoa/bộ môn', 'ACADEMIC'),
    ('DEPARTMENT_CREATE', 'Tạo khoa', 'Tạo khoa/bộ môn', 'ACADEMIC'),
    ('DEPARTMENT_EDIT', 'Sửa khoa', 'Cập nhật khoa/bộ môn', 'ACADEMIC'),
    ('DEPARTMENT_DELETE', 'Xóa khoa', 'Xóa mềm khoa/bộ môn', 'ACADEMIC'),
    ('MAJOR_VIEW', 'Xem ngành', 'Xem ngành đào tạo', 'ACADEMIC'),
    ('MAJOR_CREATE', 'Tạo ngành', 'Tạo ngành đào tạo', 'ACADEMIC'),
    ('MAJOR_EDIT', 'Sửa ngành', 'Cập nhật ngành đào tạo', 'ACADEMIC'),
    ('MAJOR_DELETE', 'Xóa ngành', 'Xóa mềm ngành đào tạo', 'ACADEMIC'),
    ('SPECIALIZATION_VIEW', 'Xem chuyên ngành', 'Xem chuyên ngành', 'ACADEMIC'),
    ('SPECIALIZATION_CREATE', 'Tạo chuyên ngành', 'Tạo chuyên ngành', 'ACADEMIC'),
    ('SPECIALIZATION_EDIT', 'Sửa chuyên ngành', 'Cập nhật chuyên ngành', 'ACADEMIC'),
    ('SPECIALIZATION_DELETE', 'Xóa chuyên ngành', 'Xóa mềm chuyên ngành', 'ACADEMIC'),
    ('ACADEMIC_COHORT_VIEW', 'Xem niên khóa', 'Xem niên khóa đào tạo', 'ACADEMIC'),
    ('ACADEMIC_COHORT_CREATE', 'Tạo niên khóa', 'Tạo niên khóa đào tạo', 'ACADEMIC'),
    ('ACADEMIC_COHORT_EDIT', 'Sửa niên khóa', 'Cập nhật niên khóa đào tạo', 'ACADEMIC'),
    ('ACADEMIC_COHORT_DELETE', 'Xóa niên khóa', 'Xóa mềm niên khóa đào tạo', 'ACADEMIC'),
    ('SCHOOL_YEAR_VIEW', 'Xem năm học', 'Xem năm học', 'ACADEMIC'),
    ('SCHOOL_YEAR_CREATE', 'Tạo năm học', 'Tạo năm học', 'ACADEMIC'),
    ('SCHOOL_YEAR_EDIT', 'Sửa năm học', 'Cập nhật năm học', 'ACADEMIC'),
    ('SCHOOL_YEAR_DELETE', 'Xóa năm học', 'Xóa mềm năm học', 'ACADEMIC'),
    ('SEMESTER_VIEW', 'Xem học kỳ', 'Xem học kỳ', 'ACADEMIC'),
    ('SEMESTER_CREATE', 'Tạo học kỳ', 'Tạo học kỳ', 'ACADEMIC'),
    ('SEMESTER_EDIT', 'Sửa học kỳ', 'Cập nhật học kỳ', 'ACADEMIC'),
    ('SEMESTER_DELETE', 'Xóa học kỳ', 'Xóa mềm học kỳ', 'ACADEMIC'),
    ('TRAINING_PROGRAM_VIEW', 'Xem chương trình đào tạo', 'Xem chương trình đào tạo', 'ACADEMIC'),
    ('TRAINING_PROGRAM_CREATE', 'Tạo chương trình đào tạo', 'Tạo chương trình đào tạo', 'ACADEMIC'),
    ('TRAINING_PROGRAM_EDIT', 'Sửa chương trình đào tạo', 'Cập nhật chương trình đào tạo', 'ACADEMIC'),
    ('TRAINING_PROGRAM_DELETE', 'Xóa chương trình đào tạo', 'Xóa mềm chương trình đào tạo', 'ACADEMIC'),
    ('TRAINING_PROGRAM_COURSE_VIEW', 'Xem môn trong chương trình', 'Xem môn học thuộc chương trình đào tạo', 'ACADEMIC'),

    ('COURSE_VIEW', 'Xem môn học', 'Xem môn học', 'COURSE'),
    ('COURSE_CREATE', 'Tạo môn học', 'Tạo môn học', 'COURSE'),
    ('COURSE_EDIT', 'Sửa môn học', 'Cập nhật môn học', 'COURSE'),
    ('COURSE_DELETE', 'Xóa môn học', 'Xóa mềm môn học', 'COURSE'),
    ('COURSE_CLASS_VIEW', 'Xem lớp học phần', 'Xem lớp học phần', 'COURSE'),
    ('COURSE_CLASS_CREATE', 'Tạo lớp học phần', 'Tạo lớp học phần', 'COURSE'),
    ('COURSE_CLASS_EDIT', 'Sửa lớp học phần', 'Cập nhật lớp học phần', 'COURSE'),
    ('COURSE_CLASS_DELETE', 'Xóa lớp học phần', 'Xóa mềm lớp học phần', 'COURSE'),
    ('COURSE_PREREQUISITE_MANAGE', 'Quản lý môn tiên quyết', 'Quản lý môn tiên quyết và môn tương đương', 'COURSE'),
    ('COURSE_REGISTRATION_RETAKE', 'Đăng ký học lại/cải thiện', 'Sinh viên đăng ký học lại hoặc cải thiện', 'COURSE'),

    ('ADMIN_CLASS_VIEW', 'Xem lớp hành chính', 'Xem lớp hành chính', 'ACADEMIC'),
    ('ADMIN_CLASS_CREATE', 'Tạo lớp hành chính', 'Tạo lớp hành chính', 'ACADEMIC'),
    ('ADMIN_CLASS_EDIT', 'Sửa lớp hành chính', 'Cập nhật lớp hành chính', 'ACADEMIC'),
    ('ADMIN_CLASS_DELETE', 'Xóa lớp hành chính', 'Xóa mềm lớp hành chính', 'ACADEMIC'),
    ('STUDENT_CLASS_VIEW', 'Xem phân lớp sinh viên', 'Xem lịch sử lớp hành chính của sinh viên', 'ACADEMIC'),
    ('STUDENT_CLASS_CREATE', 'Gán sinh viên vào lớp', 'Gán sinh viên vào lớp hành chính theo học kỳ', 'ACADEMIC'),
    ('STUDENT_CLASS_EDIT', 'Sửa phân lớp sinh viên', 'Cập nhật/chuyển lớp sinh viên', 'ACADEMIC'),
    ('STUDENT_CLASS_DELETE', 'Xóa phân lớp sinh viên', 'Xóa mềm phân lớp sinh viên', 'ACADEMIC'),
    ('STUDENT_STATUS_MANAGE', 'Quản lý trạng thái sinh viên', 'Quản lý danh mục và lịch sử trạng thái sinh viên', 'ACADEMIC'),
    ('STUDENT_SPECIALIZATION_MANAGE', 'Quản lý chuyên ngành sinh viên', 'Gán chuyên ngành và chương trình đào tạo cho sinh viên', 'ACADEMIC'),

    ('SCHEDULE_VIEW', 'Xem lịch học', 'Xem lịch học, phòng học và lịch tuần', 'SCHEDULE'),
    ('SCHEDULE_CREATE', 'Tạo lịch học', 'Tạo lịch học thủ công', 'SCHEDULE'),
    ('SCHEDULE_EDIT', 'Sửa lịch học', 'Cập nhật lịch học', 'SCHEDULE'),
    ('SCHEDULE_DELETE', 'Xóa lịch học', 'Xóa mềm lịch học', 'SCHEDULE'),
    ('AUTO_SCHEDULE_MANAGE', 'Tự động xếp lịch', 'Tạo lịch gốc tự động theo ràng buộc', 'SCHEDULE'),
    ('TEACHING_ASSIGNMENT_MANAGE', 'Phân công giảng dạy', 'Phân công giảng viên dạy lớp học phần', 'SCHEDULE'),
    ('TEACHING_PROGRESS_MANAGE', 'Quản lý tiến độ giảng dạy', 'Ghi nhận và xem tiến độ giảng dạy', 'SCHEDULE'),
    ('SCHEDULE_ADJUSTMENT_VIEW', 'Xem yêu cầu điều chỉnh lịch', 'Xem yêu cầu nghỉ/bù/tăng tiết', 'SCHEDULE'),
    ('SCHEDULE_ADJUSTMENT_CREATE', 'Tạo yêu cầu điều chỉnh lịch', 'Giảng viên tạo yêu cầu nghỉ/bù/tăng tiết', 'SCHEDULE'),
    ('SCHEDULE_ADJUSTMENT_VALIDATE', 'Kiểm tra lịch bù', 'Kiểm tra và gợi ý lịch bù/tăng tiết', 'SCHEDULE'),
    ('SCHEDULE_ADJUSTMENT_APPROVE', 'Duyệt điều chỉnh lịch', 'Admin duyệt, trả về hoặc từ chối yêu cầu điều chỉnh lịch', 'SCHEDULE'),

    ('ROOM_MANAGE', 'Quản lý phòng học', 'Quản lý tòa nhà, tầng, phòng học', 'FACILITY'),
    ('TIME_SLOT_MANAGE', 'Quản lý ca học', 'Quản lý ca/tiết học', 'FACILITY'),
    ('POSITION_MANAGE', 'Quản lý chức vụ', 'Quản lý chức vụ nhân sự', 'HR'),
    ('DEGREE_MANAGE', 'Quản lý trình độ', 'Quản lý trình độ/bằng cấp', 'HR'),
    ('DIVISION_MANAGE', 'Quản lý phòng ban', 'Quản lý phòng ban', 'HR'),
    ('CONTRACT_MANAGE', 'Quản lý hợp đồng', 'Quản lý hợp đồng nhân sự', 'HR'),

    ('GRADE_ADMIN_MANAGE', 'Admin quản lý điểm', 'Admin cấu hình nhóm điểm và tổng hợp điểm', 'GRADE'),
    ('GRADE_INPUT', 'Giảng viên nhập điểm', 'Giảng viên nhập điểm cho lớp được phân công', 'GRADE'),

    ('STUDENT_SELF_VIEW', 'Sinh viên tự xem hồ sơ', 'Sinh viên tự xem thông tin cá nhân', 'SELF'),
    ('STUDENT_SELF_UPDATE', 'Sinh viên tự sửa hồ sơ', 'Sinh viên tự cập nhật thông tin Person', 'SELF'),
    ('STUDENT_PORTAL_VIEW', 'Sinh viên xem cổng học tập', 'Sinh viên xem lịch, kết quả, học phí và đăng ký', 'SELF'),
    ('INSTRUCTOR_SELF_VIEW', 'Giảng viên tự xem hồ sơ', 'Giảng viên tự xem hồ sơ', 'SELF'),
    ('INSTRUCTOR_SELF_UPDATE', 'Giảng viên tự sửa hồ sơ', 'Giảng viên tự cập nhật thông tin Person', 'SELF'),
    ('INSTRUCTOR_PORTAL_VIEW', 'Giảng viên xem lớp giảng dạy', 'Giảng viên xem lớp, lịch và dữ liệu nhập điểm', 'SELF'),
    ('STAFF_SELF_VIEW', 'Nhân viên tự xem hồ sơ', 'Nhân viên tự xem hồ sơ', 'SELF'),
    ('STAFF_SELF_UPDATE', 'Nhân viên tự sửa hồ sơ', 'Nhân viên tự cập nhật thông tin Person', 'SELF')
) AS src(Code, Name, Description, Module)
ON CONFLICT (Code) DO UPDATE
SET Name = EXCLUDED.Name,
    Description = EXCLUDED.Description,
    Module = EXCLUDED.Module,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO PermissionApis (PermissionId, ApiPath, HttpMethod, Description, IsActive, CreatedAt)
SELECT p.PermissionId, src.ApiPath, src.HttpMethod, src.Description, TRUE, CURRENT_TIMESTAMP
FROM (VALUES
    ('DASHBOARD_ADMIN_VIEW', '/api/v1/dashboard/admin/**', 'GET', 'Xem dashboard admin'),
    ('STUDENT_VIEW', '/api/v1/students/admin/**', 'GET', 'Xem sinh viên'),
    ('STUDENT_CREATE', '/api/v1/students/admin', 'POST', 'Tạo sinh viên'),
    ('STUDENT_IMPORT', '/api/v1/students/admin/import-excel', 'POST', 'Nhập Excel sinh viên'),
    ('STUDENT_EDIT', '/api/v1/students/admin/**', 'PUT', 'Sửa sinh viên'),
    ('STUDENT_DELETE', '/api/v1/students/admin/**', 'DELETE', 'Xóa sinh viên'),
    ('INSTRUCTOR_VIEW', '/api/v1/instructors/admin/**', 'GET', 'Xem giảng viên'),
    ('INSTRUCTOR_CREATE', '/api/v1/instructors/admin', 'POST', 'Tạo giảng viên'),
    ('INSTRUCTOR_EDIT', '/api/v1/instructors/admin/**', 'PUT', 'Sửa giảng viên'),
    ('INSTRUCTOR_DELETE', '/api/v1/instructors/admin/**', 'DELETE', 'Xóa giảng viên'),
    ('STAFF_VIEW', '/api/v1/staffs/admin/**', 'GET', 'Xem nhân viên'),
    ('STAFF_CREATE', '/api/v1/staffs/admin', 'POST', 'Tạo nhân viên'),
    ('STAFF_EDIT', '/api/v1/staffs/admin/**', 'PUT', 'Sửa nhân viên'),
    ('STAFF_DELETE', '/api/v1/staffs/admin/**', 'DELETE', 'Xóa nhân viên'),
    ('USER_VIEW', '/api/v1/users/admin/**', 'GET', 'Xem tài khoản'),
    ('USER_EDIT', '/api/v1/users/admin/**', 'PUT', 'Sửa tài khoản'),
    ('USER_DELETE', '/api/v1/users/admin/**', 'DELETE', 'Xóa tài khoản/phiên'),
    ('ROLE_VIEW', '/api/v1/roles/admin/**', 'GET', 'Xem vai trò'),
    ('ROLE_CREATE', '/api/v1/roles/admin', 'POST', 'Tạo vai trò'),
    ('ROLE_EDIT', '/api/v1/roles/admin/**', 'PUT', 'Sửa vai trò/gán quyền'),
    ('ROLE_DELETE', '/api/v1/roles/admin/**', 'DELETE', 'Xóa vai trò'),
    ('PERMISSION_VIEW', '/api/v1/permissions/admin/**', 'GET', 'Xem quyền'),
    ('PERMISSION_CREATE', '/api/v1/permissions/admin', 'POST', 'Tạo quyền'),
    ('PERMISSION_EDIT', '/api/v1/permissions/admin/**', 'PUT', 'Sửa quyền'),
    ('PERMISSION_EDIT', '/api/v1/permissions/admin/apis', 'POST', 'Gán API cho quyền'),
    ('PERMISSION_DELETE', '/api/v1/permissions/admin/**', 'DELETE', 'Xóa quyền/API'),
    ('MENU_VIEW', '/api/v1/menus/admin/**', 'GET', 'Xem menu'),
    ('MENU_CREATE', '/api/v1/menus/admin', 'POST', 'Tạo menu'),
    ('MENU_EDIT', '/api/v1/menus/admin/**', 'PUT', 'Sửa menu'),
    ('MENU_DELETE', '/api/v1/menus/admin/**', 'DELETE', 'Xóa menu'),
    ('PASSWORD_RESET_MANAGE', '/api/auth/admin/password-reset-requests/**', 'GET', 'Xem yêu cầu đặt lại mật khẩu'),
    ('PASSWORD_RESET_MANAGE', '/api/auth/admin/password-reset-requests/**', 'PUT', 'Duyệt/từ chối yêu cầu đặt lại mật khẩu'),

    ('DEPARTMENT_VIEW', '/api/v1/departments/admin/**', 'GET', 'Xem khoa'),
    ('DEPARTMENT_CREATE', '/api/v1/departments/admin', 'POST', 'Tạo khoa'),
    ('DEPARTMENT_EDIT', '/api/v1/departments/admin/**', 'PUT', 'Sửa khoa'),
    ('DEPARTMENT_DELETE', '/api/v1/departments/admin/**', 'DELETE', 'Xóa khoa'),
    ('MAJOR_VIEW', '/api/v1/majors/admin/**', 'GET', 'Xem ngành'),
    ('MAJOR_CREATE', '/api/v1/majors/admin', 'POST', 'Tạo ngành'),
    ('MAJOR_EDIT', '/api/v1/majors/admin/**', 'PUT', 'Sửa ngành'),
    ('MAJOR_DELETE', '/api/v1/majors/admin/**', 'DELETE', 'Xóa ngành'),
    ('SPECIALIZATION_VIEW', '/api/v1/specializations/admin/**', 'GET', 'Xem chuyên ngành'),
    ('SPECIALIZATION_CREATE', '/api/v1/specializations/admin', 'POST', 'Tạo chuyên ngành'),
    ('SPECIALIZATION_EDIT', '/api/v1/specializations/admin/**', 'PUT', 'Sửa chuyên ngành'),
    ('SPECIALIZATION_DELETE', '/api/v1/specializations/admin/**', 'DELETE', 'Xóa chuyên ngành'),
    ('ACADEMIC_COHORT_VIEW', '/api/v1/academic-cohorts/admin/**', 'GET', 'Xem niên khóa'),
    ('ACADEMIC_COHORT_CREATE', '/api/v1/academic-cohorts/admin', 'POST', 'Tạo niên khóa'),
    ('ACADEMIC_COHORT_EDIT', '/api/v1/academic-cohorts/admin/**', 'PUT', 'Sửa niên khóa'),
    ('ACADEMIC_COHORT_DELETE', '/api/v1/academic-cohorts/admin/**', 'DELETE', 'Xóa niên khóa'),
    ('SCHOOL_YEAR_VIEW', '/api/v1/school-years/admin/**', 'GET', 'Xem năm học'),
    ('SCHOOL_YEAR_CREATE', '/api/v1/school-years/admin', 'POST', 'Tạo năm học'),
    ('SCHOOL_YEAR_EDIT', '/api/v1/school-years/admin/**', 'PUT', 'Sửa năm học'),
    ('SCHOOL_YEAR_DELETE', '/api/v1/school-years/admin/**', 'DELETE', 'Xóa năm học'),
    ('SEMESTER_VIEW', '/api/v1/semesters/admin/**', 'GET', 'Xem học kỳ'),
    ('SEMESTER_CREATE', '/api/v1/semesters/admin', 'POST', 'Tạo học kỳ'),
    ('SEMESTER_EDIT', '/api/v1/semesters/admin/**', 'PUT', 'Sửa học kỳ'),
    ('SEMESTER_DELETE', '/api/v1/semesters/admin/**', 'DELETE', 'Xóa học kỳ'),
    ('TRAINING_PROGRAM_VIEW', '/api/v1/training-programs/admin/**', 'GET', 'Xem chương trình đào tạo'),
    ('TRAINING_PROGRAM_CREATE', '/api/v1/training-programs/admin', 'POST', 'Tạo chương trình đào tạo'),
    ('TRAINING_PROGRAM_EDIT', '/api/v1/training-programs/admin/**', 'PUT', 'Sửa chương trình đào tạo'),
    ('TRAINING_PROGRAM_DELETE', '/api/v1/training-programs/admin/**', 'DELETE', 'Xóa chương trình đào tạo'),
    ('TRAINING_PROGRAM_COURSE_VIEW', '/api/v1/training-program-courses/admin/**', 'GET', 'Xem môn trong chương trình'),

    ('COURSE_VIEW', '/api/v1/courses/**', 'GET', 'Xem môn học'),
    ('COURSE_CREATE', '/api/v1/courses', 'POST', 'Tạo môn học'),
    ('COURSE_EDIT', '/api/v1/courses/**', 'PUT', 'Sửa môn học'),
    ('COURSE_DELETE', '/api/v1/courses/**', 'DELETE', 'Xóa môn học'),
    ('COURSE_CLASS_VIEW', '/api/v1/courses/classes/**', 'GET', 'Xem lớp học phần'),
    ('COURSE_CLASS_CREATE', '/api/v1/courses/classes', 'POST', 'Tạo lớp học phần'),
    ('COURSE_CLASS_EDIT', '/api/v1/courses/classes/**', 'PUT', 'Sửa lớp học phần'),
    ('COURSE_CLASS_DELETE', '/api/v1/courses/classes/**', 'DELETE', 'Xóa lớp học phần'),
    ('COURSE_PREREQUISITE_MANAGE', '/api/v1/course-prerequisites/admin/**', 'GET', 'Xem môn tiên quyết'),
    ('COURSE_PREREQUISITE_MANAGE', '/api/v1/course-prerequisites/admin', 'POST', 'Tạo môn tiên quyết'),
    ('COURSE_PREREQUISITE_MANAGE', '/api/v1/course-prerequisites/admin/**', 'DELETE', 'Xóa môn tiên quyết'),
    ('COURSE_REGISTRATION_RETAKE', '/api/v1/students/me/retake-improvement-registrations/**', 'GET', 'Xem học phần học lại/cải thiện'),
    ('COURSE_REGISTRATION_RETAKE', '/api/v1/students/me/retake-improvement-registrations', 'POST', 'Đăng ký học lại/cải thiện'),

    ('ADMIN_CLASS_VIEW', '/api/v1/classes/admin/**', 'GET', 'Xem lớp hành chính'),
    ('ADMIN_CLASS_CREATE', '/api/v1/classes/admin', 'POST', 'Tạo lớp hành chính'),
    ('ADMIN_CLASS_EDIT', '/api/v1/classes/admin/**', 'PUT', 'Sửa lớp hành chính'),
    ('ADMIN_CLASS_DELETE', '/api/v1/classes/admin/**', 'DELETE', 'Xóa lớp hành chính'),
    ('STUDENT_CLASS_VIEW', '/api/v1/student-classes/admin/**', 'GET', 'Xem phân lớp'),
    ('STUDENT_CLASS_CREATE', '/api/v1/student-classes/admin', 'POST', 'Gán sinh viên vào lớp'),
    ('STUDENT_CLASS_EDIT', '/api/v1/student-classes/admin/**', 'PUT', 'Sửa phân lớp'),
    ('STUDENT_CLASS_DELETE', '/api/v1/student-classes/admin/**', 'DELETE', 'Xóa phân lớp'),
    ('STUDENT_STATUS_MANAGE', '/api/v1/student-status-catalog/admin/**', 'GET', 'Xem danh mục trạng thái'),
    ('STUDENT_STATUS_MANAGE', '/api/v1/student-status-catalog/admin', 'POST', 'Tạo danh mục trạng thái'),
    ('STUDENT_STATUS_MANAGE', '/api/v1/student-status-catalog/admin/**', 'PUT', 'Sửa danh mục trạng thái'),
    ('STUDENT_STATUS_MANAGE', '/api/v1/student-status-histories/admin/**', 'GET', 'Xem lịch sử trạng thái'),
    ('STUDENT_STATUS_MANAGE', '/api/v1/student-status-histories/admin', 'POST', 'Ghi lịch sử trạng thái'),
    ('STUDENT_STATUS_MANAGE', '/api/v1/student-status-histories/admin/**', 'PUT', 'Sửa lịch sử trạng thái'),
    ('STUDENT_SPECIALIZATION_MANAGE', '/api/v1/student-specializations/admin/**', 'GET', 'Xem chuyên ngành sinh viên'),
    ('STUDENT_SPECIALIZATION_MANAGE', '/api/v1/student-specializations/admin/assign', 'POST', 'Gán chuyên ngành sinh viên'),

    ('SCHEDULE_VIEW', '/api/v1/schedules/**', 'GET', 'Xem lịch học'),
    ('SCHEDULE_CREATE', '/api/v1/schedules', 'POST', 'Tạo lịch học'),
    ('SCHEDULE_EDIT', '/api/v1/schedules/**', 'PUT', 'Sửa lịch học'),
    ('SCHEDULE_DELETE', '/api/v1/schedules/**', 'DELETE', 'Xóa lịch học'),
    ('AUTO_SCHEDULE_MANAGE', '/api/v1/auto-schedules/**', 'POST', 'Tự động xếp lịch'),
    ('AUTO_SCHEDULE_MANAGE', '/api/v1/auto-schedules/**', 'GET', 'Xem trạng thái xếp lịch'),
    ('TEACHING_ASSIGNMENT_MANAGE', '/api/v1/teaching-assignments/admin/**', 'GET', 'Xem phân công giảng dạy'),
    ('TEACHING_ASSIGNMENT_MANAGE', '/api/v1/teaching-assignments/admin', 'POST', 'Tạo phân công giảng dạy'),
    ('TEACHING_PROGRESS_MANAGE', '/api/v1/teaching-progress/admin/**', 'GET', 'Xem tiến độ giảng dạy'),
    ('TEACHING_PROGRESS_MANAGE', '/api/v1/teaching-progress/admin', 'POST', 'Ghi nhận tiến độ giảng dạy'),
    ('SCHEDULE_ADJUSTMENT_VIEW', '/api/v1/schedule-adjustments/**', 'GET', 'Xem yêu cầu điều chỉnh lịch'),
    ('SCHEDULE_ADJUSTMENT_CREATE', '/api/v1/schedule-adjustments', 'POST', 'Tạo yêu cầu điều chỉnh lịch'),
    ('SCHEDULE_ADJUSTMENT_VALIDATE', '/api/v1/schedule-adjustments/validate', 'POST', 'Kiểm tra lịch bù'),
    ('SCHEDULE_ADJUSTMENT_VALIDATE', '/api/v1/schedule-adjustments/suggestions', 'POST', 'Gợi ý lịch bù'),
    ('SCHEDULE_ADJUSTMENT_APPROVE', '/api/v1/schedule-adjustments/admin/**', 'POST', 'Duyệt yêu cầu lịch'),
    ('SCHEDULE_ADJUSTMENT_APPROVE', '/api/v1/admin/schedule-adjustments/**', 'POST', 'Duyệt yêu cầu lịch'),
    ('SCHEDULE_ADJUSTMENT_APPROVE', '/api/v1/admin/schedule-adjustments/**', 'GET', 'Xem yêu cầu lịch admin'),

    ('ROOM_MANAGE', '/api/v1/buildings/**', 'GET', 'Xem tòa nhà'),
    ('ROOM_MANAGE', '/api/v1/buildings', 'POST', 'Tạo tòa nhà'),
    ('ROOM_MANAGE', '/api/v1/buildings/**', 'PUT', 'Sửa tòa nhà'),
    ('ROOM_MANAGE', '/api/v1/buildings/**', 'DELETE', 'Xóa tòa nhà'),
    ('ROOM_MANAGE', '/api/v1/rooms/**', 'GET', 'Xem phòng học'),
    ('ROOM_MANAGE', '/api/v1/rooms', 'POST', 'Tạo phòng học'),
    ('ROOM_MANAGE', '/api/v1/rooms/**', 'PUT', 'Sửa phòng học'),
    ('ROOM_MANAGE', '/api/v1/rooms/**', 'DELETE', 'Xóa phòng học'),
    ('TIME_SLOT_MANAGE', '/api/v1/time-slots/**', 'GET', 'Xem ca học'),
    ('TIME_SLOT_MANAGE', '/api/v1/time-slots', 'POST', 'Tạo ca học'),
    ('TIME_SLOT_MANAGE', '/api/v1/time-slots/**', 'PUT', 'Sửa ca học'),
    ('TIME_SLOT_MANAGE', '/api/v1/time-slots/**', 'DELETE', 'Xóa ca học'),
    ('POSITION_MANAGE', '/api/v1/positions/admin/**', 'GET', 'Xem chức vụ'),
    ('POSITION_MANAGE', '/api/v1/positions/admin', 'POST', 'Tạo chức vụ'),
    ('POSITION_MANAGE', '/api/v1/positions/admin/**', 'PUT', 'Sửa chức vụ'),
    ('POSITION_MANAGE', '/api/v1/positions/admin/**', 'DELETE', 'Xóa chức vụ'),
    ('DEGREE_MANAGE', '/api/v1/degrees/admin/**', 'GET', 'Xem trình độ'),
    ('DEGREE_MANAGE', '/api/v1/degrees/admin', 'POST', 'Tạo trình độ'),
    ('DEGREE_MANAGE', '/api/v1/degrees/admin/**', 'PUT', 'Sửa trình độ'),
    ('DEGREE_MANAGE', '/api/v1/degrees/admin/**', 'DELETE', 'Xóa trình độ'),
    ('DIVISION_MANAGE', '/api/v1/divisions/admin/**', 'GET', 'Xem phòng ban'),
    ('DIVISION_MANAGE', '/api/v1/divisions/admin', 'POST', 'Tạo phòng ban'),
    ('DIVISION_MANAGE', '/api/v1/divisions/admin/**', 'PUT', 'Sửa phòng ban'),
    ('DIVISION_MANAGE', '/api/v1/divisions/admin/**', 'DELETE', 'Xóa phòng ban'),
    ('CONTRACT_MANAGE', '/api/v1/contracts/admin/**', 'GET', 'Xem hợp đồng'),
    ('CONTRACT_MANAGE', '/api/v1/contracts/admin', 'POST', 'Tạo hợp đồng'),
    ('CONTRACT_MANAGE', '/api/v1/contracts/admin/**', 'PUT', 'Sửa hợp đồng'),
    ('CONTRACT_MANAGE', '/api/v1/contracts/admin/**', 'DELETE', 'Xóa hợp đồng'),

    ('GRADE_ADMIN_MANAGE', '/api/v1/admin/grades/**', 'GET', 'Admin xem điểm'),
    ('GRADE_ADMIN_MANAGE', '/api/v1/admin/grades/**', 'POST', 'Admin cập nhật điểm'),
    ('GRADE_ADMIN_MANAGE', '/api/v1/admin/grades/**', 'PUT', 'Admin sửa điểm'),
    ('GRADE_INPUT', '/api/v1/instructors/grades/**', 'GET', 'Giảng viên xem lớp nhập điểm'),
    ('GRADE_INPUT', '/api/v1/instructors/grades/**', 'POST', 'Giảng viên nhập điểm'),

    ('STUDENT_SELF_VIEW', '/api/v1/students/me', 'GET', 'Sinh viên xem hồ sơ'),
    ('STUDENT_SELF_UPDATE', '/api/v1/students/me', 'PUT', 'Sinh viên sửa hồ sơ'),
    ('STUDENT_PORTAL_VIEW', '/api/v1/students/me/**', 'GET', 'Sinh viên xem cổng học tập'),
    ('INSTRUCTOR_SELF_VIEW', '/api/v1/instructors/me', 'GET', 'Giảng viên xem hồ sơ'),
    ('INSTRUCTOR_SELF_UPDATE', '/api/v1/instructors/me', 'PUT', 'Giảng viên sửa hồ sơ'),
    ('INSTRUCTOR_PORTAL_VIEW', '/api/v1/instructors/me/**', 'GET', 'Giảng viên xem cổng giảng dạy'),
    ('STAFF_SELF_VIEW', '/api/v1/staffs/me', 'GET', 'Nhân viên xem hồ sơ'),
    ('STAFF_SELF_UPDATE', '/api/v1/staffs/me', 'PUT', 'Nhân viên sửa hồ sơ')
) AS src(Code, ApiPath, HttpMethod, Description)
JOIN Permissions p ON p.Code = src.Code
ON CONFLICT (PermissionId, ApiPath, HttpMethod) DO UPDATE
SET Description = EXCLUDED.Description,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Code IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'DASHBOARD_ADMIN_VIEW',
    'STUDENT_VIEW', 'STUDENT_CREATE', 'STUDENT_EDIT', 'STUDENT_IMPORT',
    'INSTRUCTOR_VIEW', 'INSTRUCTOR_CREATE', 'INSTRUCTOR_EDIT',
    'STAFF_VIEW', 'STAFF_CREATE', 'STAFF_EDIT',
    'DEPARTMENT_VIEW', 'DEPARTMENT_CREATE', 'DEPARTMENT_EDIT',
    'MAJOR_VIEW', 'MAJOR_CREATE', 'MAJOR_EDIT',
    'SPECIALIZATION_VIEW', 'SPECIALIZATION_CREATE', 'SPECIALIZATION_EDIT',
    'ACADEMIC_COHORT_VIEW', 'ACADEMIC_COHORT_CREATE', 'ACADEMIC_COHORT_EDIT',
    'SCHOOL_YEAR_VIEW', 'SCHOOL_YEAR_CREATE', 'SCHOOL_YEAR_EDIT',
    'SEMESTER_VIEW', 'SEMESTER_CREATE', 'SEMESTER_EDIT',
    'TRAINING_PROGRAM_VIEW', 'TRAINING_PROGRAM_CREATE', 'TRAINING_PROGRAM_EDIT',
    'TRAINING_PROGRAM_COURSE_VIEW',
    'COURSE_VIEW', 'COURSE_CREATE', 'COURSE_EDIT',
    'COURSE_CLASS_VIEW', 'COURSE_CLASS_CREATE', 'COURSE_CLASS_EDIT',
    'COURSE_PREREQUISITE_MANAGE',
    'ADMIN_CLASS_VIEW', 'ADMIN_CLASS_CREATE', 'ADMIN_CLASS_EDIT',
    'STUDENT_CLASS_VIEW', 'STUDENT_CLASS_CREATE', 'STUDENT_CLASS_EDIT',
    'STUDENT_STATUS_MANAGE', 'STUDENT_SPECIALIZATION_MANAGE',
    'SCHEDULE_VIEW', 'SCHEDULE_CREATE', 'SCHEDULE_EDIT',
    'AUTO_SCHEDULE_MANAGE', 'TEACHING_ASSIGNMENT_MANAGE', 'TEACHING_PROGRESS_MANAGE',
    'SCHEDULE_ADJUSTMENT_VIEW', 'SCHEDULE_ADJUSTMENT_VALIDATE', 'SCHEDULE_ADJUSTMENT_APPROVE',
    'ROOM_MANAGE', 'TIME_SLOT_MANAGE', 'POSITION_MANAGE', 'DEGREE_MANAGE', 'DIVISION_MANAGE', 'CONTRACT_MANAGE',
    'GRADE_ADMIN_MANAGE', 'PASSWORD_RESET_MANAGE',
    'USER_VIEW'
)
WHERE r.Code = 'STAFF'
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'INSTRUCTOR_SELF_VIEW', 'INSTRUCTOR_SELF_UPDATE', 'INSTRUCTOR_PORTAL_VIEW',
    'SCHEDULE_VIEW', 'SCHEDULE_ADJUSTMENT_VIEW', 'SCHEDULE_ADJUSTMENT_CREATE', 'SCHEDULE_ADJUSTMENT_VALIDATE',
    'GRADE_INPUT'
)
WHERE r.Code = 'LECTURER'
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

INSERT INTO RolePermissions (RoleId, PermissionId, IsActive, CreatedAt)
SELECT r.RoleId, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM Roles r
JOIN Permissions p ON p.Code IN (
    'STUDENT_SELF_VIEW', 'STUDENT_SELF_UPDATE', 'STUDENT_PORTAL_VIEW', 'COURSE_REGISTRATION_RETAKE'
)
WHERE r.Code = 'STUDENT'
ON CONFLICT (RoleId, PermissionId) DO UPDATE
SET IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP;

WITH root_seed(title, icon, order_index) AS (
    VALUES
        ('Tổng quan', 'layout-dashboard', 10),
        ('Hồ sơ & tài khoản', 'users', 20),
        ('Đào tạo', 'graduation-cap', 30),
        ('Học vụ', 'book-open', 40),
        ('Giảng dạy', 'calendar-days', 50),
        ('Cơ sở vật chất', 'building', 60),
        ('Hệ thống', 'shield-check', 90)
)
INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), NULL, title, NULL, icon, order_index, 0, NULL, TRUE, CURRENT_TIMESTAMP
FROM root_seed src
WHERE NOT EXISTS (
    SELECT 1 FROM Menus m WHERE m.ParentId IS NULL AND m.MenuTitle = src.title AND m.DeletedAt IS NULL
);

WITH menu_seed(title, url, icon, order_index, parent_title, permission_code) AS (
    VALUES
        ('Dashboard admin', '/dashboard/admin', 'layout-dashboard', 11, 'Tổng quan', 'DASHBOARD_ADMIN_VIEW'),
        ('Sinh viên', '/dashboard/admin/students', 'users', 21, 'Hồ sơ & tài khoản', 'STUDENT_VIEW'),
        ('Giảng viên', '/dashboard/admin/lecturers', 'user', 22, 'Hồ sơ & tài khoản', 'INSTRUCTOR_VIEW'),
        ('Nhân viên', '/dashboard/admin/staffs', 'briefcase', 23, 'Hồ sơ & tài khoản', 'STAFF_VIEW'),
        ('Tài khoản người dùng', '/dashboard/admin/users', 'shield', 24, 'Hồ sơ & tài khoản', 'USER_VIEW'),
        ('Khoa', '/dashboard/admin/departments', 'landmark', 31, 'Đào tạo', 'DEPARTMENT_VIEW'),
        ('Ngành', '/dashboard/admin/majors', 'layers', 32, 'Đào tạo', 'MAJOR_VIEW'),
        ('Chuyên ngành', '/dashboard/admin/specializations', 'git-branch', 33, 'Đào tạo', 'SPECIALIZATION_VIEW'),
        ('Niên khóa đào tạo', '/dashboard/admin/academic-cohorts', 'calendar-range', 34, 'Đào tạo', 'ACADEMIC_COHORT_VIEW'),
        ('Năm học', '/dashboard/admin/school-years', 'calendar-days', 35, 'Đào tạo', 'SCHOOL_YEAR_VIEW'),
        ('Học kỳ', '/dashboard/admin/semesters', 'calendar-clock', 36, 'Đào tạo', 'SEMESTER_VIEW'),
        ('Chương trình đào tạo', '/dashboard/admin/training-programs', 'book-marked', 37, 'Đào tạo', 'TRAINING_PROGRAM_VIEW'),
        ('Môn học', '/dashboard/admin/courses', 'library-big', 41, 'Học vụ', 'COURSE_VIEW'),
        ('Lớp học phần', '/dashboard/admin/course-classes', 'presentation', 42, 'Học vụ', 'COURSE_CLASS_VIEW'),
        ('Lớp hành chính', '/dashboard/admin/classes', 'users-round', 43, 'Học vụ', 'ADMIN_CLASS_VIEW'),
        ('Phân lớp sinh viên', '/dashboard/admin/student-class-assignments', 'user-plus', 44, 'Học vụ', 'STUDENT_CLASS_VIEW'),
        ('Lịch học', '/dashboard/admin/schedules', 'calendar-days', 51, 'Giảng dạy', 'SCHEDULE_VIEW'),
        ('Phân công giảng dạy', '/dashboard/admin/teaching-assignments', 'clipboard-list', 52, 'Giảng dạy', 'TEACHING_ASSIGNMENT_MANAGE'),
        ('Tiến độ giảng dạy', '/dashboard/admin/teaching-progress', 'activity', 53, 'Giảng dạy', 'TEACHING_PROGRESS_MANAGE'),
        ('Duyệt điều chỉnh lịch', '/dashboard/admin/schedule-adjustments', 'calendar-sync', 54, 'Giảng dạy', 'SCHEDULE_ADJUSTMENT_APPROVE'),
        ('Tòa nhà', '/dashboard/admin/buildings', 'building', 61, 'Cơ sở vật chất', 'ROOM_MANAGE'),
        ('Phòng học', '/dashboard/admin/rooms', 'door-open', 62, 'Cơ sở vật chất', 'ROOM_MANAGE'),
        ('Ca học', '/dashboard/admin/time-slots', 'clock', 63, 'Cơ sở vật chất', 'TIME_SLOT_MANAGE'),
        ('Phòng ban', '/dashboard/admin/divisions', 'network', 64, 'Cơ sở vật chất', 'DIVISION_MANAGE'),
        ('Chức vụ', '/dashboard/admin/positions', 'badge-check', 65, 'Cơ sở vật chất', 'POSITION_MANAGE'),
        ('Trình độ', '/dashboard/admin/degrees', 'graduation-cap', 66, 'Cơ sở vật chất', 'DEGREE_MANAGE'),
        ('Hợp đồng', '/dashboard/admin/contracts', 'file-text', 67, 'Cơ sở vật chất', 'CONTRACT_MANAGE'),
        ('Quản lý điểm', '/dashboard/admin/grades', 'file-check', 71, 'Học vụ', 'GRADE_ADMIN_MANAGE'),
        ('Phân quyền RBAC', '/dashboard/admin/rbac', 'shield-check', 91, 'Hệ thống', 'ROLE_VIEW'),
        ('Yêu cầu đặt lại mật khẩu', '/dashboard/admin/password-reset-requests', 'key-round', 92, 'Hệ thống', 'PASSWORD_RESET_MANAGE')
)
INSERT INTO Menus (MenuId, ParentId, MenuTitle, MenuUrl, MenuIcon, OrderIndex, MenuType, PermissionId, IsActive, CreatedAt)
SELECT gen_random_uuid(), parent.MenuId, src.title, src.url, src.icon, src.order_index, 1, p.PermissionId, TRUE, CURRENT_TIMESTAMP
FROM menu_seed src
JOIN Menus parent ON parent.MenuTitle = src.parent_title AND parent.ParentId IS NULL AND parent.DeletedAt IS NULL
JOIN Permissions p ON p.Code = src.permission_code
WHERE NOT EXISTS (
    SELECT 1 FROM Menus m WHERE m.MenuUrl = src.url AND m.DeletedAt IS NULL
);

WITH menu_seed(title, url, icon, order_index, parent_title, permission_code) AS (
    VALUES
        ('Dashboard admin', '/dashboard/admin', 'layout-dashboard', 11, 'Tổng quan', 'DASHBOARD_ADMIN_VIEW'),
        ('Sinh viên', '/dashboard/admin/students', 'users', 21, 'Hồ sơ & tài khoản', 'STUDENT_VIEW'),
        ('Giảng viên', '/dashboard/admin/lecturers', 'user', 22, 'Hồ sơ & tài khoản', 'INSTRUCTOR_VIEW'),
        ('Nhân viên', '/dashboard/admin/staffs', 'briefcase', 23, 'Hồ sơ & tài khoản', 'STAFF_VIEW'),
        ('Tài khoản người dùng', '/dashboard/admin/users', 'shield', 24, 'Hồ sơ & tài khoản', 'USER_VIEW'),
        ('Khoa', '/dashboard/admin/departments', 'landmark', 31, 'Đào tạo', 'DEPARTMENT_VIEW'),
        ('Ngành', '/dashboard/admin/majors', 'layers', 32, 'Đào tạo', 'MAJOR_VIEW'),
        ('Chuyên ngành', '/dashboard/admin/specializations', 'git-branch', 33, 'Đào tạo', 'SPECIALIZATION_VIEW'),
        ('Niên khóa đào tạo', '/dashboard/admin/academic-cohorts', 'calendar-range', 34, 'Đào tạo', 'ACADEMIC_COHORT_VIEW'),
        ('Năm học', '/dashboard/admin/school-years', 'calendar-days', 35, 'Đào tạo', 'SCHOOL_YEAR_VIEW'),
        ('Học kỳ', '/dashboard/admin/semesters', 'calendar-clock', 36, 'Đào tạo', 'SEMESTER_VIEW'),
        ('Chương trình đào tạo', '/dashboard/admin/training-programs', 'book-marked', 37, 'Đào tạo', 'TRAINING_PROGRAM_VIEW'),
        ('Môn học', '/dashboard/admin/courses', 'library-big', 41, 'Học vụ', 'COURSE_VIEW'),
        ('Lớp học phần', '/dashboard/admin/course-classes', 'presentation', 42, 'Học vụ', 'COURSE_CLASS_VIEW'),
        ('Lớp hành chính', '/dashboard/admin/classes', 'users-round', 43, 'Học vụ', 'ADMIN_CLASS_VIEW'),
        ('Phân lớp sinh viên', '/dashboard/admin/student-class-assignments', 'user-plus', 44, 'Học vụ', 'STUDENT_CLASS_VIEW'),
        ('Lịch học', '/dashboard/admin/schedules', 'calendar-days', 51, 'Giảng dạy', 'SCHEDULE_VIEW'),
        ('Phân công giảng dạy', '/dashboard/admin/teaching-assignments', 'clipboard-list', 52, 'Giảng dạy', 'TEACHING_ASSIGNMENT_MANAGE'),
        ('Tiến độ giảng dạy', '/dashboard/admin/teaching-progress', 'activity', 53, 'Giảng dạy', 'TEACHING_PROGRESS_MANAGE'),
        ('Duyệt điều chỉnh lịch', '/dashboard/admin/schedule-adjustments', 'calendar-sync', 54, 'Giảng dạy', 'SCHEDULE_ADJUSTMENT_APPROVE'),
        ('Tòa nhà', '/dashboard/admin/buildings', 'building', 61, 'Cơ sở vật chất', 'ROOM_MANAGE'),
        ('Phòng học', '/dashboard/admin/rooms', 'door-open', 62, 'Cơ sở vật chất', 'ROOM_MANAGE'),
        ('Ca học', '/dashboard/admin/time-slots', 'clock', 63, 'Cơ sở vật chất', 'TIME_SLOT_MANAGE'),
        ('Phòng ban', '/dashboard/admin/divisions', 'network', 64, 'Cơ sở vật chất', 'DIVISION_MANAGE'),
        ('Chức vụ', '/dashboard/admin/positions', 'badge-check', 65, 'Cơ sở vật chất', 'POSITION_MANAGE'),
        ('Trình độ', '/dashboard/admin/degrees', 'graduation-cap', 66, 'Cơ sở vật chất', 'DEGREE_MANAGE'),
        ('Hợp đồng', '/dashboard/admin/contracts', 'file-text', 67, 'Cơ sở vật chất', 'CONTRACT_MANAGE'),
        ('Quản lý điểm', '/dashboard/admin/grades', 'file-check', 71, 'Học vụ', 'GRADE_ADMIN_MANAGE'),
        ('Phân quyền RBAC', '/dashboard/admin/rbac', 'shield-check', 91, 'Hệ thống', 'ROLE_VIEW'),
        ('Yêu cầu đặt lại mật khẩu', '/dashboard/admin/password-reset-requests', 'key-round', 92, 'Hệ thống', 'PASSWORD_RESET_MANAGE')
)
UPDATE Menus m
SET MenuTitle = src.title,
    MenuIcon = src.icon,
    OrderIndex = src.order_index,
    MenuType = 1,
    ParentId = parent.MenuId,
    PermissionId = p.PermissionId,
    IsActive = TRUE,
    DeletedAt = NULL,
    UpdatedAt = CURRENT_TIMESTAMP
FROM menu_seed src
JOIN Menus parent ON parent.MenuTitle = src.parent_title AND parent.ParentId IS NULL AND parent.DeletedAt IS NULL
JOIN Permissions p ON p.Code = src.permission_code
WHERE m.MenuUrl = src.url;
