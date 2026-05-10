package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.dto.CourseDto;
import com.quanlydaotao.backend.course.service.CourseClassService;
import com.quanlydaotao.backend.course.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "Quản lý Đào tạo", description = "Các API quản lý Môn học và Lớp học phần")
public class CourseController {

    private final CourseService courseService;
    private final CourseClassService courseClassService;

    // ==================== Course Endpoints ====================

    @PostMapping
    @Operation(summary = "Tạo môn học", description = "Lưu thông tin một môn học mới")
    public ResponseEntity<CourseDto> createCourse(@RequestBody CourseDto courseDto) {
        return new ResponseEntity<>(courseService.createCourse(courseDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy môn học theo ID", description = "Lấy chi tiết môn học qua UUID")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Lấy môn học theo Mã", description = "Tìm kiếm nhanh môn học bằng mã môn (ví dụ: CS101)")
    public ResponseEntity<CourseDto> getCourseByCode(@PathVariable String code) {
        return ResponseEntity.ok(courseService.getCourseByCod(code));
    }

    @GetMapping
    @Operation(summary = "Danh sách môn học", description = "Lấy toàn bộ danh sách môn học trong hệ thống")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Môn học theo khoa", description = "Lấy danh sách các môn học thuộc quản lý của một khoa")
    public ResponseEntity<List<CourseDto>> getCoursesByDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity.ok(courseService.getCoursesByDepartment(departmentId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật môn học", description = "Cập nhật thông tin chi tiết của môn học")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable UUID id, @RequestBody CourseDto courseDto) {
        return ResponseEntity.ok(courseService.updateCourse(id, courseDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa môn học", description = "Xóa (ẩn) môn học khỏi danh sách")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CourseClass Endpoints ====================

    @PostMapping("/classes")
    @Operation(summary = "Tạo lớp học phần", description = "Mở một lớp học phần mới cho môn học")
    public ResponseEntity<CourseClassDto> createCourseClass(@RequestBody CourseClassDto courseClassDto) {
        return new ResponseEntity<>(courseClassService.createCourseClass(courseClassDto), HttpStatus.CREATED);
    }

    @GetMapping("/classes/{id}")
    @Operation(summary = "Chi tiết lớp học phần", description = "Lấy thông tin chi tiết một lớp học phần")
    public ResponseEntity<CourseClassDto> getCourseClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseClassService.getCourseClassById(id));
    }

    @GetMapping("/classes")
    @Operation(summary = "Danh sách lớp học phần", description = "Lấy toàn bộ các lớp học phần đang mở")
    public ResponseEntity<List<CourseClassDto>> getAllCourseClasses() {
        return ResponseEntity.ok(courseClassService.getAllCourseClasses());
    }

    @GetMapping("/{courseId}/classes")
    @Operation(summary = "Lớp học phần theo môn", description = "Lấy danh sách các lớp học phần của một môn học cụ thể")
    public ResponseEntity<List<CourseClassDto>> getCourseClassesByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(courseClassService.getCourseClassesByCourse(courseId));
    }

    @GetMapping("/classes/semester/{semesterId}")
    @Operation(summary = "Lớp học phần theo học kỳ", description = "Lấy danh sách các lớp học phần mở trong một học kỳ")
    public ResponseEntity<List<CourseClassDto>> getCourseClassesBySemester(@PathVariable UUID semesterId) {
        return ResponseEntity.ok(courseClassService.getCourseClassesBySemester(semesterId));
    }

    @PutMapping("/classes/{id}")
    @Operation(summary = "Cập nhật lớp học phần", description = "Cập nhật sĩ số, phòng học, trạng thái lớp")
    public ResponseEntity<CourseClassDto> updateCourseClass(@PathVariable UUID id, @RequestBody CourseClassDto courseClassDto) {
        return ResponseEntity.ok(courseClassService.updateCourseClass(id, courseClassDto));
    }

    @DeleteMapping("/classes/{id}")
    @Operation(summary = "Xóa lớp học phần", description = "Hủy bỏ một lớp học phần")
    public ResponseEntity<Void> deleteCourseClass(@PathVariable UUID id) {
        courseClassService.deleteCourseClass(id);
        return ResponseEntity.noContent().build();
    }
}
