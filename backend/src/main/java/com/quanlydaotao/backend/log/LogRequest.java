package com.quanlydaotao.backend.log;

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
public class LogRequest {

    @NotNull
    private UUID userId;

    @NotBlank
    private String action;

    @NotBlank
    private String tableName;

    @NotNull
    private UUID recordId;

    private String oldValue;

    private String newValue;

    private String ipAddress;

    private String userAgent;
}
