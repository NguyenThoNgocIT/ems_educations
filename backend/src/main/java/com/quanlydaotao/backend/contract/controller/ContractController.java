package com.quanlydaotao.backend.contract.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.contract.dto.ContractDto;
import com.quanlydaotao.backend.contract.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
@Tag(name = "Quản lý hợp đồng", description = "API admin quản lý hợp đồng nhân sự")
public class ContractController {
    private final ContractService contractService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách hợp đồng")
    public ResponseEntity<ApiResponse<List<ContractDto>>> searchContracts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID employeeId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách hợp đồng thành công",
                contractService.searchContracts(keyword, employeeId, status, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết hợp đồng")
    public ResponseEntity<ApiResponse<ContractDto>> getContract(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy hợp đồng thành công", contractService.getContract(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo hợp đồng")
    public ResponseEntity<ApiResponse<ContractDto>> createContract(@RequestBody ContractDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo hợp đồng thành công", contractService.createContract(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật hợp đồng")
    public ResponseEntity<ApiResponse<ContractDto>> updateContract(@PathVariable UUID id, @RequestBody ContractDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hợp đồng thành công", contractService.updateContract(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm hợp đồng")
    public ResponseEntity<ApiResponse<Void>> deleteContract(@PathVariable UUID id) {
        contractService.deleteContract(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa hợp đồng thành công", null));
    }
}
