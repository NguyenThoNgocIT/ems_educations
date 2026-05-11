package com.quanlydaotao.backend.role.controller;
import com.quanlydaotao.backend.role.dto.RoleDto;
import com.quanlydaotao.backend.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;
    @GetMapping
    public ResponseEntity<List<RoleDto>> getAllRoles() { return ResponseEntity.ok(roleService.getAllRoles()); }
    @GetMapping("/{id}")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable UUID id) { return ResponseEntity.ok(roleService.getRoleById(id)); }
    @PostMapping
    public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto request) { return ResponseEntity.ok(roleService.createRole(request)); }
    @PutMapping("/{id}")
    public ResponseEntity<RoleDto> updateRole(@PathVariable UUID id, @RequestBody RoleDto request) { return ResponseEntity.ok(roleService.updateRole(id, request)); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID id) { roleService.deleteRole(id); return ResponseEntity.ok().build(); }
}
