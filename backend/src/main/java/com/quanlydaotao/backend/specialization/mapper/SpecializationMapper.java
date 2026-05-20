package com.quanlydaotao.backend.specialization.mapper;

import com.quanlydaotao.backend.specialization.dto.SpecializationRequest;
import com.quanlydaotao.backend.specialization.dto.SpecializationResponse;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SpecializationMapper {
    SpecializationResponse toDto(Specialization entity);

    Specialization toEntity(SpecializationResponse dto);

    Specialization toEntity(SpecializationRequest dto);

    List<SpecializationResponse> toDtoList(List<Specialization> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(SpecializationRequest dto, @MappingTarget Specialization entity);
}
