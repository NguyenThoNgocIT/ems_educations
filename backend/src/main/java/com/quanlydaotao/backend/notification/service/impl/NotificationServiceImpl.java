package com.quanlydaotao.backend.notification.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.notification.dto.NotificationResponse;
import com.quanlydaotao.backend.notification.entity.Notification;
import com.quanlydaotao.backend.notification.entity.UserNotification;
import com.quanlydaotao.backend.notification.repository.NotificationRepository;
import com.quanlydaotao.backend.notification.repository.UserNotificationRepository;
import com.quanlydaotao.backend.notification.service.NotificationService;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        List<UserNotification> list = userNotificationRepository.findActiveByUserId(user.getUserId());
        return list.stream()
                .map(un -> NotificationResponse.builder()
                        .userNotificationId(un.getUserNotificationId())
                        .notificationId(un.getNotificationId())
                        .title(un.getNotification().getTitle())
                        .content(un.getNotification().getContent())
                        .typeId(un.getNotification().getTypeId())
                        .priority(un.getNotification().getPriority())
                        .isRead(un.getIsRead())
                        .createdAt(un.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCountForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        return userNotificationRepository.countUnreadByUserId(user.getUserId());
    }

    @Override
    @Transactional
    public void markAsRead(String username, UUID userNotificationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        UserNotification un = userNotificationRepository.findById(userNotificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông báo"));
        if (!un.getUserId().equals(user.getUserId())) {
            throw new BusinessException("Không có quyền chỉnh sửa thông báo này");
        }
        if (!un.getIsRead()) {
            un.setIsRead(true);
            un.setReadAt(LocalDateTime.now());
            userNotificationRepository.save(un);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        List<UserNotification> list = userNotificationRepository.findActiveByUserId(user.getUserId());
        LocalDateTime now = LocalDateTime.now();
        for (UserNotification un : list) {
            if (!un.getIsRead()) {
                un.setIsRead(true);
                un.setReadAt(now);
                userNotificationRepository.save(un);
            }
        }
    }

    @Override
    @Transactional
    public void createNotificationForRole(String roleCode, String title, String content, String typeId, String priority) {
        Role role = roleRepository.findByCode(roleCode).orElse(null);
        UUID targetRoleId = role != null ? role.getRoleId() : null;

        Notification notification = Notification.builder()
                .title(title)
                .content(content)
                .typeId(typeId)
                .priority(priority)
                .targetRoleId(targetRoleId)
                .build();
        notification = notificationRepository.save(notification);

        // Fetch user IDs belonging to this role
        List<UUID> userIds = userRoleRepository.findUserIdsByRoleCode(roleCode);
        for (UUID userId : userIds) {
            UserNotification userNotification = UserNotification.builder()
                    .userId(userId)
                    .notificationId(notification.getNotificationId())
                    .isRead(false)
                    .isActive(true)
                    .build();
            userNotificationRepository.save(userNotification);
        }
    }

    @Override
    @Transactional
    public void createNotificationForUser(UUID userId, String title, String content, String typeId, String priority) {
        Notification notification = Notification.builder()
                .title(title)
                .content(content)
                .typeId(typeId)
                .priority(priority)
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .userId(userId)
                .notificationId(notification.getNotificationId())
                .isRead(false)
                .isActive(true)
                .build();
        userNotificationRepository.save(userNotification);
    }
}
