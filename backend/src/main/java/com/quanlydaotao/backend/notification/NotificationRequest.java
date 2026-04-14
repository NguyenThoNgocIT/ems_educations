package com.quanlydaotao.backend.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    private String type;

    @NotBlank
    private String priority;

    @NotNull
    private UUID senderId;

    private UUID receiverId;

    private String targetRole;

    private String sendChannel;

    private String relatedType;

    private UUID relatedId;
}
