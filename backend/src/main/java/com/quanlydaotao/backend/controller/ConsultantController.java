package com.quanlydaotao.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/consultant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CONSULTANT')")
public class ConsultantController {

    @GetMapping("/")
    public ResponseEntity<String> getConsultantDashboard() {
        return ResponseEntity.ok("Consultant API working");
    }

}
