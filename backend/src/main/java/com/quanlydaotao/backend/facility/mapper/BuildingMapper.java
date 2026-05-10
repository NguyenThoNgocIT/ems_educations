package com.quanlydaotao.backend.facility.mapper;

import com.quanlydaotao.backend.facility.dto.BuildingDto;
import com.quanlydaotao.backend.facility.entity.Building;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BuildingMapper {
    BuildingDto toDto(Building entity);
    Building toEntity(BuildingDto dto);
    List<BuildingDto> toDtoList(List<Building> entities);
    void updateEntityFromDto(BuildingDto dto, @MappingTarget Building entity);
}
