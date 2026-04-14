package com.quanlydaotao.backend.notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findByIsActiveTrue();
    }

    public Notification getNotificationById(UUID id) {
        return notificationRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<Notification> getMyNotifications(UUID userId) {
        return notificationRepository.findByReceiverIdAndIsActiveTrue(userId);
    }

    public List<Notification> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByReceiverIdAndIsReadFalseAndIsActiveTrue(userId);
    }

    public Notification createNotification(NotificationRequest request) {
        validateRequest(request);
        Notification notification = Notification.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType())
                .priority(request.getPriority())
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .targetRole(request.getTargetRole())
                .sendChannel(request.getSendChannel())
                .status("ACTIVE")
                .relatedType(request.getRelatedType())
                .relatedId(request.getRelatedId())
                .build();
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(UUID id, NotificationRequest request) {
        validateRequest(request);
        Notification existing = getNotificationById(id);
        existing.setTitle(request.getTitle());
        existing.setContent(request.getContent());
        existing.setType(request.getType());
        existing.setPriority(request.getPriority());
        existing.setReceiverId(request.getReceiverId());
        existing.setTargetRole(request.getTargetRole());
        existing.setSendChannel(request.getSendChannel());
        existing.setRelatedType(request.getRelatedType());
        existing.setRelatedId(request.getRelatedId());
        return notificationRepository.save(existing);
    }

    public Notification markRead(UUID id) {
        Notification existing = getNotificationById(id);
        existing.setIsRead(true);
        return notificationRepository.save(existing);
    }

    public Notification hideNotification(UUID id) {
        Notification existing = getNotificationById(id);
        existing.setStatus("HIDDEN");
        return notificationRepository.save(existing);
    }

    public Notification readAll(UUID id) {
        // no-op for individual record, kept for controller convenience
        return markRead(id);
    }

    public void deleteNotification(UUID id) {
        Notification existing = getNotificationById(id);
        existing.setStatus("DELETED");
        existing.setDeletedAt(LocalDateTime.now());
        existing.setIsActive(false);
        notificationRepository.save(existing);
    }

    public long countUnread(UUID userId) {
        return getUnreadNotifications(userId).size();
    }

    public void deleteAllOld() {
        // intentionally left blank for future cleanup logic
    }

    private void validateRequest(NotificationRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()
                || request.getContent() == null || request.getContent().isBlank()
                || request.getType() == null || request.getType().isBlank()
                || request.getPriority() == null || request.getPriority().isBlank()
                || request.getSenderId() == null) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
