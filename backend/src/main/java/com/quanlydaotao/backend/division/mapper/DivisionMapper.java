package com.quanlydaotao.backend.division.mapper;

import com.quanlydaotao.backend.division.dto.DivisionDto;
import com.quanlydaotao.backend.division.entity.Division;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DivisionMapper {
    DivisionDto toDto(Division entity);

    Division toEntity(DivisionDto dto);

    List<DivisionDto> toDtoList(List<Division> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(DivisionDto dto, @MappingTarget Division entity);
}
