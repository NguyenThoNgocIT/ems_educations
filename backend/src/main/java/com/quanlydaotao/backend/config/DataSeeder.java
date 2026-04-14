package com.quanlydaotao.backend.config;

import com.quanlydaotao.backend.building.Building;
import com.quanlydaotao.backend.building.BuildingRepository;
import com.quanlydaotao.backend.courseclass.CourseClass;
import com.quanlydaotao.backend.courseclass.CourseClassRepository;
import com.quanlydaotao.backend.lecturer.LecturerRepository;
import com.quanlydaotao.backend.lecturercourseclass.LecturerCourseClass;
import com.quanlydaotao.backend.lecturercourseclass.LecturerCourseClassRepository;
import com.quanlydaotao.backend.gradescale.GradeScale;
import com.quanlydaotao.backend.gradescale.GradeScaleRepository;
import com.quanlydaotao.backend.major.Major;
import com.quanlydaotao.backend.major.MajorRepository;
import com.quanlydaotao.backend.setting.Setting;
import com.quanlydaotao.backend.setting.SettingRepository;
import com.quanlydaotao.backend.room.Room;
import com.quanlydaotao.backend.room.RoomRepository;
import com.quanlydaotao.backend.semester.Semester;
import com.quanlydaotao.backend.semester.SemesterRepository;
import com.quanlydaotao.backend.subject.Subject;
import com.quanlydaotao.backend.subject.SubjectRepository;
import com.quanlydaotao.backend.trainingprogram.TrainingProgram;
import com.quanlydaotao.backend.trainingprogram.TrainingProgramRepository;
import com.quanlydaotao.backend.user.Role;
import com.quanlydaotao.backend.user.User;
import com.quanlydaotao.backend.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MajorRepository majorRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final SubjectRepository subjectRepository;
    private final BuildingRepository buildingRepository;
    private final RoomRepository roomRepository;
    private final SemesterRepository semesterRepository;
    private final CourseClassRepository courseClassRepository;
    private final LecturerRepository lecturerRepository;
    private final LecturerCourseClassRepository lecturerCourseClassRepository;
    private final GradeScaleRepository gradeScaleRepository;
    private final SettingRepository settingRepository;

    @Override
    public void run(String... args) {
        seedUsers();
        seedMajors();
        seedTrainingPrograms();
        seedSubjects();
        seedBuildings();
        seedRooms();
        seedSemesters();
        seedCourseClasses();
        seedLecturerCourseClasses();
        seedGradeScales();
        seedSettings();
    }

    private void seedUsers() {
        List<UserSeed> users = List.of(
                new UserSeed("Admin", "DongA", "admin@donga.edu.vn", "admin123@.", Role.ADMIN),
                new UserSeed("Student 1", "DongA", "sv001@donga.edu.vn", "sv001@.", Role.STUDENT),
                new UserSeed("Student 2", "DongA", "sv002@donga.edu.vn", "sv002@.", Role.STUDENT),
                new UserSeed("Student 3", "DongA", "sv003@donga.edu.vn", "sv003@.", Role.STUDENT),
                new UserSeed("Teacher 1", "DongA", "gv001@donga.edu.vn", "gv001@.", Role.TEACHER),
                new UserSeed("Teacher 2", "DongA", "gv002@donga.edu.vn", "gv002@.", Role.TEACHER),
                new UserSeed("Manager 1", "DongA", "ns001@donga.edu.vn", "ns001@.", Role.MANAGER),
                new UserSeed("Manager 2", "DongA", "ns002@donga.edu.vn", "ns002@.", Role.MANAGER)
        );

        for (UserSeed seed : users) {
            userRepository.findByEmail(seed.email())
                    .ifPresentOrElse(
                            user -> log.info(">>> Đã tồn tại tài khoản: {}", seed.email()),
                            () -> {
                                User user = User.builder()
                                        .firstname(seed.firstname())
                                        .lastname(seed.lastname())
                                        .email(seed.email())
                                        .password(passwordEncoder.encode(seed.password()))
                                        .role(seed.role())
                                        .build();
                                userRepository.save(user);
                                log.info(">>> Đã tạo tài khoản: {}", seed.email());
                            }
                    );
        }
    }

    private void seedMajors() {
        createMajorIfNotExists("CNTT", "Công nghệ thông tin", "Ngành Công nghệ thông tin", UUID.randomUUID());
        createMajorIfNotExists("AI", "Trí tuệ nhân tạo", "Ngành Trí tuệ nhân tạo", UUID.randomUUID());
        createMajorIfNotExists("KTPM", "Kỹ thuật phần mềm", "Ngành Kỹ thuật phần mềm", UUID.randomUUID());
    }

    private void createMajorIfNotExists(String code, String name, String description, UUID departmentId) {
        if (majorRepository.findByMajorCode(code).isEmpty()) {
            Major major = Major.builder()
                    .majorCode(code)
                    .majorName(name)
                    .description(description)
                    .departmentId(departmentId)
                    .build();
            majorRepository.save(major);
            log.info(">>> Đã tạo chuyên ngành: {}", code);
        } else {
            log.info(">>> Chuyên ngành đã tồn tại: {}", code);
        }
    }

    private void seedTrainingPrograms() {
        createTrainingProgramIfNotExists("K20CNTT", "K20 CNTT", "CNTT", "2020-2024", 120, "Chương trình K20 ngành CNTT", true, "K20 CNTT");
        createTrainingProgramIfNotExists("K21AI", "K21 AI", "AI", "2021-2025", 130, "Chương trình K21 ngành AI", true, "K21 AI");
    }

    private void createTrainingProgramIfNotExists(
            String code,
            String name,
            String majorCode,
            String academicYear,
            Integer totalCredits,
            String description,
            Boolean status,
            String note
    ) {
        if (trainingProgramRepository.findByProgramCode(code).isEmpty()) {
            Major major = majorRepository.findByMajorCode(majorCode)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành để seed chương trình đào tạo: " + majorCode));
            TrainingProgram program = TrainingProgram.builder()
                    .programCode(code)
                    .programName(name)
                    .majorId(major.getId())
                    .academicYear(academicYear)
                    .totalCredits(totalCredits)
                    .description(description)
                    .status(status)
                    .note(note)
                    .build();
            trainingProgramRepository.save(program);
            log.info(">>> Đã tạo chương trình đào tạo: {}", code);
        } else {
            log.info(">>> Chương trình đào tạo đã tồn tại: {}", code);
        }
    }

    private void seedSubjects() {
        createSubjectIfNotExists("JAVA001", "Lập trình Java", 4, 30, 15, "Môn Lập trình Java cơ bản", 1, true, "K20CNTT");
        createSubjectIfNotExists("DSA002", "Cấu trúc dữ liệu", 3, 30, 15, "Môn Cấu trúc dữ liệu", 2, true, "K20CNTT");
        createSubjectIfNotExists("CSDL003", "Cơ sở dữ liệu", 3, 30, 15, "Môn Cơ sở dữ liệu", 2, true, "K20CNTT");
    }

    private void seedBuildings() {
        createBuildingIfNotExists("BLD1", "Tòa nhà A", "Số 1 đường X", "Tòa nhà chính");
    }

    private void createBuildingIfNotExists(String code, String name, String address, String description) {
        if (buildingRepository.findByBuildingCode(code).isEmpty()) {
            Building building = Building.builder()
                    .buildingCode(code)
                    .buildingName(name)
                    .address(address)
                    .description(description)
                    .build();
            buildingRepository.save(building);
            log.info(">>> Đã tạo tòa nhà: {}", code);
        } else {
            log.info(">>> Tòa nhà đã tồn tại: {}", code);
        }
    }

    private void seedRooms() {
        Building building = buildingRepository.findByBuildingCode("BLD1")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tòa nhà để seed phòng"));
        createRoomIfNotExists("R101", "Phòng 101", building.getId(), 40, "Giảng đường", "available");
    }

    private void createRoomIfNotExists(String code, String name, UUID buildingId, Integer capacity, String roomType, String status) {
        if (roomRepository.findByRoomCode(code).isEmpty()) {
            Room room = Room.builder()
                    .roomCode(code)
                    .roomName(name)
                    .buildingId(buildingId)
                    .capacity(capacity)
                    .roomType(roomType)
                    .status(status)
                    .build();
            roomRepository.save(room);
            log.info(">>> Đã tạo phòng: {}", code);
        } else {
            log.info(">>> Phòng đã tồn tại: {}", code);
        }
    }

    private void seedSemesters() {
        createSemesterIfNotExists("HK1_2025", "Học kỳ 1 năm 2025", "2025", LocalDate.of(2025, 1, 1), LocalDate.of(2025, 6, 30), "Học kỳ 1 năm 2025");
        createSemesterIfNotExists("HK2_2025", "Học kỳ 2 năm 2025", "2025", LocalDate.of(2025, 7, 1), LocalDate.of(2025, 12, 31), "Học kỳ 2 năm 2025");
    }

    private void createSemesterIfNotExists(String code, String name, String academicYear, LocalDate startDate, LocalDate endDate, String description) {
        if (semesterRepository.findByCode(code).isEmpty()) {
            Semester semester = Semester.builder()
                    .code(code)
                    .name(name)
                    .academicYear(academicYear)
                    .startDate(startDate)
                    .endDate(endDate)
                    .description(description)
                    .build();
            semesterRepository.save(semester);
            log.info(">>> Đã tạo học kỳ: {}", code);
        } else {
            log.info(">>> Học kỳ đã tồn tại: {}", code);
        }
    }

    private void seedCourseClasses() {
        Subject subject = subjectRepository.findByCourseCode("JAVA001")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học để seed lớp học phần"));
        Semester semester = semesterRepository.findByCode("HK1_2025")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ để seed lớp học phần"));
        createCourseClassIfNotExists("JAVA01", subject.getId(), semester.getId(), 30, "Thứ 2 8-10", "A1", 1);
        createCourseClassIfNotExists("CTDLGT01", subject.getId(), semester.getId(), 30, "Thứ 3 10-12", "A2", 0);
    }

    private void createCourseClassIfNotExists(String classCode, UUID courseId, UUID semesterId, Integer maxStudent, String schedule, String room, Integer status) {
        if (courseClassRepository.findByClassCode(classCode).isEmpty()) {
            CourseClass courseClass = CourseClass.builder()
                    .classCode(classCode)
                    .courseId(courseId)
                    .semesterId(semesterId)
                    .maxStudent(maxStudent)
                    .currentStudent(0)
                    .schedule(schedule)
                    .room(room)
                    .status(status)
                    .build();
            courseClassRepository.save(courseClass);
            log.info(">>> Đã tạo lớp học phần: {}", classCode);
        } else {
            log.info(">>> Lớp học phần đã tồn tại: {}", classCode);
        }
    }

    private void seedLecturerCourseClasses() {
        LecturerCourseClassRepository repo = lecturerCourseClassRepository;
        lecturerRepository.findByLecturerCode("gv001@donga.edu.vn")
                .ifPresent(lecturer -> {
                    courseClassRepository.findByClassCode("JAVA01")
                            .ifPresent(courseClass -> {
                                if (repo.findByLecturerIdAndCourseClassIdAndIsActiveTrue(lecturer.getId(), courseClass.getId()).isEmpty()) {
                                    LecturerCourseClass assignment = LecturerCourseClass.builder()
                                            .lecturerId(lecturer.getId())
                                            .courseClassId(courseClass.getId())
                                            .role("Giảng viên chính")
                                            .isActive(true)
                                            .build();
                                    repo.save(assignment);
                                    log.info(">>> Đã tạo phân công giảng viên cho lớp JAVA01");
                                } else {
                                    log.info(">>> Phân công giảng viên đã tồn tại cho lớp JAVA01");
                                }
                            });
                });
    }

    private void seedGradeScales() {
        createGradeScaleIfNotExists("A", 8.5, 10.0, "A", 4.0, "Xuất sắc");
        createGradeScaleIfNotExists("B", 7.0, 8.4, "B", 3.0, "Giỏi");
        createGradeScaleIfNotExists("C", 5.5, 6.9, "C", 2.0, "Khá");
        createGradeScaleIfNotExists("D", 4.0, 5.4, "D", 1.0, "Trung bình");
        createGradeScaleIfNotExists("F", 0.0, 3.9, "F", 0.0, "Yếu");
    }

    private void createGradeScaleIfNotExists(String scaleName, Double minScore, Double maxScore, String gradeLetter, Double gpaValue, String description) {
        if (gradeScaleRepository.findByScaleName(scaleName).isEmpty()) {
            GradeScale gradeScale = GradeScale.builder()
                    .scaleName(scaleName)
                    .minScore(minScore)
                    .maxScore(maxScore)
                    .gradeLetter(gradeLetter)
                    .gpaValue(gpaValue)
                    .description(description)
                    .build();
            gradeScaleRepository.save(gradeScale);
            log.info(">>> Đã tạo thang điểm: {}", scaleName);
        } else {
            log.info(">>> Thang điểm đã tồn tại: {}", scaleName);
        }
    }

    private void seedSettings() {
        createSettingIfNotExists("system.theme", "light", "Chủ đề mặc định của hệ thống", "ui");
        createSettingIfNotExists("registration.open", "true", "Cho phép đăng ký học phần", "academic");
        createSettingIfNotExists("notification.email.enabled", "false", "Bật/tắt gửi thông báo email", "notification");
    }

    private void createSettingIfNotExists(String configKey, String configValue, String description, String category) {
        if (settingRepository.findByConfigKey(configKey).isEmpty()) {
            Setting setting = Setting.builder()
                    .configKey(configKey)
                    .configValue(configValue)
                    .description(description)
                    .category(category)
                    .build();
            settingRepository.save(setting);
            log.info(">>> Đã tạo cấu hình hệ thống: {}", configKey);
        } else {
            log.info(">>> Cấu hình hệ thống đã tồn tại: {}", configKey);
        }
    }

    private void createSubjectIfNotExists(
            String code,
            String name,
            Integer credits,
            Integer theoryHours,
            Integer practiceHours,
            String description,
            Integer semester,
            Boolean isMandatory,
            String programCode
    ) {
        if (subjectRepository.findByCourseCode(code).isEmpty()) {
            TrainingProgram program = trainingProgramRepository.findByProgramCode(programCode)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo để seed môn học: " + programCode));
            Subject subject = Subject.builder()
                    .courseCode(code)
                    .courseName(name)
                    .credits(credits)
                    .theoryHours(theoryHours)
                    .practiceHours(practiceHours)
                    .description(description)
                    .semester(semester)
                    .isMandatory(isMandatory)
                    .programId(program.getId())
                    .build();
            subjectRepository.save(subject);
            log.info(">>> Đã tạo môn học: {}", code);
        } else {
            log.info(">>> Môn học đã tồn tại: {}", code);
        }
    }

    private record UserSeed(
            String firstname,
            String lastname,
            String email,
            String password,
            Role role
    ) {}
}
