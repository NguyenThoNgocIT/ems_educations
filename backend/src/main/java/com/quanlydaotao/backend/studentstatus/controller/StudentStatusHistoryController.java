package com.quanlydaotao.backend.studentstatus.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryResponse;
import com.quanlydaotao.backend.studentstatus.service.StudentStatusHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student-status-histories")
@RequiredArgsConstructor
@Tag(name = "Quản lý lịch sử trạng thái sinh viên", description = "API admin ghi nhận lịch sử thay đổi trạng thái sinh viên")
public class StudentStatusHistoryController {
    private final StudentStatusHistoryService studentStatusHistoryService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy lịch sử trạng thái sinh viên")
    public ResponseEntity<ApiResponse<List<StudentStatusHistoryResponse>>> search(
            @RequestParam(required = false) UUID studentId,
            @RequestParam(required = false) UUID studentStatusId,
            @RequestParam(required = false) Boolean isCurrent,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử trạng thái sinh viên thành công",
                studentStatusHistoryService.search(studentId, studentStatusId, isCurrent, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết lịch sử trạng thái sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusHistoryResponse>> get(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử trạng thái sinh viên thành công", studentStatusHistoryService.getHistory(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo lịch sử trạng thái sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusHistoryResponse>> create(@Valid @RequestBody StudentStatusHistoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo lịch sử trạng thái sinh viên thành công", studentStatusHistoryService.createHistory(request)));
    }

    @PostMapping("/admin/current")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin gán trạng thái hiện tại cho sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusHistoryResponse>> setCurrent(@Valid @RequestBody StudentStatusHistoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gán trạng thái hiện tại cho sinh viên thành công",
                studentStatusHistoryService.setCurrentStatus(request.getStudentId(), request.getStudentStatusId(),
                        request.getStartDate(), request.getReason())));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật lịch sử trạng thái sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusHistoryResponse>> update(@PathVariable UUID id,
                                                                           @RequestBody StudentStatusHistoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch sử trạng thái sinh viên thành công",
                studentStatusHistoryService.updateHistory(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm lịch sử trạng thái sinh viên")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        studentStatusHistoryService.deleteHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lịch sử trạng thái sinh viên thành công", null));
    }
}
