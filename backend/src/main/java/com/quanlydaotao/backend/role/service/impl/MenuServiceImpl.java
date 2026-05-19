package com.quanlydaotao.backend.role.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.role.dto.MenuDto;
import com.quanlydaotao.backend.role.entity.Menus;
import com.quanlydaotao.backend.role.entity.Permission;
import com.quanlydaotao.backend.role.mapper.MenuMapper;
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
    private final MenuMapper menuMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MenuDto> getAllMenusForAdmin() {
        return menuMapper.toDtoList(menuRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public MenuDto getMenuForAdmin(UUID id) {
        return menuMapper.toDto(findMenu(id));
    }

    @Override
    @Transactional
    public MenuDto createMenu(MenuDto request) {
        Menus menu = menuMapper.toEntity(request);
        applyPermission(menu, request);
        if (menu.getIsActive() == null) {
            menu.setIsActive(true);
        }
        return menuMapper.toDto(menuRepository.save(menu));
    }

    @Override
    @Transactional
    public MenuDto updateMenu(UUID id, MenuDto request) {
        Menus menu = findMenu(id);
        menuMapper.updateEntityFromDto(request, menu);
        applyPermission(menu, request);
        return menuMapper.toDto(menuRepository.save(menu));
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
        return menuMapper.toDtoList(menus);
    }

    private Menus findMenu(UUID id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy menu"));
    }

    private void applyPermission(Menus menu, MenuDto request) {
        if (request.getPermissionId() != null) {
            Permission permission = permissionRepository.findById(request.getPermissionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền của menu"));
            menu.setPermission(permission);
        }
    }
}
