package com.quanlydaotao.backend.course.mapper;

import com.quanlydaotao.backend.course.dto.CourseDto;
import com.quanlydaotao.backend.course.entity.Course;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseMapper {
    @Mapping(target = "id", source = "courseId")
    CourseDto toDto(Course entity);

    @Mapping(target = "courseId", source = "id")
    Course toEntity(CourseDto dto);

    List<CourseDto> toDtoList(List<Course> entities);

    @Mapping(target = "courseId", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(CourseDto dto, @MappingTarget Course entity);
}
