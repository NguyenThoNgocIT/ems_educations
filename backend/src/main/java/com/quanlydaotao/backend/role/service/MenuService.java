package com.quanlydaotao.backend.role.service;

import com.quanlydaotao.backend.role.dto.MenuDto;

import java.util.List;
import java.util.UUID;

public interface MenuService {
    List<MenuDto> getAllMenusForAdmin();
    MenuDto getMenuForAdmin(UUID id);
    MenuDto createMenu(MenuDto request);
    MenuDto updateMenu(UUID id, MenuDto request);
    void deleteMenu(UUID id);
    List<MenuDto> getCurrentUserMenus(String username);
}
