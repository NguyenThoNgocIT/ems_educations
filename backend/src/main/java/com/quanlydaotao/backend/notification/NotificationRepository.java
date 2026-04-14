package com.quanlydaotao.backend.notification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Optional<Notification> findByIdAndIsActiveTrue(UUID id);

    List<Notification> findByIsActiveTrue();

    List<Notification> findByReceiverIdAndIsActiveTrue(UUID receiverId);

    List<Notification> findByReceiverIdAndIsReadFalseAndIsActiveTrue(UUID receiverId);

    List<Notification> findByTargetRoleAndIsActiveTrue(String targetRole);

    List<Notification> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseAndIsActiveTrue(
            String title,
            String content
    );
}
