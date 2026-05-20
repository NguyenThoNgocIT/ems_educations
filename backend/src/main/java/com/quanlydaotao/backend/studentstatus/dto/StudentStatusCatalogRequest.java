package com.quanlydaotao.backend.studentstatus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentStatusCatalogRequest {
    @NotBlank(message = "Mã trạng thái không được để trống")
    private String code;

    @NotBlank(message = "Tên trạng thái không được để trống")
    private String name;

    private String description;
    private String statusType;
    private Boolean isActive;
}
