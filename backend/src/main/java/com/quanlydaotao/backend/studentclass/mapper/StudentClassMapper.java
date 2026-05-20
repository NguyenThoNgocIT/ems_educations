package com.quanlydaotao.backend.studentclass.mapper;

import com.quanlydaotao.backend.studentclass.dto.StudentClassRequest;
import com.quanlydaotao.backend.studentclass.dto.StudentClassResponse;
import com.quanlydaotao.backend.studentclass.entity.StudentClass;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentClassMapper {
    StudentClassResponse toDto(StudentClass entity);

    StudentClass toEntity(StudentClassResponse dto);

    List<StudentClassResponse> toDtoList(List<StudentClass> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(StudentClassRequest dto, @MappingTarget StudentClass entity);
}
