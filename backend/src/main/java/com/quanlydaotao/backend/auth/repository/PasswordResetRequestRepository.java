package com.quanlydaotao.backend.auth.repository;

import com.quanlydaotao.backend.auth.entity.PasswordResetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, UUID> {
    List<PasswordResetRequest> findByStatusOrderByCreatedAtDesc(String status);
}
