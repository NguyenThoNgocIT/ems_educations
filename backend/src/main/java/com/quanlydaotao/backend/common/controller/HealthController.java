package com.quanlydaotao.backend.common.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<ApiResponse<String>> rootHealth() {
        return ResponseEntity.ok(ApiResponse.success("UEMS Backend is running", "UP"));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("System is healthy", "UP"));
    }
}
