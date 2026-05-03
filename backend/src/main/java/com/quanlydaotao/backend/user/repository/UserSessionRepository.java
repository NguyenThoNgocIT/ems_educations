package com.quanlydaotao.backend.user.repository;

import com.quanlydaotao.backend.user.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {
    List<UserSession> findByUserIdAndRevokedAtIsNull(UUID userId);
}

