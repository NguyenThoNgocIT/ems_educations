package com.quanlydaotao.backend.notification.service;

import com.quanlydaotao.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnBean(JavaMailSender.class)
public class EmailNotificationService {
    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public void sendAccountConfirmation(User user, String rawPassword, String confirmationLink) {
        sendPasswordMessage(
                user,
                "Xác nhận tài khoản UEMS",
                "Tài khoản của bạn đã được tạo.\n"
                        + "Tên đăng nhập: " + user.getUsername() + "\n"
                        + "Email edu: " + user.getEmail() + "\n"
                        + "Mật khẩu mặc định: " + rawPassword + "\n"
                        + "Vui lòng đổi mật khẩu tại: " + confirmationLink
        );
    }

    public void sendPasswordResetConfirmation(User user, String rawPassword, String confirmationLink) {
        sendPasswordMessage(
                user,
                "Reset mật khẩu UEMS",
                "Admin đã reset mật khẩu cho tài khoản của bạn.\n"
                        + "Tên đăng nhập: " + user.getUsername() + "\n"
                        + "Mật khẩu mặc định: " + rawPassword + "\n"
                        + "Vui lòng đăng nhập và đổi mật khẩu, hoặc đổi trực tiếp tại: " + confirmationLink
        );
    }

    private void sendPasswordMessage(User user, String subject, String text) {
        if (!mailEnabled) {
            log.info("Mail disabled. Skip sending password email to {}", user.getEmail());
            return;
        }
        if (!StringUtils.hasText(user.getEmail())) {
            log.warn("Cannot send password email because user {} has no email", user.getUsername());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (StringUtils.hasText(fromAddress)) {
            message.setFrom(fromAddress);
        }
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(text);
        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.warn("Cannot send password email to {}: {}", user.getEmail(), ex.getMessage());
        }
    }
}
