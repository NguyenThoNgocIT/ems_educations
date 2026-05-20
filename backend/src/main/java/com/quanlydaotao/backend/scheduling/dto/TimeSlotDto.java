package com.quanlydaotao.backend.scheduling.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDto {
    private UUID timeSlotId;
    
    @NotBlank(message = "Mã ca học không được để trống")
    private String slotCode;
    
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalTime startTime;
    
    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalTime endTime;
    
    private Boolean isActive;
}