package com.quanlydaotao.backend.user.repository;

import com.quanlydaotao.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:isLocked IS NULL OR " +
           "(:isLocked = true AND u.lockoutEndAt IS NOT NULL AND u.lockoutEndAt > CURRENT_TIMESTAMP) OR " +
           "(:isLocked = false AND (u.lockoutEndAt IS NULL OR u.lockoutEndAt <= CURRENT_TIMESTAMP))" +
           ")")
    Page<User> searchUsers(@Param("keyword") String keyword, @Param("isActive") Boolean isActive, @Param("isLocked") Boolean isLocked, Pageable pageable);
}
