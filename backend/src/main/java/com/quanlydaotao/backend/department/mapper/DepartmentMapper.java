package com.quanlydaotao.backend.department.mapper;

import com.quanlydaotao.backend.department.dto.DepartmentDto;
import com.quanlydaotao.backend.department.entity.Department;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DepartmentMapper {
    DepartmentDto toDto(Department entity);

    Department toEntity(DepartmentDto dto);

    List<DepartmentDto> toDtoList(List<Department> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(DepartmentDto dto, @MappingTarget Department entity);
}
