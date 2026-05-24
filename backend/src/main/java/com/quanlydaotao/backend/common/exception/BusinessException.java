package com.quanlydaotao.backend.common.exception;

import java.util.Locale;

public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessException(String message) {
        super(message);
        this.errorCode = inferErrorCode(message);
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    private static ErrorCode inferErrorCode(String message) {
        if (message == null) {
            return ErrorCode.BAD_REQUEST;
        }
        String normalized = message.toLowerCase(Locale.ROOT);
        if (normalized.contains("không có quyền")) {
            return ErrorCode.FORBIDDEN;
        }
        if (normalized.contains("không tồn tại") || normalized.contains("không tìm thấy")) {
            return ErrorCode.RESOURCE_NOT_FOUND;
        }
        if (normalized.contains("đã tồn tại")
                || normalized.contains("đã có")
                || normalized.contains("đã đăng ký")
                || normalized.contains("đã được")
                || normalized.contains("trùng")) {
            return ErrorCode.CONFLICT;
        }
        if (normalized.contains("không được để trống")
                || normalized.contains("không hợp lệ")
                || normalized.contains("phải")
                || normalized.contains("không được âm")) {
            return ErrorCode.VALIDATION_ERROR;
        }
        return ErrorCode.BAD_REQUEST;
    }
}

