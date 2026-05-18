package com.quanlydaotao.backend.role.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.role.dto.MenuDto;
import com.quanlydaotao.backend.role.entity.Menus;
import com.quanlydaotao.backend.role.entity.Permission;
import com.quanlydaotao.backend.role.repository.MenuRepository;
import com.quanlydaotao.backend.role.repository.PermissionRepository;
import com.quanlydaotao.backend.role.repository.RolePermissionRepository;
import com.quanlydaotao.backend.role.service.MenuService;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
    private final MenuRepository menuRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MenuDto> getAllMenusForAdmin() {
        return menuRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MenuDto getMenuForAdmin(UUID id) {
        return toDto(findMenu(id));
    }

    @Override
    @Transactional
    public MenuDto createMenu(MenuDto request) {
        Menus menu = new Menus();
        apply(menu, request);
        if (menu.getIsActive() == null) {
            menu.setIsActive(true);
        }
        return toDto(menuRepository.save(menu));
    }

    @Override
    @Transactional
    public MenuDto updateMenu(UUID id, MenuDto request) {
        Menus menu = findMenu(id);
        apply(menu, request);
        return toDto(menuRepository.save(menu));
    }

    @Override
    @Transactional
    public void deleteMenu(UUID id) {
        Menus menu = findMenu(id);
        menu.setIsActive(false);
        menuRepository.save(menu);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuDto> getCurrentUserMenus(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        List<String> permissionCodes = rolePermissionRepository.findActivePermissionCodesByUserId(user.getUserId());
        List<Menus> menus = permissionCodes.isEmpty()
                ? menuRepository.findByIsActiveTrueAndPermissionIsNullOrderByOrderIndexAscMenuTitleAsc()
                : menuRepository.findVisibleMenus(permissionCodes);
        return menus.stream()
                .map(this::toDto)
                .toList();
    }

    private Menus findMenu(UUID id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy menu"));
    }

    private void apply(Menus menu, MenuDto request) {
        if (request.getParentId() != null) menu.setParentId(request.getParentId());
        if (request.getMenuTitle() != null) menu.setMenuTitle(request.getMenuTitle());
        if (request.getMenuUrl() != null) menu.setMenuUrl(request.getMenuUrl());
        if (request.getMenuIcon() != null) menu.setMenuIcon(request.getMenuIcon());
        if (request.getOrderIndex() != null) menu.setOrderIndex(request.getOrderIndex());
        if (request.getMenuType() != null) menu.setMenuType(request.getMenuType());
        if (request.getIsActive() != null) menu.setIsActive(request.getIsActive());
        if (request.getPermissionId() != null) {
            Permission permission = permissionRepository.findById(request.getPermissionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền của menu"));
            menu.setPermission(permission);
        }
    }

    private MenuDto toDto(Menus menu) {
        MenuDto dto = new MenuDto();
        dto.setMenuId(menu.getMenuId());
        dto.setParentId(menu.getParentId());
        dto.setMenuTitle(menu.getMenuTitle());
        dto.setMenuUrl(menu.getMenuUrl());
        dto.setMenuIcon(menu.getMenuIcon());
        dto.setOrderIndex(menu.getOrderIndex());
        dto.setMenuType(menu.getMenuType());
        dto.setIsActive(menu.getIsActive());
        dto.setCreatedAt(menu.getCreatedAt());
        dto.setUpdatedAt(menu.getUpdatedAt());
        if (menu.getPermission() != null) {
            dto.setPermissionId(menu.getPermission().getPermissionId());
            dto.setPermissionCode(menu.getPermission().getCode());
        }
        return dto;
    }
}
