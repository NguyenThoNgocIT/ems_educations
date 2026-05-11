package com.quanlydaotao.backend.facility.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.facility.dto.RoomDto;
import com.quanlydaotao.backend.facility.entity.Building;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.mapper.RoomMapper;
import com.quanlydaotao.backend.facility.repository.BuildingRepository;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.facility.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final BuildingRepository buildingRepository;
    private final RoomMapper roomMapper;

    @Override
    public List<RoomDto> getAll() {
        return roomMapper.toDtoList(roomRepository.findAll());
    }

    @Override
    public RoomDto getById(UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng học với ID: " + id));
        return roomMapper.toDto(room);
    }

    @Override
    @Transactional
    public RoomDto create(RoomDto dto) {
        Building building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + dto.getBuildingId()));

        Room room = roomMapper.toEntity(dto);
        room.setBuilding(building);
        
        return roomMapper.toDto(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomDto update(UUID id, RoomDto dto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng học với ID: " + id));
        
        Building building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + dto.getBuildingId()));

        roomMapper.updateEntityFromDto(dto, room);
        room.setBuilding(building);
        
        return roomMapper.toDto(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng học với ID: " + id));
        roomRepository.delete(room);
    }
}
