package com.quanlydaotao.backend.administrativeclass.config;

import com.quanlydaotao.backend.academiccohort.entity.AcademicCohort;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.studentclass.entity.StudentClass;
import com.quanlydaotao.backend.studentclass.repository.StudentClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class AdministrativeClassTestDataSeeder {
    private final AdministrativeClassRepository classRepository;
    private final AcademicCohortRepository cohortRepository;
    private final DepartmentRepository departmentRepository;
    private final MajorRepository majorRepository;
    private final SemesterRepository semesterRepository;
    private final StudentRepository studentRepository;
    private final StudentClassRepository studentClassRepository;

    @Bean
    ApplicationRunner seedAdministrativeClassTestData() {
        return args -> seed();
    }

    @Transactional
    void seed() {
        seedClasses();
        seedStudentAssignments();
    }

    private void seedClasses() {
        List<SeedClass> seeds = List.of(
                new SeedClass("CNTT-K24-03", "Lớp CNTT khóa 24 - 03", "CNTT", null, "K24", "FOUNDATION", 40),
                new SeedClass("CNTT-K25-02", "Lớp CNTT khóa 25 - 02", "CNTT", null, "K25", "FOUNDATION", 40),
                new SeedClass("KTDL-K24-02", "Lớp kế toán khóa 24 - 02", "KTDL", null, "K24", "FOUNDATION", 40),
                new SeedClass("KTDL-K25-01", "Lớp kế toán khóa 25 - 01", "KTDL", null, "K25", "FOUNDATION", 40),
                new SeedClass("NN-K24-01", "Lớp tiếng Anh khóa 24 - 01", "NN", null, "K24", "FOUNDATION", 35),
                new SeedClass("NN-K25-02", "Lớp tiếng Anh khóa 25 - 02", "NN", null, "K25", "FOUNDATION", 35),
                new SeedClass("QTKD-K24-01", "Lớp QTKD khóa 24 - 01", "QTKD", null, "K24", "FOUNDATION", 40),
                new SeedClass("QTKD-K25-02", "Lớp QTKD khóa 25 - 02", "QTKD", null, "K25", "FOUNDATION", 40),
                new SeedClass("CNTT-AI-K24-01", "Lớp AI khóa 24 - 01", "CNTT", "CNTT01", "K24", "SPECIALIZATION", 35),
                new SeedClass("CNTT-SE-K24-01", "Lớp Công nghệ phần mềm khóa 24 - 01", "CNTT", "CNTT01", "K24", "SPECIALIZATION", 35)
        );

        for (SeedClass seed : seeds) {
            if (classRepository.findByClassCode(seed.code()).isPresent()) {
                continue;
            }

            Department department = departmentRepository.findByCode(seed.departmentCode()).orElse(null);
            AcademicCohort cohort = cohortRepository.findByCode(seed.cohortCode()).orElse(null);
            if (department == null || cohort == null) {
                continue;
            }

            Major major = seed.majorCode() == null
                    ? null
                    : majorRepository.findByCode(seed.majorCode()).orElse(null);

            AdministrativeClass administrativeClass = new AdministrativeClass();
            administrativeClass.setClassCode(seed.code());
            administrativeClass.setClassName(seed.name());
            administrativeClass.setDepartmentId(department.getDepartmentId());
            administrativeClass.setMajorId(major == null ? null : major.getMajorId());
            administrativeClass.setAcademicCohortId(cohort.getCohortId());
            administrativeClass.setClassPhase(seed.phase());
            administrativeClass.setMaxSize(seed.maxSize());
            administrativeClass.setStatus(1);
            administrativeClass.setNote("Lớp hành chính được khởi tạo theo kế hoạch tuyển sinh");
            administrativeClass.setIsActive(true);
            classRepository.save(administrativeClass);
        }
    }

    private void seedStudentAssignments() {
        Semester semester = semesterRepository.search(null, null, null, true).stream()
                .findFirst()
                .orElse(null);
        if (semester == null) {
            return;
        }

        List<AdministrativeClass> classes = classRepository.search(null, null, null, null, null, null, true);
        if (classes.isEmpty()) {
            return;
        }

        Map<UUID, Long> classCounts = studentRepository.findAll().stream()
                .filter(student -> student.getClassId() != null)
                .collect(Collectors.groupingBy(Student::getClassId, Collectors.counting()));

        List<Student> changedStudents = new ArrayList<>();
        List<StudentClass> changedStudentClasses = new ArrayList<>();

        for (Student student : studentRepository.findAll()) {
            if (!Boolean.TRUE.equals(student.getIsActive())) {
                continue;
            }

            AdministrativeClass targetClass = chooseClass(student, classes, classCounts);
            if (targetClass == null) {
                continue;
            }

            if (!targetClass.getClassId().equals(student.getClassId())) {
                student.setClassId(targetClass.getClassId());
                changedStudents.add(student);
                classCounts.merge(targetClass.getClassId(), 1L, Long::sum);
            }

            List<StudentClass> sameClassAssignments = studentClassRepository.findByStudentIdAndClassIdAndSemesterId(
                    student.getStudentId(),
                    targetClass.getClassId(),
                    semester.getSemesterId()
            );
            if (sameClassAssignments.isEmpty()) {
                StudentClass studentClass = new StudentClass();
                studentClass.setStudentId(student.getStudentId());
                studentClass.setClassId(targetClass.getClassId());
                studentClass.setSemesterId(semester.getSemesterId());
                studentClass.setStatus("ACTIVE");
                studentClass.setNote("Sinh viên được phân vào lớp hành chính theo ngành và khóa học");
                studentClass.setIsActive(true);
                changedStudentClasses.add(studentClass);
            } else {
                StudentClass studentClass = sameClassAssignments.get(0);
                if (!Boolean.TRUE.equals(studentClass.getIsActive()) || studentClass.getDeletedAt() != null) {
                    studentClass.setIsActive(true);
                    studentClass.setDeletedAt(null);
                    changedStudentClasses.add(studentClass);
                }
            }
        }

        if (!changedStudents.isEmpty()) {
            studentRepository.saveAll(changedStudents);
        }
        if (!changedStudentClasses.isEmpty()) {
            studentClassRepository.saveAll(changedStudentClasses);
        }
    }

    private AdministrativeClass chooseClass(Student student, List<AdministrativeClass> classes, Map<UUID, Long> classCounts) {
        List<AdministrativeClass> candidates = classes.stream()
                .filter(administrativeClass -> matchesStudent(student, administrativeClass))
                .sorted(Comparator
                        .comparing((AdministrativeClass administrativeClass) ->
                                classCounts.getOrDefault(administrativeClass.getClassId(), 0L))
                        .thenComparing(AdministrativeClass::getClassCode))
                .toList();

        if (!candidates.isEmpty()) {
            return candidates.get(0);
        }

        return classes.stream()
                .filter(administrativeClass -> administrativeClass.getAcademicCohortId() == null
                        || administrativeClass.getAcademicCohortId().equals(student.getAcademicCohortId()))
                .collect(Collectors.toMap(Function.identity(),
                        administrativeClass -> classCounts.getOrDefault(administrativeClass.getClassId(), 0L)))
                .entrySet()
                .stream()
                .min(Map.Entry.<AdministrativeClass, Long>comparingByValue()
                        .thenComparing(entry -> entry.getKey().getClassCode()))
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private boolean matchesStudent(Student student, AdministrativeClass administrativeClass) {
        UUID studentDepartmentId = resolveStudentDepartmentId(student);
        if (administrativeClass.getAcademicCohortId() != null
                && !administrativeClass.getAcademicCohortId().equals(student.getAcademicCohortId())) {
            return false;
        }
        if (administrativeClass.getDepartmentId() != null
                && !administrativeClass.getDepartmentId().equals(studentDepartmentId)) {
            return false;
        }
        if (administrativeClass.getMajorId() != null
                && !administrativeClass.getMajorId().equals(student.getMajorId())) {
            return false;
        }
        if (administrativeClass.getSpecializationId() != null
                && !administrativeClass.getSpecializationId().equals(student.getSpecializationId())) {
            return false;
        }
        return true;
    }

    private UUID resolveStudentDepartmentId(Student student) {
        if (student.getDepartmentId() != null) {
            return student.getDepartmentId();
        }
        if (student.getMajorId() == null) {
            return null;
        }
        return majorRepository.findById(student.getMajorId())
                .map(Major::getDepartmentId)
                .orElse(null);
    }

    private record SeedClass(
            String code,
            String name,
            String departmentCode,
            String majorCode,
            String cohortCode,
            String phase,
            Integer maxSize
    ) {
    }
}
