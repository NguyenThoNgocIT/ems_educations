package com.quanlydaotao.backend.position.mapper;

import com.quanlydaotao.backend.position.dto.PositionDto;
import com.quanlydaotao.backend.position.entity.Position;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PositionMapper {
    PositionDto toDto(Position entity);

    Position toEntity(PositionDto dto);

    List<PositionDto> toDtoList(List<Position> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(PositionDto dto, @MappingTarget Position entity);
}
