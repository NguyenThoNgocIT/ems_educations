package com.quanlydaotao.backend.facility.service;

import com.quanlydaotao.backend.facility.dto.RoomDto;
import java.util.List;
import java.util.UUID;

public interface RoomService {
    List<RoomDto> getAll();
    RoomDto getById(UUID id);
    RoomDto create(RoomDto dto);
    RoomDto update(UUID id, RoomDto dto);
    void delete(UUID id);
}
