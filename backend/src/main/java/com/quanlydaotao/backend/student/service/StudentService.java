package com.quanlydaotao.backend.student.service;
import com.quanlydaotao.backend.student.dto.StudentDto;
import com.quanlydaotao.backend.student.dto.UpdateStudentRequest;
import java.util.List;
import java.util.UUID;
public interface StudentService {
    StudentDto getStudentById(UUID id);
    List<StudentDto> getAllStudents();
    StudentDto updateStudent(UUID id, UpdateStudentRequest request);
    void deleteStudent(UUID id);
}
