package com.quanlydaotao.backend.course.mapper;

import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.entity.CoursePrerequisite;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CoursePrerequisiteMapper {
    PrerequisiteDto toDto(CoursePrerequisite entity);

    CoursePrerequisite toEntity(PrerequisiteDto dto);

    List<PrerequisiteDto> toDtoList(List<CoursePrerequisite> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(PrerequisiteDto dto, @MappingTarget CoursePrerequisite entity);
}
