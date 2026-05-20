package com.quanlydaotao.backend.studentstatus.mapper;

import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogResponse;
import com.quanlydaotao.backend.studentstatus.entity.StudentStatusCatalog;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentStatusCatalogMapper {
    StudentStatusCatalogResponse toDto(StudentStatusCatalog entity);

    StudentStatusCatalog toEntity(StudentStatusCatalogResponse dto);

    List<StudentStatusCatalogResponse> toDtoList(List<StudentStatusCatalog> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(StudentStatusCatalogRequest dto, @MappingTarget StudentStatusCatalog entity);
}
