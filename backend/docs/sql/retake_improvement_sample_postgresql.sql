-- Dữ liệu mẫu kiểm tra luồng đăng ký học lại/cải thiện.
-- Chạy trên PostgreSQL sau khi Flyway migrate xong.
-- Sau khi insert, gọi:
--   GET  /api/v1/students/me/retake-improvement-registrations/options
--   POST /api/v1/students/me/retake-improvement-registrations
--
-- Tài khoản mẫu: sv_retake_demo. Mật khẩu trong script chỉ là hash placeholder,
-- nếu muốn đăng nhập thật hãy reset mật khẩu bằng luồng auth/admin hiện có.

DO $$
DECLARE
    v_department_id UUID;
    v_major_id UUID;
    v_cohort_id UUID;
    v_program_id UUID;
    v_school_year_id UUID;
    v_old_semester_id UUID;
    v_current_semester_id UUID;
    v_old_period_id UUID;
    v_failed_course_id UUID;
    v_passed_course_id UUID;
    v_failed_old_class_id UUID;
    v_passed_old_class_id UUID;
    v_failed_retake_class_id UUID;
    v_passed_improve_class_id UUID;
    v_person_id UUID;
    v_student_id UUID;
    v_failed_previous_registration_id UUID;
    v_passed_previous_registration_id UUID;
BEGIN
    INSERT INTO Departments (Code, Name, IsActive)
    VALUES ('DEMO-REG', 'Khoa demo đăng ký học lại', TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING DepartmentId INTO v_department_id;

    INSERT INTO Majors (DepartmentId, Code, Name, IsActive)
    VALUES (v_department_id, 'DEMOREG', 'Ngành demo đăng ký', TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING MajorId INTO v_major_id;

    INSERT INTO AcademicCohorts (Code, Name, StartYear, EndYear, IsActive)
    VALUES ('KDEMO25', 'Khóa demo 2025', 2025, 2029, TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING AcademicCohortId INTO v_cohort_id;

    INSERT INTO TrainingPrograms (Code, Name, MajorId, DepartmentId, AcademicCohortId, Status, IsActive)
    VALUES ('TP-DEMO-REG', 'CTĐT demo đăng ký học lại', v_major_id, v_department_id, v_cohort_id, 'ACTIVE', TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING TrainingProgramId INTO v_program_id;

    INSERT INTO Courses (DepartmentId, Code, Name, CourseType, Credits, IsActive)
    VALUES (v_department_id, 'DEMO-FAIL', 'Môn demo học lại', 'THEORY', 3, TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING CourseId INTO v_failed_course_id;

    INSERT INTO Courses (DepartmentId, Code, Name, CourseType, Credits, IsActive)
    VALUES (v_department_id, 'DEMO-PASS', 'Môn demo cải thiện', 'THEORY', 3, TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING CourseId INTO v_passed_course_id;

    INSERT INTO TrainingProgramCourses (TrainingProgramId, CourseId, IsRequired, Credits, Status, IsActive)
    VALUES (v_program_id, v_failed_course_id, TRUE, 3, 'ACTIVE', TRUE)
    ON CONFLICT (TrainingProgramId, CourseId) DO UPDATE SET IsActive = TRUE;

    INSERT INTO TrainingProgramCourses (TrainingProgramId, CourseId, IsRequired, Credits, Status, IsActive)
    VALUES (v_program_id, v_passed_course_id, TRUE, 3, 'ACTIVE', TRUE)
    ON CONFLICT (TrainingProgramId, CourseId) DO UPDATE SET IsActive = TRUE;

    INSERT INTO SchoolYears (Code, Name, StartDate, EndDate, IsActive)
    VALUES ('SY-DEMO-REG', 'Năm học demo đăng ký', CURRENT_DATE - INTERVAL '180 days', CURRENT_DATE + INTERVAL '180 days', TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING SchoolYearId INTO v_school_year_id;

    INSERT INTO Semesters (Code, Name, SchoolYearId, StartDate, EndDate, Status, IsActive)
    VALUES ('HK-DEMO-OLD', 'Học kỳ cũ demo', v_school_year_id, CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE - INTERVAL '60 days', TRUE, TRUE)
    ON CONFLICT (SchoolYearId, Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING SemesterId INTO v_old_semester_id;

    INSERT INTO Semesters (Code, Name, SchoolYearId, StartDate, EndDate, Status, IsActive)
    VALUES ('HK-DEMO-CUR', 'Học kỳ hiện tại demo', v_school_year_id, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '90 days', TRUE, TRUE)
    ON CONFLICT (SchoolYearId, Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING SemesterId INTO v_current_semester_id;

    INSERT INTO RegistrationPeriods (Code, Name, SemesterId, StartDate, EndDate, Status, AllowRetake, IsActive)
    VALUES ('RP-DEMO-OLD', 'Đợt cũ demo', v_old_semester_id, CURRENT_TIMESTAMP - INTERVAL '150 days', CURRENT_TIMESTAMP - INTERVAL '60 days', 1, TRUE, TRUE)
    ON CONFLICT (Code) DO UPDATE SET Name = EXCLUDED.Name
    RETURNING RegistrationPeriodId INTO v_old_period_id;

    INSERT INTO RegistrationPeriods (Code, Name, SemesterId, StartDate, EndDate, Status, AllowRetake, IsActive)
    VALUES ('RP-DEMO-CUR', 'Đợt đăng ký học lại/cải thiện demo', v_current_semester_id, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '20 days', 1, TRUE, TRUE)
    ON CONFLICT (Code) DO UPDATE SET EndDate = EXCLUDED.EndDate, AllowRetake = TRUE, IsActive = TRUE;

    INSERT INTO CourseClasses (ClassCode, MaxStudent, CurrentStudent, Status, SemesterId, CourseId, StartDate, EndDate, IsActive)
    VALUES ('DEMO-FAIL-OLD', 40, 1, 'CLOSED', v_old_semester_id, v_failed_course_id, CURRENT_DATE - INTERVAL '140 days', CURRENT_DATE - INTERVAL '70 days', TRUE)
    ON CONFLICT (SemesterId, CourseId, ClassCode) DO UPDATE SET CurrentStudent = 1
    RETURNING CourseClassId INTO v_failed_old_class_id;

    INSERT INTO CourseClasses (ClassCode, MaxStudent, CurrentStudent, Status, SemesterId, CourseId, StartDate, EndDate, IsActive)
    VALUES ('DEMO-PASS-OLD', 40, 1, 'CLOSED', v_old_semester_id, v_passed_course_id, CURRENT_DATE - INTERVAL '140 days', CURRENT_DATE - INTERVAL '70 days', TRUE)
    ON CONFLICT (SemesterId, CourseId, ClassCode) DO UPDATE SET CurrentStudent = 1
    RETURNING CourseClassId INTO v_passed_old_class_id;

    INSERT INTO CourseClasses (ClassCode, MaxStudent, CurrentStudent, Status, SemesterId, CourseId, StartDate, EndDate, IsActive)
    VALUES ('DEMO-FAIL-RETAKE', 40, 0, 'OPEN', v_current_semester_id, v_failed_course_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', TRUE)
    ON CONFLICT (SemesterId, CourseId, ClassCode) DO UPDATE SET CurrentStudent = 0, Status = 'OPEN'
    RETURNING CourseClassId INTO v_failed_retake_class_id;

    INSERT INTO CourseClasses (ClassCode, MaxStudent, CurrentStudent, Status, SemesterId, CourseId, StartDate, EndDate, IsActive)
    VALUES ('DEMO-PASS-IMPROVE', 40, 0, 'OPEN', v_current_semester_id, v_passed_course_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', TRUE)
    ON CONFLICT (SemesterId, CourseId, ClassCode) DO UPDATE SET CurrentStudent = 0, Status = 'OPEN'
    RETURNING CourseClassId INTO v_passed_improve_class_id;

    INSERT INTO Persons (FullName, ContactEmail, IsActive)
    VALUES ('Sinh viên demo học lại', 'sv_retake_demo@donga.edu.vn', TRUE)
    RETURNING PersonId INTO v_person_id;

    INSERT INTO Students (PersonId, StudentCode, TrainingProgramId, DepartmentId, MajorId, AcademicCohortId, AdmissionDate, IsActive)
    VALUES (v_person_id, 'SVRETAKEDEMO', v_program_id, v_department_id, v_major_id, v_cohort_id, CURRENT_DATE - INTERVAL '1 year', TRUE)
    ON CONFLICT (StudentCode) DO UPDATE SET TrainingProgramId = EXCLUDED.TrainingProgramId
    RETURNING StudentId INTO v_student_id;

    INSERT INTO Users (PersonId, Username, PasswordHash, Email, RequirePasswordChange, EmailConfirmed, IsActive)
    VALUES (v_person_id, 'sv_retake_demo', '$2a$10$uems.sample.hash.only', 'sv_retake_demo@donga.edu.vn', TRUE, TRUE, TRUE)
    ON CONFLICT (Username) DO NOTHING;

    INSERT INTO CourseRegistrations (StudentId, CourseClassId, RegistrationPeriodId, RegisteredAt, Status, IsPaid, IsActive)
    VALUES (v_student_id, v_failed_old_class_id, v_old_period_id, CURRENT_TIMESTAMP - INTERVAL '90 days', 1, TRUE, TRUE)
    RETURNING CourseRegistrationId INTO v_failed_previous_registration_id;

    INSERT INTO CourseRegistrations (StudentId, CourseClassId, RegistrationPeriodId, RegisteredAt, Status, IsPaid, IsActive)
    VALUES (v_student_id, v_passed_old_class_id, v_old_period_id, CURRENT_TIMESTAMP - INTERVAL '90 days', 1, TRUE, TRUE)
    RETURNING CourseRegistrationId INTO v_passed_previous_registration_id;

    INSERT INTO StudentSummaries (CourseRegistrationId, TotalScore, LetterGrade, GpaValue, Result, IsFinalized, IsActive)
    VALUES (v_failed_previous_registration_id, 3.50, 'F', 0.00, 'FAILED', TRUE, TRUE);

    INSERT INTO StudentSummaries (CourseRegistrationId, TotalScore, LetterGrade, GpaValue, Result, IsFinalized, IsActive)
    VALUES (v_passed_previous_registration_id, 7.50, 'B', 3.00, 'PASSED', TRUE, TRUE);

    RAISE NOTICE 'Demo ready: failed class %, improvement class %', v_failed_retake_class_id, v_passed_improve_class_id;
END $$;
