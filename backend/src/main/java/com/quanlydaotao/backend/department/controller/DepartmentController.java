package com.quanlydaotao.backend.department.controller;

import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<Department>> getAll() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<Department> create(
            @org.springframework.web.bind.annotation.RequestBody Department department) {
        return ResponseEntity.ok(departmentRepository.save(department));
    }
}



