package com.quanlydaotao.backend.student;

import com.quanlydaotao.backend.courseclass.CourseClassRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseClassRepository courseClassRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Student createStudent(Student student) {
        studentRepository.findByStudentCode(student.getStudentCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        return studentRepository.save(student);
    }

    public Student updateStudent(UUID id, Student request) {
        Student existing = getStudentById(id);
        if (!existing.getStudentCode().equals(request.getStudentCode())) {
            studentRepository.findByStudentCode(request.getStudentCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        existing.setStudentCode(request.getStudentCode());
        existing.setFullName(request.getFullName());
        existing.setGender(request.getGender());
        existing.setDateOfBirth(request.getDateOfBirth());
        existing.setEmail(request.getEmail());
        existing.setPhoneNumber(request.getPhoneNumber());
        existing.setAddress(request.getAddress());
        existing.setCourse(request.getCourse());
        return studentRepository.save(existing);
    }

    public void deleteStudent(UUID id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dữ liệu");
        }
        studentRepository.deleteById(id);
    }

    public List<Student> searchStudents(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllStudents();
        }
        return studentRepository.findByStudentCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                keyword,
                keyword,
                keyword
        );
    }

    public Student assignStudentToClass(UUID studentId, UUID classId) {
        Student student = getStudentById(studentId);
        var courseClass = courseClassRepository.findByIdAndIsActiveTrue(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        student.setCourseClassId(courseClass.getId());
        student.setCourseClassCode(courseClass.getClassCode());
        if (courseClass.getCurrentStudent() == null) {
            courseClass.setCurrentStudent(0);
        }
        courseClass.setCurrentStudent(courseClass.getCurrentStudent() + 1);
        courseClassRepository.save(courseClass);
        return studentRepository.save(student);
    }

    public List<Student> importStudentsFromExcel(MultipartFile file) {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<Student> imported = new ArrayList<>();

            Iterator<Row> rows = sheet.rowIterator();
            if (rows.hasNext()) {
                rows.next();
            }
            while (rows.hasNext()) {
                Row row = rows.next();
                String code = getCellValue(row.getCell(0));
                String fullName = getCellValue(row.getCell(1));
                String gender = getCellValue(row.getCell(2));
                LocalDate dateOfBirth = getDateCellValue(row.getCell(3));
                String email = getCellValue(row.getCell(4));
                String phoneNumber = getCellValue(row.getCell(5));
                String address = getCellValue(row.getCell(6));
                String course = getCellValue(row.getCell(7));

                if (code == null || fullName == null || gender == null || dateOfBirth == null || email == null || phoneNumber == null || address == null || course == null) {
                    continue;
                }

                Student student = studentRepository.findByStudentCode(code)
                        .orElse(Student.builder()
                                .studentCode(code)
                                .build());
                student.setFullName(fullName);
                student.setGender(gender);
                student.setDateOfBirth(dateOfBirth);
                student.setEmail(email);
                student.setPhoneNumber(phoneNumber);
                student.setAddress(address);
                student.setCourse(course);
                imported.add(studentRepository.save(student));
            }
            return imported;
        } catch (IOException e) {
            throw new RuntimeException("Failed to import students from Excel", e);
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                yield String.valueOf((long) cell.getNumericCellValue());
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> null;
        };
    }

    private LocalDate getDateCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }
        String value = getCellValue(cell);
        if (value == null) {
            return null;
        }
        return LocalDate.parse(value);
    }
}
