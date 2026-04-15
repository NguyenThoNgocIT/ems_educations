package com.quanlydaotao.backend.common;

import java.time.Instant;

public class BaseResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String timestamp;

    public BaseResponse() {
    }

    public BaseResponse(boolean success, String message, T data, String timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public static <T> BaseResponse<T> success(T data) {
        return success(data, "OK");
    }

    public static <T> BaseResponse<T> success(T data, String message) {
        return new BaseResponse<>(
            true,
            message,
            data,
            Instant.now().toString()
        );
    }

    public static <T> BaseResponse<T> failure(String message) {
        return new BaseResponse<>(
            false,
            message,
            null,
            Instant.now().toString()
        );
    }
}
