package com.quanlydaotao.backend.teachingprogress.mapper;

import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogRequest;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogResponse;
import com.quanlydaotao.backend.teachingprogress.entity.TeachingProgressLog;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TeachingProgressLogMapper {
    TeachingProgressLogResponse toDto(TeachingProgressLog entity);

    TeachingProgressLog toEntity(TeachingProgressLogResponse dto);

    List<TeachingProgressLogResponse> toDtoList(List<TeachingProgressLog> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(TeachingProgressLogRequest dto, @MappingTarget TeachingProgressLog entity);
}
