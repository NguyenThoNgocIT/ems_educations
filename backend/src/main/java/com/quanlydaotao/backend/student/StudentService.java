package com.quanlydaotao.backend.student;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

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
}
