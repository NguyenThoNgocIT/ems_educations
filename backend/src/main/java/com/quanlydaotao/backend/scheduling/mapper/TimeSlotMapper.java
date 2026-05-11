package com.quanlydaotao.backend.scheduling.mapper;

import com.quanlydaotao.backend.scheduling.dto.TimeSlotDto;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TimeSlotMapper {
    TimeSlotDto toDto(TimeSlot entity);
    TimeSlot toEntity(TimeSlotDto dto);
    List<TimeSlotDto> toDtoList(List<TimeSlot> entities);
    void updateEntityFromDto(TimeSlotDto dto, @MappingTarget TimeSlot entity);
}
