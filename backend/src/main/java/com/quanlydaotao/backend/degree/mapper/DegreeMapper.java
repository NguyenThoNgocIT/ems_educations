package com.quanlydaotao.backend.degree.mapper;

import com.quanlydaotao.backend.degree.dto.DegreeDto;
import com.quanlydaotao.backend.degree.entity.Degree;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DegreeMapper {
    DegreeDto toDto(Degree entity);

    Degree toEntity(DegreeDto dto);

    List<DegreeDto> toDtoList(List<Degree> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(DegreeDto dto, @MappingTarget Degree entity);
}
