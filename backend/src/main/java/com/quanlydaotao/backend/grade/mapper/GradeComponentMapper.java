package com.quanlydaotao.backend.grade.mapper;

import com.quanlydaotao.backend.grade.dto.GradeComponentRequest;
import com.quanlydaotao.backend.grade.dto.GradeComponentResponse;
import com.quanlydaotao.backend.grade.entity.GradeComponent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GradeComponentMapper {
    @Mapping(target = "courseCode", source = "course.code")
    @Mapping(target = "courseName", source = "course.name")
    GradeComponentResponse toDto(GradeComponent entity);

    GradeComponent toEntity(GradeComponentRequest dto);

    List<GradeComponentResponse> toDtoList(List<GradeComponent> entities);

    void updateEntityFromDto(GradeComponentRequest dto, @MappingTarget GradeComponent entity);
}
