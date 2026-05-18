package com.quanlydaotao.backend.role.repository;

import com.quanlydaotao.backend.role.entity.Menus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuRepository extends JpaRepository<Menus, UUID> {
    List<Menus> findByIsActiveTrueOrderByOrderIndexAscMenuTitleAsc();
    List<Menus> findByIsActiveTrueAndPermissionIsNullOrderByOrderIndexAscMenuTitleAsc();

    @Query("""
            SELECT DISTINCT m
            FROM Menus m
            LEFT JOIN FETCH m.permission p
            WHERE m.isActive = true
              AND (p IS NULL OR p.code IN :permissionCodes)
            ORDER BY m.orderIndex ASC, m.menuTitle ASC
            """)
    List<Menus> findVisibleMenus(@Param("permissionCodes") List<String> permissionCodes);
}
