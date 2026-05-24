package com.quanlydaotao.backend.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private Integer status;
    private String errorCode;
    private T data;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Thành công", data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, ErrorCode.BAD_REQUEST);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message != null ? message : errorCode.getMessage())
                .status(errorCode.getStatus().value())
                .errorCode(errorCode.getCode())
                .timestamp(LocalDateTime.now())
                .build();
    }
}
