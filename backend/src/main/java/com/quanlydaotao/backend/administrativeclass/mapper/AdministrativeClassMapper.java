package com.quanlydaotao.backend.administrativeclass.mapper;

import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdministrativeClassMapper {
    AdministrativeClassResponse toDto(AdministrativeClass entity);

    AdministrativeClass toEntity(AdministrativeClassRequest dto);

    List<AdministrativeClassResponse> toDtoList(List<AdministrativeClass> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(AdministrativeClassRequest dto, @MappingTarget AdministrativeClass entity);
}
