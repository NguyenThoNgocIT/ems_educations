package com.quanlydaotao.backend.account.controller;

import com.quanlydaotao.backend.account.dto.AccountCreationRequest;
import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Quản lý tài khoản", description = "Workflow tạo tài khoản cho sinh viên, giảng viên và nhân viên")
public class AccountController {
    private final AccountServiceImpl accountService;

    @PostMapping("/create")
    @Operation(summary = "Tạo tài khoản atomic cho sinh viên, giảng viên hoặc nhân viên")
    public ResponseEntity<ApiResponse<AccountCreationResponse>> createAccount(@Valid @RequestBody AccountCreationRequest request) {
        AccountCreationResponse response = accountService.createAccount(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công", response));
    }
}
