package com.quanlydaotao.backend.role.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.role.dto.MenuDto;
import com.quanlydaotao.backend.role.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
@Tag(name = "Quản lý menu", description = "API quản trị menu và lấy menu theo phân quyền")
public class MenuController {
    private final MenuService menuService;

    @GetMapping("/me")
    @Operation(summary = "Lấy menu của người dùng hiện tại theo quyền")
    public ResponseEntity<ApiResponse<List<MenuDto>>> getMyMenus(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy menu theo quyền thành công", menuService.getCurrentUserMenus(authentication.getName())));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','MENU_VIEW')")
    @Operation(summary = "Admin lấy toàn bộ menu")
    public ResponseEntity<ApiResponse<List<MenuDto>>> getAllMenusForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách menu thành công", menuService.getAllMenusForAdmin()));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','MENU_VIEW')")
    @Operation(summary = "Admin lấy chi tiết menu")
    public ResponseEntity<ApiResponse<MenuDto>> getMenuForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy menu thành công", menuService.getMenuForAdmin(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','MENU_CREATE')")
    @Operation(summary = "Admin tạo menu")
    public ResponseEntity<ApiResponse<MenuDto>> createMenu(@RequestBody MenuDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo menu thành công", menuService.createMenu(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','MENU_EDIT')")
    @Operation(summary = "Admin cập nhật menu")
    public ResponseEntity<ApiResponse<MenuDto>> updateMenu(@PathVariable UUID id, @RequestBody MenuDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật menu thành công", menuService.updateMenu(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','MENU_DELETE')")
    @Operation(summary = "Admin xóa mềm menu")
    public ResponseEntity<ApiResponse<Void>> deleteMenu(@PathVariable UUID id) {
        menuService.deleteMenu(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa menu thành công", null));
    }
}
