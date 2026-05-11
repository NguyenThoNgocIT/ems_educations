package com.quanlydaotao.backend.facility.mapper;

import com.quanlydaotao.backend.facility.dto.RoomDto;
import com.quanlydaotao.backend.facility.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoomMapper {
    @Mapping(target = "buildingId", source = "building.buildingId")
    @Mapping(target = "buildingName", source = "building.name")
    RoomDto toDto(Room entity);

    @Mapping(target = "building.buildingId", source = "buildingId")
    Room toEntity(RoomDto dto);

    List<RoomDto> toDtoList(List<Room> entities);

    @Mapping(target = "building", ignore = true)
    void updateEntityFromDto(RoomDto dto, @MappingTarget Room entity);
}
