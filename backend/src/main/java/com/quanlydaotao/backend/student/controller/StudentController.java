package com.quanlydaotao.backend.student.controller;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.student.dto.CreateStudentRequest;
import com.quanlydaotao.backend.student.dto.EnrollStudentRequest;
import com.quanlydaotao.backend.student.dto.StudentDto;
import com.quanlydaotao.backend.student.dto.UpdateStudentRequest;
import com.quanlydaotao.backend.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;  
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Quản lý Sinh viên", description = "Các API cho phép thực hiện CRUD thông tin sinh viên")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // ✅ THÊM DÒNG NÀY
public class StudentController {
    private final StudentService studentService;

    @PostMapping
    @Operation(summary = "Tạo mới sinh viên", description = "Lưu thông tin một sinh viên mới vào hệ thống")
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@RequestBody CreateStudentRequest request) {
        return new ResponseEntity<>(ApiResponse.success("Tạo sinh viên thành công", studentService.createStudent(request)), HttpStatus.CREATED);
    }

    @PostMapping("/enroll")
    @Operation(summary = "Nhập học sinh viên", description = "Tạo thông tin cá nhân, mã sinh viên và tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<StudentDto>> enrollStudent(@RequestBody EnrollStudentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Sinh viên đã được nhập học và tạo tài khoản thành công", studentService.enrollStudent(request)));
    }

    @PostMapping("/import")
    @Operation(summary = "Import sinh viên", description = "Import danh sách sinh viên từ file Excel")
    public ResponseEntity<ApiResponse<String>> importStudents() {
        // FIXME: Use MultipartFile file, parse excel, and call enrollStudent in a loop
        return ResponseEntity.ok(ApiResponse.success("Import danh sách sinh viên thành công", null));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết sinh viên", description = "Tìm kiếm và trả về thông tin chi tiết của một sinh viên dựa trên UUID")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sinh viên thành công", studentService.getStudentById(id)));
    }

    @GetMapping
    @Operation(summary = "Danh sách sinh viên", description = "Lấy toàn bộ danh sách sinh viên hiện có")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên thành công", studentService.getAllStudents()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật sinh viên", description = "Thay đổi thông tin của sinh viên đã tồn tại")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(@PathVariable UUID id, @RequestBody UpdateStudentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sinh viên thành công", studentService.updateStudent(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa sinh viên", description = "Xóa (ẩn) thông tin sinh viên khỏi hệ thống")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable UUID id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sinh viên thành công", null));
    }
}
