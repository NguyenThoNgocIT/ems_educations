package com.quanlydaotao.backend.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Lỗi hệ thống"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Yêu cầu không hợp lệ"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Dữ liệu không hợp lệ"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Chưa xác thực"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "Không có quyền truy cập"),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", "Không tìm thấy dữ liệu"),
    CONFLICT(HttpStatus.CONFLICT, "CONFLICT", "Dữ liệu xung đột"),
    DATA_INTEGRITY_CONFLICT(HttpStatus.CONFLICT, "DATA_INTEGRITY_CONFLICT", "Dữ liệu không hợp lệ hoặc bị trùng lặp"),
    NON_UNIQUE_RESULT(HttpStatus.CONFLICT, "NON_UNIQUE_RESULT", "Dữ liệu bị trùng lặp hoặc không nhất quán"),

    SCHEDULE_ADJUSTMENT_INVALID(HttpStatus.BAD_REQUEST, "SCHEDULE_ADJUSTMENT_INVALID", "Yêu cầu điều chỉnh lịch không hợp lệ"),
    SCHEDULE_ADJUSTMENT_NOT_REVIEWABLE(HttpStatus.BAD_REQUEST, "SCHEDULE_ADJUSTMENT_NOT_REVIEWABLE", "Yêu cầu không ở trạng thái có thể xử lý"),
    SCHEDULE_ORIGINAL_NOT_FOUND(HttpStatus.NOT_FOUND, "SCHEDULE_ORIGINAL_NOT_FOUND", "Không tìm thấy lịch gốc"),
    SCHEDULE_ALREADY_HAS_PENDING_REQUEST(HttpStatus.CONFLICT, "SCHEDULE_ALREADY_HAS_PENDING_REQUEST", "Buổi học đã có yêu cầu đang xử lý"),
    SCHEDULE_INSTRUCTOR_NOT_ASSIGNED(HttpStatus.FORBIDDEN, "SCHEDULE_INSTRUCTOR_NOT_ASSIGNED", "Giảng viên chưa được phân công lớp học phần"),
    SCHEDULE_INSTRUCTOR_CONFLICT(HttpStatus.CONFLICT, "SCHEDULE_INSTRUCTOR_CONFLICT", "Giảng viên bị trùng lịch"),
    SCHEDULE_ROOM_CONFLICT(HttpStatus.CONFLICT, "SCHEDULE_ROOM_CONFLICT", "Phòng học bị trùng lịch"),
    SCHEDULE_OUT_OF_SEMESTER(HttpStatus.BAD_REQUEST, "SCHEDULE_OUT_OF_SEMESTER", "Ngày đề xuất nằm ngoài học kỳ"),
    SCHEDULE_INSTRUCTOR_ON_LEAVE(HttpStatus.CONFLICT, "SCHEDULE_INSTRUCTOR_ON_LEAVE", "Giảng viên có đơn nghỉ đã duyệt");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
