package com.quanlydaotao.backend.schoolyear.mapper;

import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SchoolYearMapper {
    SchoolYearResponse toDto(SchoolYear entity);

    SchoolYear toEntity(SchoolYearRequest dto);

    List<SchoolYearResponse> toDtoList(List<SchoolYear> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(SchoolYearRequest dto, @MappingTarget SchoolYear entity);
}
