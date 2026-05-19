package com.quanlydaotao.backend.academiccohort.mapper;

import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortRequest;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortResponse;
import com.quanlydaotao.backend.academiccohort.entity.AcademicCohort;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AcademicCohortMapper {
    AcademicCohortResponse toDto(AcademicCohort entity);

    AcademicCohort toEntity(AcademicCohortRequest dto);

    List<AcademicCohortResponse> toDtoList(List<AcademicCohort> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(AcademicCohortRequest dto, @MappingTarget AcademicCohort entity);
}
