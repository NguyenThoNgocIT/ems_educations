package com.quanlydaotao.backend.notification;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "notification-controller")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(@RequestParam UUID userId) {
        return ResponseEntity.ok(notificationService.getMyNotifications(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> countUnread(@RequestParam UUID userId) {
        return ResponseEntity.ok(notificationService.countUnread(userId));
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.createNotification(request));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Notification>> sendBulkNotifications(@Valid @RequestBody List<NotificationRequest> requests) {
        List<Notification> created = requests.stream()
                .map(notificationService::createNotification)
                .toList();
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable UUID id, @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.updateNotification(id, request));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> readAll(@RequestParam UUID userId) {
        notificationService.getMyNotifications(userId).forEach(notification -> notificationService.markRead(notification.getId()));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/hide")
    public ResponseEntity<Notification> hideNotification(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.hideNotification(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
