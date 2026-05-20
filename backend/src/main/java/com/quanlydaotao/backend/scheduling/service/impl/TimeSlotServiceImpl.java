package com.quanlydaotao.backend.scheduling.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.scheduling.dto.TimeSlotDto;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.mapper.TimeSlotMapper;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.scheduling.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;

    @Override
    public List<TimeSlotDto> getAll() {
        return timeSlotMapper.toDtoList(timeSlotRepository.findAll());
    }

    @Override
    public TimeSlotDto getById(UUID id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ca học với ID: " + id));
        return timeSlotMapper.toDto(timeSlot);
    }

    @Override
    @Transactional
    public TimeSlotDto create(TimeSlotDto dto) {
        TimeSlot timeSlot = timeSlotMapper.toEntity(dto);
        if (timeSlot.getIsActive() == null) {
            timeSlot.setIsActive(true);
        }
        return timeSlotMapper.toDto(timeSlotRepository.save(timeSlot));
    }

    @Override
    @Transactional
    public TimeSlotDto update(UUID id, TimeSlotDto dto) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ca học với ID: " + id));
        
        // Cập nhật thủ công, KHÔNG dùng mapper để tránh lỗi ID
        timeSlot.setSlotCode(dto.getSlotCode());
        timeSlot.setStartTime(dto.getStartTime());
        timeSlot.setEndTime(dto.getEndTime());
        if (dto.getIsActive() != null) {
            timeSlot.setIsActive(dto.getIsActive());
        }
        
        return timeSlotMapper.toDto(timeSlotRepository.save(timeSlot));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ca học với ID: " + id));
        timeSlotRepository.delete(timeSlot);
    }
}