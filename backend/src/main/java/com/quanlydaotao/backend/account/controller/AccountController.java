package com.quanlydaotao.backend.account.controller;
import com.quanlydaotao.backend.account.dto.AccountCreationRequest;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Quản lý Tài khoản (Workflow)")
public class AccountController {
    private final AccountServiceImpl accountService;
    @PostMapping("/create")
    @Operation(summary = "Tạo tài khoản(Admin) (Student, Instructor, Staff)")
    public ResponseEntity<ApiResponse<String>> createAccount(@RequestBody AccountCreationRequest request) {
        accountService.createAccount(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công", null));
    }
}
