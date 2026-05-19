package com.quanlydaotao.backend.semester.mapper;

import com.quanlydaotao.backend.semester.dto.SemesterRequest;
import com.quanlydaotao.backend.semester.dto.SemesterResponse;
import com.quanlydaotao.backend.semester.entity.Semester;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SemesterMapper {
    SemesterResponse toDto(Semester entity);

    Semester toEntity(SemesterRequest dto);

    List<SemesterResponse> toDtoList(List<Semester> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(SemesterRequest dto, @MappingTarget Semester entity);
}
