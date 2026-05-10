package com.quanlydaotao.backend.student.controller;

import com.quanlydaotao.backend.student.dto.CreateStudentRequest;
import com.quanlydaotao.backend.student.dto.EnrollStudentRequest;
import com.quanlydaotao.backend.student.dto.StudentDto;
import com.quanlydaotao.backend.student.dto.UpdateStudentRequest;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@RequestBody CreateStudentRequest request) {
        return new ResponseEntity<>(studentService.createStudent(request), HttpStatus.CREATED);
    }

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse<StudentDto>> enrollStudent(@RequestBody EnrollStudentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Sinh viên đã được nhập học và tạo tài khoản thành công", studentService.enrollStudent(request)));
    }

    @PostMapping("/import")
    public ResponseEntity<ApiResponse<String>> importStudents() {
        // FIXME: Use MultipartFile file, parse excel, and call enrollStudent in a loop
        return ResponseEntity.ok(ApiResponse.success("Import danh sách sinh viên thành công", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable UUID id, @RequestBody UpdateStudentRequest request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
