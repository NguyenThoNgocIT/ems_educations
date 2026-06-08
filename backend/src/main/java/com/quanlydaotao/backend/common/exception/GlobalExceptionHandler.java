package com.quanlydaotao.backend.common.exception;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import jakarta.persistence.NonUniqueResultException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return buildErrorResponse(ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentialsException(BadCredentialsException ex) {
        return buildErrorResponse(ErrorCode.UNAUTHORIZED, "Tên đăng nhập hoặc mật khẩu không chính xác.");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return buildErrorResponse(ErrorCode.FORBIDDEN, ErrorCode.FORBIDDEN.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusinessException(BusinessException ex) {
        return buildErrorResponse(ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        return buildErrorResponse(ErrorCode.VALIDATION_ERROR, resolveValidationMessage(ex));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return buildErrorResponse(ErrorCode.BAD_REQUEST, "Du lieu JSON khong hop le hoac sai kieu du lieu.");
    }

    @ExceptionHandler({IncorrectResultSizeDataAccessException.class, NonUniqueResultException.class})
    public ResponseEntity<ApiResponse<Object>> handleNonUniqueResultException(Exception ex) {
        return buildErrorResponse(ErrorCode.NON_UNIQUE_RESULT,
                "Dữ liệu trong hệ thống đang bị trùng lặp hoặc không nhất quán. Vui lòng kiểm tra lại thông tin đã nhập.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return buildErrorResponse(ErrorCode.DATA_INTEGRITY_CONFLICT,
                "Dữ liệu không hợp lệ hoặc bị trùng lặp. Vui lòng kiểm tra lại thông tin đã nhập.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        return buildErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
    }

    private ResponseEntity<ApiResponse<Object>> buildErrorResponse(ErrorCode errorCode, String message) {
        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.error(message, errorCode));
    }

    private String resolveValidationMessage(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        if (fieldError != null && fieldError.getDefaultMessage() != null) {
            return fieldError.getDefaultMessage();
        }
        ObjectError globalError = ex.getBindingResult().getGlobalError();
        if (globalError != null && globalError.getDefaultMessage() != null) {
            return globalError.getDefaultMessage();
        }
        return ErrorCode.VALIDATION_ERROR.getMessage();
    }
}
