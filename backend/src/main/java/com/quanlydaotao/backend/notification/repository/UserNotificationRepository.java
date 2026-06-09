package com.quanlydaotao.backend.notification.repository;

import com.quanlydaotao.backend.notification.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, UUID> {

    @Query("SELECT un FROM UserNotification un JOIN FETCH un.notification n " +
           "WHERE un.userId = :userId AND un.isActive = true AND n.isActive = true " +
           "ORDER BY un.createdAt DESC")
    List<UserNotification> findActiveByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(un) FROM UserNotification un JOIN un.notification n " +
           "WHERE un.userId = :userId AND un.isRead = false AND un.isActive = true AND n.isActive = true")
    long countUnreadByUserId(@Param("userId") UUID userId);
}
