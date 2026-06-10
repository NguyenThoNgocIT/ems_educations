package com.quanlydaotao.backend.course.mapper;

import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.entity.CourseClass;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseClassMapper {
    @Mapping(target = "id", source = "courseClassId")
    @Mapping(target = "courseCode", source = "course.code")
    @Mapping(target = "courseName", source = "course.name")
    @Mapping(target = "departmentId", source = "course.departmentId")
    @Mapping(target = "credits", source = "course.credits")
    @Mapping(target = "theoryHours", source = "course.theoryHours")
    @Mapping(target = "practiceHours", source = "course.practiceHours")
    CourseClassDto toDto(CourseClass entity);

    @Mapping(target = "courseClassId", source = "id")
    CourseClass toEntity(CourseClassDto dto);

    List<CourseClassDto> toDtoList(List<CourseClass> entities);

    @Mapping(target = "courseClassId", ignore = true)
    @Mapping(target = "currentStudent", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(CourseClassDto dto, @MappingTarget CourseClass entity);
}
