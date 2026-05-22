package com.quanlydaotao.backend.teachingassignment.mapper;

import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentRequest;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentResponse;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TeachingAssignmentMapper {
    TeachingAssignmentResponse toDto(TeachingAssignment entity);

    TeachingAssignment toEntity(TeachingAssignmentResponse dto);

    List<TeachingAssignmentResponse> toDtoList(List<TeachingAssignment> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(TeachingAssignmentRequest dto, @MappingTarget TeachingAssignment entity);
}
