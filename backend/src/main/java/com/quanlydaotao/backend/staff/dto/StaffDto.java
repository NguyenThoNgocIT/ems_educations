package com.quanlydaotao.backend.staff.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class StaffDto {
    private UUID employeeId;
    private String staffCode;
    private UUID divisionId;
    private UUID positionId;
}
