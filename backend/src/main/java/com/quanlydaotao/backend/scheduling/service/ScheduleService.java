package com.quanlydaotao.backend.scheduling.service;

import com.quanlydaotao.backend.scheduling.dto.ScheduleDto;

import java.util.List;
import java.util.UUID;

public interface ScheduleService {
    List<ScheduleDto> getAll();
    List<ScheduleDto> getByCourseClass(UUID courseClassId);
    List<ScheduleDto> getByInstructor(UUID instructorId);
    List<ScheduleDto> getByRoom(UUID roomId);
    ScheduleDto create(ScheduleDto dto);
    ScheduleDto update(UUID id, ScheduleDto dto);
    void delete(UUID id);
}
