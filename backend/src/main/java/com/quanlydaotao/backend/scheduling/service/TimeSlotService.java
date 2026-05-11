package com.quanlydaotao.backend.scheduling.service;

import com.quanlydaotao.backend.scheduling.dto.TimeSlotDto;

import java.util.List;
import java.util.UUID;

public interface TimeSlotService {
    List<TimeSlotDto> getAll();
    TimeSlotDto getById(UUID id);
    TimeSlotDto create(TimeSlotDto dto);
    TimeSlotDto update(UUID id, TimeSlotDto dto);
    void delete(UUID id);
}
