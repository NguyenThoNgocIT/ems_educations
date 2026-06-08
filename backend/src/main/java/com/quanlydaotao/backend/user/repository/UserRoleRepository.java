package com.quanlydaotao.backend.user.repository;

import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

    @Query("SELECT ur FROM UserRole ur JOIN FETCH ur.role WHERE ur.id.userId = :userId AND ur.isActive = true")
    List<UserRole> findActiveRolesByUserId(@Param("userId") UUID userId);

    @Query("""
            SELECT COUNT(ur)
            FROM UserRole ur
            JOIN ur.user u
            WHERE ur.role.roleId = :roleId
              AND ur.isActive = true
              AND u.isActive = true
            """)
    long countActiveUsersByRoleId(@Param("roleId") UUID roleId);

    List<UserRole> findByUserUserId(UUID userId);
}

