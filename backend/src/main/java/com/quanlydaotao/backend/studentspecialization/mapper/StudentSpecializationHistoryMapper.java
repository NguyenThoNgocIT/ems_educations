package com.quanlydaotao.backend.studentspecialization.mapper;

import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationAssignRequest;
import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationHistoryResponse;
import com.quanlydaotao.backend.studentspecialization.entity.StudentSpecializationHistory;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentSpecializationHistoryMapper {
    StudentSpecializationHistoryResponse toDto(StudentSpecializationHistory entity);

    StudentSpecializationHistory toEntity(StudentSpecializationHistoryResponse dto);

    List<StudentSpecializationHistoryResponse> toDtoList(List<StudentSpecializationHistory> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(StudentSpecializationAssignRequest dto, @MappingTarget StudentSpecializationHistory entity);
}
